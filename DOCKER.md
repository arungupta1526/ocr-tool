# 🐳 Docker Guide

This guide covers how to build and run the **Smart OCR Tool** inside a Docker container for local development or self-hosting.

---

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running

---

## 🏗️ Step 1 — Create a Dockerfile

Create a file named `Dockerfile` in the root of the project:

```dockerfile
# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────────
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

> **Why two stages?**
> The first stage installs dependencies and builds the app. The second stage only contains the final static files served by Nginx — keeping the image small (~25 MB).

---

## 🔧 Step 2 — Build the Image

```bash
docker build -t ocr-tool .
```

| Flag          | Meaning                                     |
| ------------- | ------------------------------------------- |
| `-t ocr-tool` | Tags the image with the name `ocr-tool`     |
| `.`           | Uses the current directory as build context |

---

## ▶️ Step 3 — Run the Container

```bash
docker run -p 8080:80 ocr-tool
```

Then open your browser at **[http://localhost:8080](http://localhost:8080)**.

| Flag         | Meaning                                                    |
| ------------ | ---------------------------------------------------------- |
| `-p 8080:80` | Maps port 8080 on your machine to port 80 in the container |

---

## 🔄 Useful Commands

```bash
# Run in the background (detached)
docker run -d -p 8080:80 --name ocr-tool ocr-tool

# Stop the container
docker stop ocr-tool

# Remove the container
docker rm ocr-tool

# Remove the image
docker rmi ocr-tool

# View running containers
docker ps

# View logs
docker logs ocr-tool
```

---

## 🐙 Using Docker Compose (Optional)

Create a `docker-compose.yml` in the project root:

```yaml
version: "3.9"

services:
  ocr-tool:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Then run:

```bash
# Build and start
docker compose up --build

# Start in background
docker compose up -d --build

# Stop
docker compose down
```

---

## ⚡ Quick Reference

| Command                          | Description                |
| -------------------------------- | -------------------------- |
| `docker build -t ocr-tool .`     | Build the image            |
| `docker run -p 8080:80 ocr-tool` | Run on port 8080           |
| `docker compose up --build`      | Build and run with Compose |
| `docker ps`                      | List running containers    |
| `docker stop ocr-tool`           | Stop the container         |

---

> **Note**: Since all OCR processing happens in the browser (WebAssembly), the Docker container only needs to serve the static files — no server-side computation required.
