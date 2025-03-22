# Server Deployment Guide

FastAPI backend server. Requires proper environment configuration before deployment.

## 🚀 Prerequisites

- Python 3.7+
- PostgreSQL (recommended) or SQLite
- Clone repository:
  ```bash
  git clone https://github.com/MaanasArora/polis-ctto.git
  cd polis-ctto/polis.server
  ```

## 📦 Installation

1. Install dependencies:
   ```bash
   # Using pip
   pip install -r requirements.txt
   ```

## 🔧 Configuration (Critical Step)

Create `.env` file in the project root (`polis.server/`):

```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/polisdb
SECRET_KEY=your-secure-random-string-here

# CORS Configuration
CLIENT_ORIGIN=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,https://your-production-domain.com

# JWT Configuration (defaults shown)
ALGORITHM=HS256
EXPIRES_DELTA_SECONDS=3600
```

### Environment Variables Reference

| Variable               | Required | Default              | Description                         |
|------------------------|----------|----------------------|-------------------------------------|
| `DATABASE_URL`         | Yes      | `sqlite:///polis.db` | Database connection string          |
| `SECRET_KEY`           | Yes      | -                    | Secret for JWT token signing        |
| `CLIENT_ORIGIN`        | No       | `http://localhost:5173` | Frontend origin URL                |
| `ALLOWED_ORIGINS`      | No       | [CLIENT_ORIGIN]      | Comma-separated CORS allowed origins|
| `ALGORITHM`            | No       | `HS256`              | JWT encryption algorithm            |
| `EXPIRES_DELTA_SECONDS`| No       | `3600` (1hr)         | JWT token expiration time           |

## 🚨 Security Notes

1. Use strong secrets for `SECRET_KEY` (64+ characters)
2. In production:
   - Use PostgreSQL instead of SQLite
   - Set `ALGORITHM` to `HS256` or stronger
   - Restrict `ALLOWED_ORIGINS` to specific domains

## ▶️ Running the Server

Development mode:
```bash
uvicorn main:app --reload
```

Production mode (recommended):
```bash
# if same server with client node server
uvicorn main:app

# if seperate server with client node server
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🌐 Deployment Notes

1. For cloud deployments:
   - Set environment variables directly in your hosting platform
   - Configure HTTPS reverse proxy (Nginx/Apache)
2. Docker users - add this to your Dockerfile:
   ```Dockerfile
   ENV DATABASE_URL=...
   ENV SECRET_KEY=...
   ```

---

**API Documentation**: After starting the server, access `/docs` endpoint for interactive Swagger UI.

📖 [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
📖 [Pydantic Settings Documentation](https://docs.pydantic.dev/latest/usage/pydantic_settings/)

## 🐳 Docker Deployment [WIP]

### Prerequisites
- Docker installed
- Docker Compose (for full service stack)

### 1. Using Dockerfile Only
Create `.env.docker` file (or use existing `.env`):
```env
DATABASE_URL=postgresql://polis:yourpassword@db:5432/polisdb
SECRET_KEY=your-docker-secret-key-here
```

Build and run:
```bash
# Build image
docker build -t polis-server .

# Run container
docker run -d -p 8000:80 \
  --env-file .env.docker \
  --name polis-server \
  polis-server
```

### 2. Using Docker Compose (Recommended)
The included `docker-compose.yml` handles database and server setup automatically:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env.docker
    depends_on:
      - db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: polisdb
      POSTGRES_USER: polis
      POSTGRES_PASSWORD: yoursecurepassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

Start services:
```bash
docker-compose up -d --build
```

### Common Docker Commands
```bash
# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Security Best Practices
1. **Image Scanning**:
   ```bash
   docker scan polis-server
   ```

2. **Regular Updates**:
   - Rebuild images monthly with updated base images
