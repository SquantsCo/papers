# PowerShell version of build script
# Squants Papers - Build Script

param(
    [string]$Version = "latest",
    [string]$Registry = "squants"
)

Write-Host "Building Squants Papers Microservices..." -ForegroundColor Blue
Write-Host "Building images with tag: $Version" -ForegroundColor Cyan

# Build API Gateway
Write-Host "Building API Gateway..." -ForegroundColor Green
docker build -t "${Registry}/api-gateway:${Version}" ./services/api-gateway

# Build Papers Service
Write-Host "Building Papers Service..." -ForegroundColor Green
docker build -t "${Registry}/papers-service:${Version}" ./services/papers-service

# Build ArXiv Service
Write-Host "Building ArXiv Service..." -ForegroundColor Green
docker build -t "${Registry}/arxiv-service:${Version}" ./services/arxiv-service

# Build Comments Service
Write-Host "Building Comments Service..." -ForegroundColor Green
docker build -t "${Registry}/comments-service:${Version}" ./services/comments-service

# Build Frontend
Write-Host "Building Frontend..." -ForegroundColor Green
docker build -t "${Registry}/frontend:${Version}" -f Dockerfile.frontend .

Write-Host "`nAll images built successfully!" -ForegroundColor Green
Write-Host "`nImages:"
Write-Host "  ${Registry}/api-gateway:${Version}"
Write-Host "  ${Registry}/papers-service:${Version}"
Write-Host "  ${Registry}/arxiv-service:${Version}"
Write-Host "  ${Registry}/comments-service:${Version}"
Write-Host "  ${Registry}/frontend:${Version}"
Write-Host "`nTo push images to registry:"
Write-Host "  .\scripts\push-images.ps1 $Version $Registry"
