const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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