# Squants Papers - Microservices Architecture

## Overview

Squants Papers has been transformed into a **secure, scalable, and extensible microservices architecture** with containerization support. The system is designed for high availability, easy scaling, and production-grade security.

## Architecture

### Services

1. **API Gateway** (Port 3000)
   - Single entry point for all client requests
   - JWT authentication and authorization
   - Rate limiting and request throttling
   - Request logging and monitoring
   - Proxies to backend microservices

2. **Papers Service** (Port 4001)
   - Manages papers and explanations
   - PostgreSQL database
   - Redis caching for performance
   - RESTful API

3. **ArXiv Service** (Port 4002)
   - External ArXiv API integration
   - Caching layer for API responses
   - Independent scaling based on demand

4. **Comments Service** (Port 4003)
   - Handles all comment operations
   - Separate PostgreSQL database
   - Isolated data management

5. **Frontend** (Port 3001)
   - Next.js application
   - Server-side rendering
   - API proxy through Gateway

### Infrastructure

- **PostgreSQL**: Production-grade relational database
- **Redis**: Distributed caching layer
- **Docker**: Containerization for all services
- **Kubernetes**: Container orchestration with auto-scaling

## Security Features

### Authentication & Authorization
- JWT-based authentication via API Gateway
- Token-based access control
- Secure secret management

### Network Security
- Kubernetes Network Policies
- Service-to-service communication restrictions
- CORS configuration
- Helmet.js security headers

### Rate Limiting
- Configurable request limits per IP
- 100 requests per 15 minutes (default)
- DDoS protection

### Container Security
- Multi-stage Docker builds
- Non-root user execution
- Minimal Alpine images
- No unnecessary dependencies in production

### Data Security
- Input validation with Joi
- SQL injection prevention via Prisma ORM
- Environment-based secrets
- Encrypted connections

## Scalability Features

### Horizontal Scaling
- Auto-scaling based on CPU/Memory usage
- Kubernetes HPA (Horizontal Pod Autoscaler)
- Load balancing across replicas

### Caching Strategy
- Redis for distributed caching
- ArXiv API response caching (2 hours)
- Papers service caching (1 hour)

### Database Optimization
- Indexed queries
- Connection pooling
- Separate databases per service

## High Availability

- **Multi-replica deployments**: 2-3 replicas per service
- **Health checks**: Liveness and readiness probes
- **Graceful shutdown**: SIGTERM/SIGINT handling
- **Auto-restart policies**: Kubernetes restart strategies
- **Database persistence**: Persistent volumes

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL 16+ (optional for local dev)
- Kubernetes cluster (for production)

### Local Development with Docker Compose

1. **Clone and setup**
   ```bash
   cd d:\squants
   cp .env.docker .env
   ```

2. **Update environment variables**
   Edit `.env` file with your configuration

3. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3001
   - API Gateway: http://localhost:3000
   - Health checks available at `/health` on each service

### Production Deployment with Kubernetes

1. **Build and push Docker images**
   ```bash
   docker build -t squants/api-gateway:latest ./services/api-gateway
   docker build -t squants/papers-service:latest ./services/papers-service
   docker build -t squants/arxiv-service:latest ./services/arxiv-service
   docker build -t squants/comments-service:latest ./services/comments-service
   docker build -t squants/frontend:latest -f Dockerfile.frontend .
   
   # Push to registry
   docker push squants/api-gateway:latest
   docker push squants/papers-service:latest
   docker push squants/arxiv-service:latest
   docker push squants/comments-service:latest
   docker push squants/frontend:latest
   ```

2. **Create Kubernetes secrets**
   ```bash
   kubectl create secret generic squants-secrets \
     --from-literal=jwt-secret=your-production-jwt-secret \
     --from-literal=postgres-password=your-production-password \
     --from-literal=papers-db-url=postgresql://user:pass@postgres:5432/papers_db \
     --from-literal=comments-db-url=postgresql://user:pass@postgres:5432/comments_db
   ```

3. **Deploy to Kubernetes**
   ```bash
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

4. **Verify deployment**
   ```bash
   kubectl get pods
   kubectl get services
   ```

## API Endpoints

### Papers Service (via API Gateway)

- `POST /api/papers` - Create a new paper
- `GET /api/papers` - List papers (paginated)
- `GET /api/papers/:id` - Get paper by ID
- `PUT /api/papers/:id` - Update paper
- `DELETE /api/papers/:id` - Delete paper

### ArXiv Service (via API Gateway)

- `POST /api/arxiv/lookup` - Lookup ArXiv paper metadata

### Comments Service (via API Gateway)

- `POST /api/comments` - Create comment
- `GET /api/comments/paper/:paperId` - Get comments for paper
- `DELETE /api/comments/:id` - Delete comment

## Monitoring & Logging

### Health Checks
Each service exposes a `/health` endpoint:
- Status: healthy/unhealthy
- Timestamp
- Service name
- Uptime

### Logging
- Structured JSON logging with Winston
- Log levels: error, warn, info, debug
- Centralized logging ready (configure external log aggregation)

### Metrics
- Kubernetes resource metrics
- Auto-scaling triggers
- Request/response metrics via API Gateway

## Configuration

### Environment Variables

#### API Gateway
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: Token expiration (default: 24h)
- `REDIS_HOST`: Redis hostname
- `CORS_ORIGIN`: Allowed origins
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

#### Services
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`: Redis hostname
- `CACHE_TTL`: Cache time-to-live in seconds

## Development

### Service-specific Development

Each service can be developed independently:

```bash
cd services/api-gateway
npm install
npm run dev
```

### Database Migrations

```bash
cd services/papers-service
npx prisma migrate dev --name init
npx prisma generate
```

## Troubleshooting

### Common Issues

1. **Service connection errors**
   - Check service health: `kubectl get pods`
   - View logs: `kubectl logs <pod-name>`

2. **Database connection failures**
   - Verify DATABASE_URL is correct
   - Check PostgreSQL pod status
   - Review init-db.sql execution

3. **Authentication errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Review CORS configuration

## Performance Tuning

### Scaling Recommendations

- **API Gateway**: 3-10 replicas (high traffic entry point)
- **Papers Service**: 2-8 replicas (database-heavy operations)
- **ArXiv Service**: 2-6 replicas (external API calls)
- **Comments Service**: 2-6 replicas (moderate load)

### Caching Strategy

- Increase `CACHE_TTL` for stable data
- Use Redis clustering for high availability
- Implement cache warming for frequently accessed data

## Security Best Practices

1. **Change default secrets** in production
2. **Use managed secrets** (HashiCorp Vault, AWS Secrets Manager)
3. **Enable TLS/SSL** for all communications
4. **Implement request signing** for service-to-service auth
5. **Regular security audits** and dependency updates
6. **Network isolation** with Kubernetes Network Policies
7. **Monitor and alert** on suspicious activity

## Extensibility

### Adding New Services

1. Create service directory in `services/`
2. Implement with Express.js and TypeScript
3. Add Dockerfile and health check
4. Create Kubernetes manifests in `k8s/`
5. Update API Gateway routes
6. Add to docker-compose.yml

### Integration Points

- **Message Queue**: Add RabbitMQ/Kafka for async processing
- **Search**: Integrate Elasticsearch for full-text search
- **Monitoring**: Add Prometheus + Grafana
- **Tracing**: Implement OpenTelemetry/Jaeger

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
