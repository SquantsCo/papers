# Setup Instructions for Squants Papers Microservices

## Prerequisites Check

Before starting, ensure you have:
- [ ] Docker Desktop installed and running
- [ ] Node.js 20+ installed (for local development)
- [ ] PowerShell or Bash terminal
- [ ] Git (optional, for version control)
- [ ] kubectl (if deploying to Kubernetes)

## Quick Setup (Docker Compose)

This is the fastest way to get started locally:

### Step 1: Prepare Environment

```powershell
# Navigate to project directory
cd d:\squants

# Copy environment configuration
copy .env.docker .env

# Review and update .env if needed
notepad .env
```

### Step 2: Start All Services

```powershell
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### Step 3: Verify Services

Open these URLs in your browser:
- Frontend: http://localhost:3001
- API Gateway: http://localhost:3000/health
- API Gateway Health: http://localhost:3000/health

Wait for all services to be healthy (may take 1-2 minutes on first start).

### Step 4: Test the API

```powershell
# Test ArXiv lookup
curl -X POST http://localhost:3000/api/arxiv/lookup `
  -H "Content-Type: application/json" `
  -d '{"input": "2301.07041"}'

# Create a paper
curl -X POST http://localhost:3000/api/papers `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Test Paper",
    "abstract": "Test abstract",
    "url": "https://arxiv.org/abs/2301.07041",
    "explanation": {
      "summary": "High-level overview",
      "intuition": "Easy explanation"
    }
  }'
```

## Production Setup (Kubernetes)

For production deployment with auto-scaling and high availability:

### Step 1: Build Docker Images

```powershell
# Build all images
.\scripts\build-images.ps1

# Or with version tag
.\scripts\build-images.ps1 v1.0.0
```

### Step 2: Push to Registry (if using remote cluster)

```powershell
# Login to your Docker registry
docker login

# Push images
.\scripts\push-images.ps1 v1.0.0 your-dockerhub-username
```

### Step 3: Configure Secrets

```powershell
# Edit secrets file with production values
notepad k8s\secrets.yaml

# Or create secrets directly
kubectl create secret generic squants-secrets `
  --from-literal=jwt-secret="your-production-jwt-secret-here" `
  --from-literal=postgres-password="your-production-password" `
  --from-literal=papers-db-url="postgresql://postgres:yourpass@postgres:5432/papers_db" `
  --from-literal=comments-db-url="postgresql://postgres:yourpass@postgres:5432/comments_db"
```

### Step 4: Deploy to Kubernetes

```powershell
# Deploy all services
.\scripts\deploy-k8s.ps1

# Or deploy manually
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/papers-service.yaml
kubectl apply -f k8s/arxiv-service.yaml
kubectl apply -f k8s/comments-service.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/network-policies.yaml
```

### Step 5: Verify Deployment

```powershell
# Check all pods are running
kubectl get pods

# Check services
kubectl get services

# View logs
kubectl logs -l app=api-gateway --tail=50

# Port forward to access locally
kubectl port-forward service/frontend 3001:3001
kubectl port-forward service/api-gateway 3000:3000
```

## Development Setup

For local development of individual services:

### Step 1: Install Dependencies

```powershell
# API Gateway
cd services\api-gateway
npm install

# Papers Service
cd ..\papers-service
npm install
npx prisma generate

# ArXiv Service
cd ..\arxiv-service
npm install

# Comments Service
cd ..\comments-service
npm install
npx prisma generate
```

### Step 2: Setup Databases (if running locally)

```powershell
# Start PostgreSQL and Redis only
docker-compose up postgres redis -d

# Run migrations for Papers Service
cd services\papers-service
npx prisma migrate dev

# Run migrations for Comments Service
cd ..\comments-service
npx prisma migrate dev
```

### Step 3: Run Services

```powershell
# In separate terminals:

# Terminal 1 - API Gateway
cd services\api-gateway
npm run dev

# Terminal 2 - Papers Service
cd services\papers-service
npm run dev

# Terminal 3 - ArXiv Service
cd services\arxiv-service
npm run dev

# Terminal 4 - Comments Service
cd services\comments-service
npm run dev

# Terminal 5 - Frontend
cd ..\..
npm run dev
```

## Troubleshooting

### Services Not Starting

```powershell
# Check Docker is running
docker ps

# View logs
docker-compose logs

# Restart specific service
docker-compose restart api-gateway

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Database Connection Issues

```powershell
# Check PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Connect to database directly
docker-compose exec postgres psql -U postgres
```

### Port Already in Use

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml or .env
```

### Kubernetes Pods Not Starting

```powershell
# Describe pod to see issues
kubectl describe pod <pod-name>

# View pod logs
kubectl logs <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Delete and recreate pod
kubectl delete pod <pod-name>
```

## Common Commands

### Docker Compose

```powershell
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild single service
docker-compose up --build api-gateway

# Remove all data
docker-compose down -v
```

### Kubernetes

```powershell
# Get all resources
kubectl get all

# Scale deployment
kubectl scale deployment api-gateway --replicas=5

# Update image
kubectl set image deployment/api-gateway api-gateway=squants/api-gateway:v2

# Rollback deployment
kubectl rollout undo deployment/api-gateway

# View HPA status
kubectl get hpa
```

## Health Checks

All services expose health endpoints:

- API Gateway: http://localhost:3000/health
- Papers Service: Internal (through gateway)
- ArXiv Service: Internal (through gateway)
- Comments Service: Internal (through gateway)
- Frontend: http://localhost:3001/

## Security Notes

### Before Production:

1. **Change all default secrets** in .env and k8s/secrets.yaml
2. **Use strong passwords** for PostgreSQL
3. **Generate secure JWT secret** (use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
4. **Enable TLS/SSL** for all external communications
5. **Configure firewall rules** properly
6. **Use managed secrets** (Azure Key Vault, AWS Secrets Manager, etc.)
7. **Enable audit logging** in production
8. **Regular security updates** for all dependencies

## Performance Tuning

### For High Traffic:

1. **Increase replicas** in k8s deployments
2. **Adjust cache TTL** based on data freshness needs
3. **Add CDN** for frontend assets
4. **Enable database query caching**
5. **Use connection pooling** (already configured)
6. **Monitor and optimize** slow queries

## Support

- **Documentation**: See ARCHITECTURE.md, QUICKSTART.md
- **Issues**: Check logs first, then open GitHub issue
- **Security**: Report security issues privately

---

## Success Checklist

After setup, verify:

- [ ] All Docker containers running: `docker-compose ps`
- [ ] Frontend accessible at http://localhost:3001
- [ ] API Gateway healthy at http://localhost:3000/health
- [ ] Can lookup ArXiv paper
- [ ] Can create paper
- [ ] Can add comment
- [ ] All pods running (K8s): `kubectl get pods`
- [ ] Services accessible (K8s): `kubectl get services`
- [ ] Logs showing no errors

You're ready to go! 🚀
