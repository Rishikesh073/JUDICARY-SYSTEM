const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const app = express();

const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

// Set up Multer to handle the physical file upload from React
const upload = multer({ dest: 'uploads/' });

// --- PINATA CONFIG (Loaded from .env) ---
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

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

        console.log(`[Express] Received query: "${userQuery}". Forwarding to Python AI for streaming...`);

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Ensure Express doesn't buffer
        res.flushHeaders();

        // Forward the request to your FastAPI server with streaming
        const pythonResponse = await axios.post('http://127.0.0.1:8000/api/research', {
            query: userQuery
        }, {
            responseType: 'stream'
        });

        console.log("[Express] Streaming response from Python AI to frontend...");

        // Pipe the stream directly to the React frontend
        pythonResponse.data.pipe(res);

    } catch (error) {
        console.error("[Express] Error communicating with Python backend:", error.message);
        // If headers are already sent, we can't send a 500 status code normally,
        // but if it failed to even connect to Python, headers might not be sent yet if we threw before flushHeaders
        // Actually flushHeaders sends the headers, so we just end the stream with an error event.
        res.write(`data: {"type": "error", "message": "Failed to connect to AI Engine"}\n\n`);
        res.end();
    }
});

// Bridge to get real stats from Python AI
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/stats');
        res.json(response.data);
    } catch (error) {
        console.error("[Express] Stats Error:", error.message);
        res.status(500).json({ error: "Failed to fetch real-time stats" });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Express bridge running on http://127.0.0.1:${PORT}`);
});