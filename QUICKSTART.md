# Squants Papers - Quick Start Guide

## Quick Start with Docker Compose

### 1. Prerequisites
- Docker Desktop installed and running
- Git (to clone the repository)

### 2. Setup

```bash
# Navigate to project directory
cd d:\squants

# Copy environment file
copy .env.docker .env

# Start all services
docker-compose up --build
```

### 3. Access Services

- **Frontend**: http://localhost:3001
- **API Gateway**: http://localhost:3000
- **Health Checks**: 
  - http://localhost:3000/health (API Gateway)
  - http://localhost:3001 (Frontend)

### 4. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (cleans database)
docker-compose down -v
```

## Development Setup

### Prerequisites
- Node.js 20+
- Docker Desktop
- VS Code (recommended)

### Setup Individual Service

```bash
# Navigate to service directory
cd services/api-gateway

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Run in development mode
npm run dev
```

### Database Setup (Papers & Comments Services)

```bash
cd services/papers-service

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Run the service
npm run dev
```

## Testing the API

### 1. Lookup ArXiv Paper

```bash
curl -X POST http://localhost:3000/api/arxiv/lookup \
  -H "Content-Type: application/json" \
  -d '{"input": "2301.07041"}'
```

### 2. Create Paper

```bash
curl -X POST http://localhost:3000/api/papers \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Paper",
    "abstract": "This is a sample abstract",
    "url": "https://arxiv.org/abs/2301.07041",
    "arxivId": "2301.07041",
    "explanation": {
      "summary": "High-level overview",
      "intuition": "Conceptual explanation",
      "authorName": "John Doe"
    }
  }'
```

### 3. Get Papers

```bash
curl http://localhost:3000/api/papers
```

### 4. Add Comment

```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "paperId": 1,
    "content": "Great paper!",
    "authorName": "Jane Smith"
  }'
```

## Production Deployment

### Deploy to Kubernetes

```powershell
# Build images
.\scripts\build-images.ps1 v1.0.0

# Push to registry (if using remote registry)
.\scripts\push-images.ps1 v1.0.0 your-registry

# Deploy to Kubernetes
.\scripts\deploy-k8s.ps1
```

### Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# View logs
kubectl logs -l app=api-gateway

# Port forward for local access
kubectl port-forward service/frontend 3001:3001
kubectl port-forward service/api-gateway 3000:3000
```

## Monitoring

### Health Checks

All services expose `/health` endpoint:

```bash
curl http://localhost:3000/health  # API Gateway
curl http://localhost:4001/health  # Papers Service (internal)
curl http://localhost:4002/health  # ArXiv Service (internal)
curl http://localhost:4003/health  # Comments Service (internal)
```

### View Logs

```bash
# Docker Compose
docker-compose logs -f api-gateway
docker-compose logs -f papers-service

# Kubernetes
kubectl logs -f deployment/api-gateway
kubectl logs -f deployment/papers-service
```

## Troubleshooting

### Docker Issues

**Services not starting:**
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs

# Rebuild images
docker-compose up --build --force-recreate
```

**Database connection errors:**
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check PostgreSQL logs
docker-compose logs postgres
```

### Kubernetes Issues

**Pods not ready:**
```bash
# Describe pod
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

**Service not accessible:**
```bash
# Check service endpoints
kubectl get endpoints

# Port forward to test locally
kubectl port-forward service/api-gateway 3000:3000
```

## Common Tasks

### Reset Database

```bash
# Docker Compose
docker-compose down -v
docker-compose up -d postgres
docker-compose exec papers-service npx prisma migrate deploy
docker-compose exec comments-service npx prisma migrate deploy
```

### Update Dependencies

```bash
cd services/api-gateway
npm update
npm audit fix
```

### Scale Services (Kubernetes)

```bash
# Scale manually
kubectl scale deployment api-gateway --replicas=5

# View HPA status
kubectl get hpa
```

## Next Steps

1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design
2. Configure production secrets in `.env`
3. Set up monitoring (Prometheus/Grafana)
4. Configure CI/CD pipeline
5. Set up SSL/TLS certificates
6. Configure backup strategy for databases

## Support

For issues and questions:
- Check logs: `docker-compose logs` or `kubectl logs`
- Review documentation: ARCHITECTURE.md
- Open issue in repository
