# 🐳 Docker Setup Guide — Smart OCR Tool

This guide explains how to build and run the **Smart OCR Tool** using Docker for local development or self-hosting.

---

# 📦 What Is Docker?

[Docker](https://www.docker.com/) is a containerization platform that allows you to package your application and all its dependencies into a portable container.

This ensures:
- ✅ Consistent environment
- ✅ No dependency conflicts
- ✅ Easy deployment
- ✅ Works the same on all machines

A container is like:

> 📦 A small isolated box that contains your app + everything it needs to run.

So instead of installing Node, Nginx, etc. on your computer manually — Docker handles everything.

---

# 📋 Prerequisites

Before starting, make sure:

- Docker Desktop is installed [[Download](https://docs.docker.com/get-docker/)]
- Docker is running

### Verify Installation

Open a terminal and run:

```bash
docker --version
```

If Docker is installed correctly, you should see a version number like: `Docker version 25.x.x`

---

# 🏗️ Step 1 — Create a Dockerfile

In the root of your project (where `package.json`, `src/` etc. is located), create a file named:

```
Dockerfile
```

⚠️ No file extension like: `Dockerfile.txt`

Paste the following content inside:

```dockerfile
# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the production version
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────────
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html/ocr-tool

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🧠 Why Use Two Stages?

This is called a **multi-stage build**.

### Stage 1 (Builder)
- Uses Node.js
- Installs dependencies
- Builds optimized production files in `/dist`

### Stage 2 (Production)
- Uses lightweight Nginx
- Copies only final static files
- Results in a smaller image (~25MB)

This keeps the final container:
- Smaller
- Faster
- More secure

---

# 🔨 Step 2 — Build the Docker Image

Inside your project root directory, run:

```bash
docker build -t ocr-tool .
```

### What This Does

- Reads the Dockerfile
- Builds the application
- Creates a Docker image named `ocr-tool`

The `.` means:

> “Use this current folder as input.”

Lots of text like:

```
Step 1/8 ...
Step 2/8 ...
...
Successfully tagged ocr-tool
```

If successful, you will see:

```
Successfully tagged ocr-tool
```

---

# ▶️ Step 3 — Run the Container

Start the application using:

```bash
docker run -p 8080:80 ocr-tool
```

### What This Does

- Runs a container from the `ocr-tool` image
- Maps port 8080 (your machine)
- To port 80 (inside the container)

so:
```
Your Browser → localhost:8080 → Docker → Nginx → App
```

---

# 🌐 Step 4 — Open in Browser

Open your browser and visit:

```
http://localhost:8080
```

Your Smart OCR Tool should now be running.

---

# 🛑 Stop the Container

Press:

```
CTRL + C
```

Or if running in background:

```bash
docker stop ocr-tool
```

---

# 🔄 Useful Docker Commands

## Run in Background

```bash
docker run -d -p 8080:80 --name ocr-tool ocr-tool
```

## View Running Containers

```bash
docker ps
```

## View All Containers

```bash
docker ps -a
```

## View Logs

```bash
docker logs ocr-tool
```

## Stop Container

```bash
docker stop ocr-tool
```

## Remove Container

```bash
docker rm ocr-tool
```

## Remove Image

```bash
docker rmi ocr-tool
```

---

# 🐙 Optional — Using Docker Compose

Instead of running multiple commands manually, you can use Docker Compose.

Create a file named:

```
docker-compose.yml
```

Add the following:

```yaml
version: "3.9"

services:
  ocr-tool:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

---

## Start with Compose

```bash
docker compose up --build
```

Run in background:

```bash
docker compose up -d --build
```

Stop:

```bash
docker compose down
```

---

# 🧩 How It Works

Architecture flow:

```
Browser
   ↓
localhost:8080
   ↓
Docker Container
   ↓
Nginx
   ↓
Static Files (HTML, CSS, JS)
   ↓
OCR runs in browser (WebAssembly)
```

Since OCR processing happens entirely in the browser, the Docker container only serves static files — no backend server is required.

---

# ⚡ Quick Reference

| Command                          | Description              |
| -------------------------------- | ------------------------ |
| `docker build -t ocr-tool .`     | Build image              |
| `docker run -p 8080:80 ocr-tool` | Run container            |
| `docker compose up --build`      | Build & run with Compose |
| `docker ps`                      | Show running containers  |
| `docker stop ocr-tool`           | Stop container           |

---

# 🧩 If Something Fails

Common beginner issues:

### ❌ Docker not running

Start Docker Desktop.

### ❌ Port already in use

Change to:
```
docker run -p 3000:80 ocr-tool
```
Then open:
```
http://localhost:3000
```

# 🚀 Final Result

Your Smart OCR Tool is now:

- Containerized
- Portable
- Easy to deploy
- Ready for self-hosting

Anyone can run it using Docker without installing Node.js or other dependencies.

> **Note**: Since all OCR processing happens in the browser (WebAssembly), the Docker container only needs to serve the static files — no server-side computation required.