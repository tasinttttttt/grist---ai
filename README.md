# GRIST ♥️ AI

A chat bot for Grist tables

Hackdays2025.

```console
# stack
node
svelte 5
pocketbase
```

# Table of Contents

1. [Useful Commands](#useful-commands).
2. [Development](#development).
3. [Deployment](#deployment).
4. [Description](#project-description).
5. [Project content](#project-content).

## Useful commands:

```console
# Generate pocketbase types
npx pocketbase-typegen --db ./pb/pb_data/data.db --out ./src/pocketbase-types.ts
```

## Development

```console
# Create or edit .env (see `.env.example` file)
PRIVATE_BACKEND_URL="http://pb:8090"
PRIVATE_API_USER="DB_USER"
PRIVATE_API_PASS="DB_PASSWORD"

PUBLIC_APP_URL="http://HOST:OPTIONAL_PORT"
PUBLIC_API_URL="http://HOST-API:OPTIONAL_PORT"
HOST_APP_PORT=8087
HOST_API_PORT=8088

# DEV
# access front throught localhost:HOST_APP_PORT
# access api throught localhost:HOST_API_PORT
docker-compose --profile dev up --build --force-recreate -d
```
