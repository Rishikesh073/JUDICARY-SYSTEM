const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

// Set up Multer to handle the physical file upload from React
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// --- PASTE YOUR PINATA KEYS HERE ---
const PINATA_API_KEY = 'f62e7bd976397bb51c19';
const PINATA_SECRET_KEY = '1be4a2fc55cb3c3cdb4d7cb725b297d8c052836ca6646f41110c90178f5e1d1f';

// Middleware
app.use(cors());
app.use(express.json());

// --- PINATA UPLOAD ROUTE ---
app.post('/api/upload-vault', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log(`[Express] Received file: ${req.file.originalname}. Uploading to Pinata...`);

        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        // Prepare the form data for Pinata
        let data = new FormData();
        data.append('file', fs.createReadStream(req.file.path));

        // Optional: you can add metadata or options
        const metadata = JSON.stringify({
            name: req.body.title || req.file.originalname,
        });
        data.append('pinataMetadata', metadata);

        const response = await axios.post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            }
        });

        console.log("[Express] File pinned to IPFS successfully:", response.data.IpfsHash);

        // Clean up the local file after upload
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            ipfsHash: response.data.IpfsHash,
            url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
        });

    } catch (error) {
        console.error("[Express] Pinata upload error:", error.response?.data || error.message);
        // Clean up even if it fails
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: "Failed to upload to IPFS." });
    }
});

// The Route to talk to your Python AI
app.post('/api/ask-lexagent', async (req, res) => {
    try {
        const userQuery = req.body.query;

        console.log(`[Express] Received query: "${userQuery}". Forwarding to Python AI...`);

        // Forward the request to your FastAPI server
        const pythonResponse = await axios.post('http://127.0.0.1:8000/api/research', {
            query: userQuery
        });

        console.log("[Express] Received response from Python AI. Sending to frontend.");

        // Send the JSON back to the React frontend
        res.json(pythonResponse.data);

    } catch (error) {
        console.error("[Express] Error communicating with Python backend:", error.message);
        res.status(500).json({ error: "Failed to generate legal memo." });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Express bridge running on http://localhost:${PORT}`);
});