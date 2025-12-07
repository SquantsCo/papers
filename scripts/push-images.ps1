# PowerShell version of push script
# Squants Papers - Push Script

param(
    [string]$Version = "latest",
    [string]$Registry = "squants"
)

Write-Host "Pushing images to registry..." -ForegroundColor Blue

docker push "${Registry}/api-gateway:${Version}"
docker push "${Registry}/papers-service:${Version}"
docker push "${Registry}/arxiv-service:${Version}"
docker push "${Registry}/comments-service:${Version}"
docker push "${Registry}/frontend:${Version}"

Write-Host "All images pushed successfully!" -ForegroundColor Green
