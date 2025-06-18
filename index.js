const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// N8N configuration
const N8N_URL = process.env.N8N_URL || 'http://n8n:5678';

// Define available endpoints and their descriptions
const endpoints = {
  '/': {
    method: 'GET',
    description: 'List all available endpoints',
    parameters: null,
  },
  '/health': {
    method: 'GET',
    description: 'Check the health status of the API',
    parameters: null,
  },
  '/workflow/:id/trigger': {
    method: 'POST',
    description: 'Trigger a specific n8n workflow',
    parameters: {
      id: 'Workflow ID (URL parameter)',
      body: 'JSON payload to pass to the workflow (request body)',
    },
  },
  '/workflow/:id': {
    method: 'GET',
    description: 'Get status and information about a specific workflow',
    parameters: {
      id: 'Workflow ID (URL parameter)',
    },
  },
};

// Root endpoint - list all available endpoints
app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const endpointsWithUrls = Object.entries(endpoints).reduce((acc, [path, info]) => {
    acc[path] = {
      ...info,
      url: `${baseUrl}${path}`,
    };
    return acc;
  }, {});

  res.json({
    title: 'n8n Workflow API',
    description: 'API for interacting with n8n workflows',
    version: '1.0.0',
    n8n_url: N8N_URL,
    endpoints: endpointsWithUrls,
  });
});

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
  console.log('Visit the root endpoint (/) to see all available endpoints');
});
