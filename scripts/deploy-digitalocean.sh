#!/bin/bash
# Quick deployment script for DigitalOcean

# Configuration
DROPLET_IP="${1}"
DOMAIN="${2:-squants.com}"
EMAIL="${3:-your-email@squants.com}"

if [ -z "$DROPLET_IP" ]; then
  echo "Usage: ./deploy-do.sh <droplet-ip> [domain] [email]"
  echo "Example: ./deploy-do.sh 123.45.67.89 squants.com admin@squants.com"
  exit 1
fi

echo "🚀 Deploying Squants to DigitalOcean"
echo "IP: $DROPLET_IP"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"

# SSH into droplet and run setup
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'ENDSSH'
set -e

echo "📦 Installing dependencies..."
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs npm nginx certbot python3-certbot-nginx git

echo "📥 Cloning repository..."
cd /opt
git clone https://github.com/SquantsCo/papers.git || (cd papers && git pull)
cd papers

echo "📚 Installing Node dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

echo "🔄 Starting application with PM2..."
npm install -g pm2
pm2 delete squants-frontend || true
pm2 start npm --name "squants-frontend" -- start
pm2 startup
pm2 save

echo "✅ Deployment complete!"
echo "Next steps:"
echo "1. Configure DNS to point to this droplet"
echo "2. Run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN -m $EMAIL"
echo "3. Access your app at: https://$DOMAIN"

ENDSSH

echo "✅ DigitalOcean deployment complete!"
