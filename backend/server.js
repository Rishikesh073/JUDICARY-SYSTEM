const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const app = express();

const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

app.use(cors());
app.use(express.json());

// ── VAULT ── Upload document to IPFS via Pinata
app.post('/api/upload-vault', upload.single('document'), async (req, res) => {
    try {
        const file = req.file;
        const caseTitle = req.body.title;
        const status = req.body.status || 'Pending';
        const caseNumber = req.body.caseNumber || 'N/A';

        if (!file) return res.status(400).json({ error: "No document provided" });

        let data = new FormData();
        data.append('file', fs.createReadStream(file.path));

        const pinataMetadata = JSON.stringify({
            name: caseTitle,
            keyvalues: { status, caseNumber, uploadDate: new Date().toISOString() }
        });
        data.append('pinataMetadata', pinataMetadata);

        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY
            }
        });

        fs.unlinkSync(file.path);
        const ipfsHash = response.data.IpfsHash;

        res.json({
            status: "success",
            title: caseTitle,
            ipfsHash,
            url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        });
    } catch (error) {
        console.error("[LexVault] Pinata Error:", error.message);
        res.status(500).json({ error: "Failed to secure document on Web3 network" });
    }
});

// ── VAULT HISTORY ── Fetch pinned files from Pinata
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

// ── RESEARCH ── Stream AI research from Python
app.post('/api/ask-lexagent', async (req, res) => {
    try {
        const userQuery = req.body.query;
        console.log(`[Express] Received query: "${userQuery}". Forwarding to Python AI...`);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const pythonResponse = await axios.post('http://127.0.0.1:8000/api/research', {
            query: userQuery
        }, { responseType: 'stream' });

        pythonResponse.data.pipe(res);
    } catch (error) {
        console.error("[Express] Error communicating with Python backend:", error.message);
        res.write(`data: {"type": "error", "message": "Failed to connect to AI Engine"}\n\n`);
        res.end();
    }
});

// ── DASHBOARD STATS ── Bridge to Python stats
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/stats');
        res.json(response.data);
    } catch (error) {
        console.error("[Express] Stats Error:", error.message);
        res.status(500).json({ error: "Failed to fetch real-time stats" });
    }
});

// ── CASE EXPLORER ── Browse/search 75-year database
app.post('/api/explorer', async (req, res) => {
    try {
        console.log('[Express] Explorer query received, forwarding to Python AI...');
        const response = await axios.post('http://127.0.0.1:8000/api/explorer', req.body, { timeout: 30000 });
        res.json(response.data);
    } catch (error) {
        console.error("[Express] Explorer Error:", error.message);
        res.status(500).json({ total: 0, cases: [], error: "Failed to connect to AI Engine" });
    }
});

// ── CASE DETAIL ── Fetch AI insights for a specific case
app.post('/api/case-detail', async (req, res) => {
    try {
        console.log('[Express] Case detail request for:', req.body.filename);
        const response = await axios.post('http://127.0.0.1:8000/api/case-detail', req.body, { timeout: 90000 });
        res.json(response.data);
    } catch (error) {
        console.error("[Express] Case Detail Error:", error.message);
        res.status(500).json({ error: "Failed to fetch case details" });
    }
});

// ── MEMO HISTORY ── Bridge to Python AI history
app.get('/api/history', async (req, res) => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/history');
        res.json(response.data);
    } catch (error) {
        console.error("[Express] History Error:", error.message);
        res.status(500).json([]);
    }
});

// ── RAW PDF ENGINE ── Stream directly from D: drive for instant demo
const path = require('path');
const PDF_VAULT = 'D:\\Indian Judicial Data\\supreme_court_judgments';

app.get('/api/raw-pdfs/:year/:filename', (req, res) => {
    try {
        const { year, filename } = req.params;
        const cleanYear = year.trim();
        const cleanFilename = filename.trim();
        
        const filePath = path.join(PDF_VAULT, cleanYear, cleanFilename);
        
        if (fs.existsSync(filePath)) {
            if (req.query.download === 'true') {
                res.download(filePath, cleanFilename);
            } else {
                res.contentType("application/pdf");
                res.sendFile(filePath);
            }
        } else {
            console.error(`[PDF Engine] File not found: ${filePath}`);
            res.status(404).send('Judgment PDF not found in local vault');
        }
    } catch (error) {
        console.error("[PDF Engine] Error:", error.message);
        res.status(500).send('Internal Server Error while fetching PDF');
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Express bridge running on http://127.0.0.1:${PORT}`);
});
