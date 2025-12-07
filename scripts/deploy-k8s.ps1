# PowerShell version of Kubernetes deploy script
# Squants Papers - Kubernetes Deploy Script

Write-Host "Deploying Squants Papers to Kubernetes..." -ForegroundColor Blue

# Apply secrets first
Write-Host "Creating secrets..." -ForegroundColor Cyan
kubectl apply -f k8s/secrets.yaml

# Deploy infrastructure
Write-Host "Deploying infrastructure (PostgreSQL, Redis)..." -ForegroundColor Cyan
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml

# Wait for infrastructure to be ready
Write-Host "Waiting for infrastructure to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis --timeout=60s

# Deploy services
Write-Host "Deploying microservices..." -ForegroundColor Cyan
kubectl apply -f k8s/papers-service.yaml
kubectl apply -f k8s/arxiv-service.yaml
kubectl apply -f k8s/comments-service.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/frontend.yaml

# Apply network policies
Write-Host "Applying network policies..." -ForegroundColor Cyan
kubectl apply -f k8s/network-policies.yaml

Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=papers-service --timeout=120s
kubectl wait --for=condition=ready pod -l app=arxiv-service --timeout=60s
kubectl wait --for=condition=ready pod -l app=comments-service --timeout=120s
kubectl wait --for=condition=ready pod -l app=api-gateway --timeout=60s
kubectl wait --for=condition=ready pod -l app=frontend --timeout=120s

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "`nServices:"
kubectl get services
Write-Host "`nPods:"
kubectl get pods
