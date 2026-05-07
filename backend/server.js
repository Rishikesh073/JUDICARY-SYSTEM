const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

// Set up Multer to handle the physical file upload from React
const upload = multer({ dest: 'uploads/' });

// --- PASTE YOUR PINATA KEYS HERE ---
const PINATA_API_KEY = 'f62e7bd976397bb51c19';
const PINATA_SECRET_KEY = '1be4a2fc55cb3c3cdb4d7cb725b297d8c052836ca6646f41110c90178f5e1d1f';

// Middleware
app.use(cors());
app.use(express.json());



// The Readymade Web3 Route
app.post('/api/upload-vault', upload.single('document'), async (req, res) => {
    try {
        const file = req.file;
        const caseTitle = req.body.title;

        const status = req.body.status || 'Pending';
        const caseNumber = req.body.caseNumber || 'N/A';

        if (!file) return res.status(400).json({ error: "No document provided" });

        console.log(`[LexVault] Preparing to upload "${caseTitle}" to decentralized IPFS network...`);

        // Package the file for Pinata
        let data = new FormData();
        data.append('file', fs.createReadStream(file.path));

        // Add metadata for history tracking
        const pinataMetadata = JSON.stringify({
            name: caseTitle,
            keyvalues: {
                status: status,
                caseNumber: caseNumber,
                uploadDate: new Date().toISOString()
            }
        });
        data.append('pinataMetadata', pinataMetadata);

        // Call the Pinata IPFS API
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY
            }
        });

        // Clean up the temporary local file
        fs.unlinkSync(file.path);

        const ipfsHash = response.data.IpfsHash;
        const permanentUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        console.log(`[LexVault] Success! File secured on IPFS. Hash: ${ipfsHash}`);

        // Return the decentralized data to React
        res.json({
            status: "success",
            title: caseTitle,
            ipfsHash: ipfsHash,
            url: permanentUrl
        });

    } catch (error) {
        console.error("[LexVault] Pinata Error:", error.message);
        res.status(500).json({ error: "Failed to secure document on Web3 network" });
    }
});

// Route to fetch upload history from Pinata
app.get('/api/vault-history', async (req, res) => {
    try {
        const response = await axios.get('https://api.pinata.cloud/data/pinList?status=pinned', {
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY
            }
        });

        const history = response.data.rows.map(row => ({
            ipfsHash: row.ipfs_pin_hash,
            title: row.metadata?.name || 'Untitled Document',
            status: row.metadata?.keyvalues?.status || 'Live',
            caseNumber: row.metadata?.keyvalues?.caseNumber || 'N/A',
            uploadDate: row.metadata?.keyvalues?.uploadDate || row.date_pinned,
            url: `https://gateway.pinata.cloud/ipfs/${row.ipfs_pin_hash}`
        }));

        res.json(history);
    } catch (error) {
        console.error("[LexVault] History Fetch Error:", error.message);
        res.status(500).json({ error: "Failed to fetch vault history" });
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