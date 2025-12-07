#!/bin/bash

# Squants Papers - Build Script
# Builds all Docker images for the microservices

set -e

echo "Building Squants Papers Microservices..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Version tag (default to latest if not provided)
VERSION=${1:-latest}
REGISTRY=${2:-squants}

echo -e "${BLUE}Building images with tag: ${VERSION}${NC}"

# Build API Gateway
echo -e "${GREEN}Building API Gateway...${NC}"
docker build -t ${REGISTRY}/api-gateway:${VERSION} ./services/api-gateway

# Build Papers Service
echo -e "${GREEN}Building Papers Service...${NC}"
docker build -t ${REGISTRY}/papers-service:${VERSION} ./services/papers-service

# Build ArXiv Service
echo -e "${GREEN}Building ArXiv Service...${NC}"
docker build -t ${REGISTRY}/arxiv-service:${VERSION} ./services/arxiv-service

# Build Comments Service
echo -e "${GREEN}Building Comments Service...${NC}"
docker build -t ${REGISTRY}/comments-service:${VERSION} ./services/comments-service

# Build Frontend
echo -e "${GREEN}Building Frontend...${NC}"
docker build -t ${REGISTRY}/frontend:${VERSION} -f Dockerfile.frontend .

echo -e "${GREEN}All images built successfully!${NC}"
echo ""
echo "Images:"
echo "  ${REGISTRY}/api-gateway:${VERSION}"
echo "  ${REGISTRY}/papers-service:${VERSION}"
echo "  ${REGISTRY}/arxiv-service:${VERSION}"
echo "  ${REGISTRY}/comments-service:${VERSION}"
echo "  ${REGISTRY}/frontend:${VERSION}"
echo ""
echo "To push images to registry:"
echo "  ./scripts/push-images.sh ${VERSION} ${REGISTRY}"
