# PowerShell deployment script for DigitalOcean

param(
    [Parameter(Mandatory=$true)]
    [string]$DropletIP,
    
    [string]$Domain = "squants.com",
    
    [string]$Email = "your-email@squants.com"
)

Write-Host "🚀 Deploying Squants to DigitalOcean" -ForegroundColor Green
Write-Host "IP: $DropletIP" -ForegroundColor Cyan
Write-Host "Domain: $Domain" -ForegroundColor Cyan
Write-Host "Email: $Email" -ForegroundColor Cyan

# Check if SSH is available
try {
    $sshTest = ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@$DropletIP "echo 'SSH OK'" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Cannot connect to droplet. Check IP address." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ SSH not available or droplet not reachable." -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Running setup on droplet..." -ForegroundColor Yellow

# Setup script to run on droplet
$setupScript = @"
set -e
echo '📦 Installing dependencies...'
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs npm nginx certbot python3-certbot-nginx git

echo '📥 Cloning/updating repository...'
cd /opt
if [ -d papers ]; then
  cd papers
  git pull
else
  git clone https://github.com/SquantsCo/papers.git
  cd papers
fi

echo '📚 Installing Node dependencies...'
npm ci

echo '🔨 Building application...'
npm run build

echo '🔄 Starting application with PM2...'
npm install -g pm2
pm2 delete squants-frontend || true
pm2 start npm --name "squants-frontend" -- start
pm2 startup
pm2 save

echo '✅ Application running on port 3000'
"@

# Execute setup
ssh -o StrictHostKeyChecking=no root@$DropletIP $setupScript

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
    Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Configure DNS to point $Domain to $DropletIP"
    Write-Host "2. SSH to droplet: ssh root@$DropletIP"
    Write-Host "3. Run: sudo certbot --nginx -d $Domain -d www.$Domain -m $Email"
    Write-Host "4. Access your app at: https://$Domain" -ForegroundColor Green
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
