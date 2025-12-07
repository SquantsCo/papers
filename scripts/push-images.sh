#!/bin/bash

# Squants Papers - Push Script
# Pushes all Docker images to registry

set -e

VERSION=${1:-latest}
REGISTRY=${2:-squants}

echo "Pushing images to registry..."

docker push ${REGISTRY}/api-gateway:${VERSION}
docker push ${REGISTRY}/papers-service:${VERSION}
docker push ${REGISTRY}/arxiv-service:${VERSION}
docker push ${REGISTRY}/comments-service:${VERSION}
docker push ${REGISTRY}/frontend:${VERSION}

echo "All images pushed successfully!"
