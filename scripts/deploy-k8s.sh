#!/bin/bash

# Squants Papers - Kubernetes Deploy Script
# Deploys all services to Kubernetes cluster

set -e

echo "Deploying Squants Papers to Kubernetes..."

# Apply secrets first
echo "Creating secrets..."
kubectl apply -f k8s/secrets.yaml

# Deploy infrastructure
echo "Deploying infrastructure (PostgreSQL, Redis)..."
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml

# Wait for infrastructure to be ready
echo "Waiting for infrastructure to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis --timeout=60s

# Deploy services
echo "Deploying microservices..."
kubectl apply -f k8s/papers-service.yaml
kubectl apply -f k8s/arxiv-service.yaml
kubectl apply -f k8s/comments-service.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/frontend.yaml

# Apply network policies
echo "Applying network policies..."
kubectl apply -f k8s/network-policies.yaml

echo "Waiting for services to be ready..."
kubectl wait --for=condition=ready pod -l app=papers-service --timeout=120s
kubectl wait --for=condition=ready pod -l app=arxiv-service --timeout=60s
kubectl wait --for=condition=ready pod -l app=comments-service --timeout=120s
kubectl wait --for=condition=ready pod -l app=api-gateway --timeout=60s
kubectl wait --for=condition=ready pod -l app=frontend --timeout=120s

echo ""
echo "Deployment complete!"
echo ""
echo "Services:"
kubectl get services
echo ""
echo "Pods:"
kubectl get pods
