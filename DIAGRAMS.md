# Squants Papers - Architecture Diagram

## High-Level Architecture

```
                                    ┌─────────────────┐
                                    │   End Users     │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │   Internet/LB   │
                                    └────────┬────────┘
                                             │
                        ┌────────────────────┴────────────────────┐
                        │                                          │
                ┌───────▼───────┐                        ┌────────▼────────┐
                │   Frontend    │◄───────────────────────│   API Gateway   │
                │   (Next.js)   │                        │   (Express.js)  │
                │   Port 3001   │                        │    Port 3000    │
                └───────────────┘                        └────────┬────────┘
                                                                  │
                                          ┌───────────────────────┼──────────────────────┐
                                          │                       │                      │
                                  ┌───────▼───────┐      ┌───────▼───────┐     ┌───────▼───────┐
                                  │    Papers     │      │     ArXiv     │     │   Comments    │
                                  │   Service     │      │    Service    │     │   Service     │
                                  │   Port 4001   │      │   Port 4002   │     │   Port 4003   │
                                  └───────┬───────┘      └───────┬───────┘     └───────┬───────┘
                                          │                      │                      │
                        ┌─────────────────┴──────────┐          │          ┌───────────┴──────┐
                        │                            │          │          │                  │
                ┌───────▼──────┐            ┌────────▼──────────▼──────────▼────┐    ┌───────▼──────┐
                │  PostgreSQL  │            │            Redis Cache             │    │  PostgreSQL  │
                │  papers_db   │            │      (ArXiv & Session Data)        │    │ comments_db  │
                └──────────────┘            └───────────────────────────────────┘    └──────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Layer 7: Application                         │
│  - Input Validation (Joi)                                           │
│  - Business Logic Security                                          │
│  - Data Access Control (Prisma)                                     │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                         Layer 6: Service Mesh                        │
│  - Service-to-Service Authentication                                │
│  - Mutual TLS (Future)                                              │
│  - Circuit Breakers                                                 │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                         Layer 5: API Gateway                         │
│  - JWT Authentication                                               │
│  - Rate Limiting (100 req/15min)                                    │
│  - Request/Response Logging                                         │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                         Layer 4: Network                             │
│  - Kubernetes Network Policies                                      │
│  - Service Isolation                                                │
│  - Firewall Rules                                                   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                         Layer 3: Container                           │
│  - Non-root Users                                                   │
│  - Minimal Images (Alpine)                                          │
│  - Security Scanning                                                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                         Layer 2: Infrastructure                      │
│  - Encrypted Volumes                                                │
│  - Secret Management                                                │
│  - Resource Limits                                                  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                         Layer 1: Platform                            │
│  - Cloud Provider Security                                          │
│  - Network Isolation (VPC)                                          │
│  - DDoS Protection                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow - Create Paper

```
1. User submits paper
        │
        ▼
2. Frontend (Next.js)
   - Collects form data
   - Sends to API Gateway
        │
        ▼
3. API Gateway (Port 3000)
   - Validates JWT token
   - Checks rate limit
   - Logs request
        │
        ▼
4. Papers Service (Port 4001)
   - Validates input (Joi)
   - Checks cache (Redis)
   - Saves to database
        │
        ▼
5. PostgreSQL (papers_db)
   - Stores paper data
   - Returns paper ID
        │
        ▼
6. Papers Service
   - Caches result (Redis)
   - Returns response
        │
        ▼
7. API Gateway
   - Logs response
   - Returns to frontend
        │
        ▼
8. Frontend
   - Displays success
   - Redirects to paper page
```

## Scaling Strategy

```
Traffic Level          │  Configuration
─────────────────────────────────────────────────────────
Low (< 100 req/min)   │  API Gateway: 3 replicas
                      │  Papers: 2 replicas
                      │  ArXiv: 2 replicas
                      │  Comments: 2 replicas
─────────────────────────────────────────────────────────
Medium (100-500)      │  API Gateway: 5 replicas
                      │  Papers: 4 replicas
                      │  ArXiv: 3 replicas
                      │  Comments: 3 replicas
─────────────────────────────────────────────────────────
High (500-2000)       │  API Gateway: 8 replicas
                      │  Papers: 6 replicas
                      │  ArXiv: 5 replicas
                      │  Comments: 4 replicas
─────────────────────────────────────────────────────────
Very High (2000+)     │  API Gateway: 10 replicas
                      │  Papers: 8 replicas
                      │  ArXiv: 6 replicas
                      │  Comments: 6 replicas
                      │  + Redis Cluster
                      │  + PostgreSQL Read Replicas
```

## Deployment Pipeline

```
┌──────────────┐
│  Developer   │
│  Commits     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Git Push   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│   CI/CD (GitHub Actions) │
│   - Run tests            │
│   - Build images         │
│   - Security scan        │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────┐
│  Docker Registry │
│  (Push images)   │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│   Kubernetes         │
│   - Pull images      │
│   - Rolling update   │
│   - Health checks    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│   Production     │
│   Environment    │
└──────────────────┘
```

## Monitoring & Observability

```
                    ┌─────────────────────┐
                    │   Monitoring Stack   │
                    │   (Prometheus +      │
                    │    Grafana)          │
                    └──────────┬───────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
    ┌───────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │   Metrics    │   │    Logs     │   │   Traces    │
    │  Collection  │   │ Aggregation │   │  (Jaeger)   │
    └───────┬──────┘   └──────┬──────┘   └──────┬──────┘
            │                  │                  │
    ┌───────┴──────────────────┴──────────────────┴──────┐
    │                                                      │
    │              Kubernetes Services                    │
    │                                                      │
    │  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
    │  │   API   │  │ Papers  │  │  ArXiv  │            │
    │  │ Gateway │  │ Service │  │ Service │            │
    │  └─────────┘  └─────────┘  └─────────┘            │
    │                                                      │
    │  Health Checks │ Logs │ Metrics │ Traces           │
    └──────────────────────────────────────────────────────┘
```

## Disaster Recovery

```
┌─────────────────┐
│   Production    │
│   Cluster       │
└────────┬────────┘
         │
         │ Continuous
         │ Backup
         ▼
┌─────────────────┐
│   Backup        │
│   Storage       │
│   - Database    │
│   - Configs     │
│   - Secrets     │
└────────┬────────┘
         │
         │ Restore
         │ (if needed)
         ▼
┌─────────────────┐
│   Recovery      │
│   Environment   │
└─────────────────┘

RTO: 15 minutes
RPO: 5 minutes
```

## Cost Optimization

```
Component          │ Development  │ Production
───────────────────────────────────────────────
API Gateway        │ 1 replica    │ 3-10 (HPA)
Papers Service     │ 1 replica    │ 2-8 (HPA)
ArXiv Service      │ 1 replica    │ 2-6 (HPA)
Comments Service   │ 1 replica    │ 2-6 (HPA)
Frontend           │ 1 replica    │ 2-8 (HPA)
PostgreSQL         │ 1 instance   │ 1 primary + replicas
Redis              │ 1 instance   │ 1 primary (cluster optional)
───────────────────────────────────────────────
Estimated Cost     │ ~$50/month   │ $200-800/month
                   │              │ (depends on traffic)
```
