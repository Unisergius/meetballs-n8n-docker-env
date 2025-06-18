const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// N8N configuration
const N8N_URL = process.env.N8N_URL || 'http://n8n:5678';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Proxy endpoint to trigger n8n workflows
app.post('/workflow/:id/trigger', async (req, res) => {
  try {
    const workflowId = req.params.id;
    const response = await axios.post(
      `${N8N_URL}/webhook/${workflowId}`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error triggering workflow:', error.message);
    res.status(500).json({
      error: 'Failed to trigger workflow',
      message: error.message
    });
  }
});

// Get workflow status
app.get('/workflow/:id', async (req, res) => {
  try {
    const workflowId = req.params.id;
    const response = await axios.get(`${N8N_URL}/workflows/${workflowId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error getting workflow status:', error.message);
    res.status(500).json({
      error: 'Failed to get workflow status',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
  console.log(`Connected to n8n at ${N8N_URL}`);
});
