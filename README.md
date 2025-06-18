# n8n Docker Environment with Express.js Integration

This project provides a Docker-based development environment that runs both n8n (a workflow automation tool) and an Express.js server. The Express server acts as a middleware to interact with n8n workflows through a REST API.

## Architecture

The environment consists of two main services:

- **n8n**: Workflow automation service running on port 5679
- **Express.js Server**: Node.js application running on port 3000 that provides a REST API to interact with n8n

## Prerequisites

- Docker
- Docker Compose
- Git

## Getting Started

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd meetballs-n8n-docker-env
   ```

2. Create a .env file in the src directory:

   ```bash
   cp src/.env.example src/.env
   ```

3. Start the containers:

   ```bash
   docker compose up --build
   ```

## Available Endpoints

The Express.js server provides the following endpoints:

### Health Check

```http
GET /health
```

Returns the status of the Express server.

### Trigger Workflow

```http
POST /workflow/:id/trigger
```

Triggers a specific n8n workflow by ID. The request body will be passed to the workflow.

### Get Workflow Status

```http
GET /workflow/:id
```

Retrieves the status and information about a specific workflow.

## Environment Variables

- `N8N_URL`: The internal URL of the n8n service (default: `http://n8n:5678`)

## Directory Structure

```text
.
├── docker-compose.yml    # Docker compose configuration
├── src/                 # Express.js application source
│   ├── index.js        # Main application file
│   ├── package.json    # Node.js dependencies
│   └── .env           # Environment variables
└── README.md           # This file
```

## Development

To make changes to the Express.js application:

1. Modify files in the `src` directory
2. The changes will be automatically reflected in the container (hot-reload enabled)
3. If you add new dependencies, rebuild the containers:

   ```bash
   docker compose down
   docker compose up --build
   ```

## Accessing Services

- n8n: `http://localhost:5679`
- Express.js API: `http://localhost:3000`

## Troubleshooting

### Port Conflicts

If you encounter port conflicts, you can modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "NEW_PORT:5678"  # For n8n
  - "NEW_PORT:3000"  # For Express
```

### Container Logs

To view logs:

```bash
# All containers
docker compose logs -f

# Specific service
docker compose logs -f n8n
docker compose logs -f node
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.