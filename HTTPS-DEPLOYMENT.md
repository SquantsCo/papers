# 🔐 HTTPS Deployment Guide

HTTPS is **required** for PWAs to work. This guide covers deployment options for your Squants application.

---

## 📋 Quick Overview

| Platform | Difficulty | Cost | HTTPS | Features |
|----------|-----------|------|-------|----------|
| **Vercel** | Easy | Free | ✅ Auto | Next.js optimized, CDN, serverless |
| **Netlify** | Easy | Free | ✅ Auto | Static hosting, CI/CD, serverless |
| **AWS** | Medium | Variable | ✅ Free SSL | Scalable, many services |
| **Azure** | Medium | Variable | ✅ Free SSL | Enterprise, integration |
| **DigitalOcean** | Medium | $4-6/mo | ✅ Free SSL | VPS, simple, affordable |
| **Heroku** | Easy | $7-50/mo | ✅ Free | PaaS, simple deployment |
| **Docker + K8s** | Hard | Variable | ✅ Free SSL | Full control, scalable |

**Recommendation**: Start with **Vercel** (easiest, free, perfect for Next.js PWA)

---

## 🚀 Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Built for Next.js
- ✅ Automatic HTTPS with auto-renewal
- ✅ Free tier for projects
- ✅ CDN for fast global delivery
- ✅ Serverless functions included
- ✅ Service Worker support
- ✅ Analytics included
- ✅ Preview deployments for PRs

### Step 1: Create Vercel Account

```powershell
# Option 1: Via web browser
# Visit: https://vercel.com/signup

# Option 2: Via CLI
npm install -g vercel
vercel login
```

### Step 2: Connect GitHub Repository

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select "Import Git Repository"
4. Authorize GitHub
5. Select `SquantsCo/papers` repository
6. Click "Import"

### Step 3: Configure Environment Variables

In Vercel dashboard:

**Settings → Environment Variables**

Add these variables:

```
NEXT_PUBLIC_API_URL=https://api.squants.com
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
```

For local/staging:
```
NEXT_PUBLIC_API_URL=https://api-staging.squants.com
```

### Step 4: Configure Build Settings

**Settings → Build & Development Settings**

```
Framework: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm ci
```

### Step 5: Deploy

```powershell
# Option 1: Auto-deploy from GitHub
# Every push to main auto-deploys

# Option 2: Deploy from CLI
vercel --prod

# Option 3: Via GitHub UI
# Push to main branch → auto-deploys
```

### Step 6: Custom Domain

**Settings → Domains**

1. Add your domain: `squants.com`
2. Configure DNS records (Vercel provides instructions)
3. HTTPS enabled automatically (Let's Encrypt)

### Step 7: Monitor Deployment

**Deployments tab** shows:
- ✅ Build status
- ✅ HTTPS certificate
- ✅ Performance metrics
- ✅ Analytics

### Vercel Cost

```
Free Tier:
- 10 projects
- Unlimited API calls
- 12 serverless function executions/month
- 100 GB bandwidth/month
- Custom domains

Pro: $20/month
- Unlimited projects
- Priority support
- Advanced analytics
```

---

## 🚀 Option 2: Netlify

### Why Netlify?
- ✅ Free HTTPS with auto-renewal
- ✅ Excellent for static sites + serverless
- ✅ Easy CI/CD
- ✅ Free tier very generous
- ✅ Form handling included

### Step 1: Create Netlify Account

```powershell
npm install -g netlify-cli
netlify login
```

Or: https://app.netlify.com/signup

### Step 2: Connect GitHub

1. Go to https://app.netlify.com/start
2. "Create new site"
3. "Connect to Git"
4. Choose GitHub
5. Select `SquantsCo/papers` repository

### Step 3: Configure Build

```
Build command: npm run build
Publish directory: .next/static
```

### Step 4: Deploy

```powershell
# Option 1: Auto-deploy from GitHub
# Push to main → auto-deploys

# Option 2: Deploy from CLI
netlify deploy --prod

# Option 3: Direct deployment
cd d:\squants
npm run build
netlify deploy --prod --dir=.next
```

### Step 5: Custom Domain

**Settings → Domain Management**

1. Add custom domain
2. Update DNS records
3. HTTPS auto-enabled

### Netlify Cost

```
Free Tier:
- Unlimited sites
- 100 GB bandwidth/month
- Free HTTPS
- CI/CD included
- Serverless functions (125,000 invocations/month)

Pro: $19/month
- Unlimited bandwidth
- Advanced analytics
- Priority support
```

---

## 🚀 Option 3: AWS (Scalable)

### Why AWS?
- ✅ Highly scalable
- ✅ Pay-as-you-go
- ✅ Global CDN (CloudFront)
- ✅ Free SSL certificates
- ✅ Microservices friendly
- ⚠️ More complex setup

### Architecture

```
User → CloudFront (CDN) → S3 (Static) / ALB (API) → Services
                ↓ HTTPS (ACM Certificate)
```

### Step 1: Create AWS Account

Visit: https://aws.amazon.com

### Step 2: Create S3 Bucket

```powershell
# Via AWS CLI
aws s3 mb s3://squants-frontend --region us-east-1

# Enable static hosting
aws s3api put-bucket-website --bucket squants-frontend `
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "404.html"}
  }'

# Block public access (use CloudFront instead)
aws s3api put-public-access-block --bucket squants-frontend `
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### Step 3: Request SSL Certificate

```powershell
# Via AWS Console
# Go to: AWS Certificate Manager (ACM)
# Click: Request a certificate
# Enter: squants.com, *.squants.com
# Select: DNS validation
# Verify domain ownership
```

### Step 4: Create CloudFront Distribution

```powershell
# Via AWS Console
# CloudFront → Create distribution
# Origin: S3 bucket
# SSL Certificate: Your ACM certificate
# Compress: Enable
# Cache Behavior: Cache everything
```

### Step 5: Update Route53 DNS

```powershell
# Point squants.com to CloudFront distribution
aws route53 change-resource-record-sets --hosted-zone-id YOUR_ZONE_ID `
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "squants.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "your-cloudfront-domain.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

### Step 6: Deploy to S3

```powershell
# Build app
npm run build

# Upload to S3
aws s3 sync .next/static/ s3://squants-frontend/ `
  --delete `
  --cache-control max-age=31536000

# Invalidate CloudFront cache
aws cloudfront create-invalidation `
  --distribution-id YOUR_DIST_ID `
  --paths '/*'
```

### AWS Cost Estimate

```
Monthly estimate:
- S3 storage: ~$1 (1 GB)
- CloudFront: ~$0.085/GB × 10GB = ~$0.85
- ACM certificate: Free
- Route53: ~$0.50
- Total: ~$2.50/month

Scaling:
- 100GB bandwidth: ~$8.50
- 1TB bandwidth: ~$85
```

---

## 🚀 Option 4: DigitalOcean (Affordable & Simple)

### Why DigitalOcean?
- ✅ Simple VPS hosting
- ✅ Very affordable ($4-6/month)
- ✅ Great documentation
- ✅ Free SSL with Let's Encrypt
- ✅ Great for learners
- ✅ Easy scaling

### Step 1: Create DigitalOcean Account

Visit: https://www.digitalocean.com

### Step 2: Create Droplet

```powershell
# Via DigitalOcean Console
# Create → Droplets
# Choose: Ubuntu 22.04 LTS
# Size: $4/month basic (1GB RAM, 1 CPU, 25GB SSD)
# Region: Pick closest to users
# Authentication: SSH key (recommended)
```

### Step 3: Connect & Setup

```powershell
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs npm

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (SSL certificates)
apt install -y certbot python3-certbot-nginx
```

### Step 4: Clone Repository

```powershell
# On droplet
cd /opt
git clone https://github.com/SquantsCo/papers.git
cd papers
npm ci
npm run build
```

### Step 5: Configure Nginx

Create `/etc/nginx/sites-available/squants`:

```nginx
server {
    listen 80;
    server_name squants.com www.squants.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker
    location /sw.js {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Manifest
    location /manifest.json {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

Enable site:

```powershell
ln -s /etc/nginx/sites-available/squants /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: Enable HTTPS

```powershell
# On droplet
certbot --nginx -d squants.com -d www.squants.com

# Auto-renew
systemctl enable certbot.timer
systemctl start certbot.timer
```

### Step 7: Start Application

```powershell
# On droplet
cd /opt/papers
pm2 start npm --name "squants-frontend" -- start
pm2 startup
pm2 save
```

### Step 8: Configure Domain

Point your domain DNS to DigitalOcean nameservers:
1. Buy domain (or use existing)
2. Go to domain registrar
3. Set nameservers to DigitalOcean's:
   - `ns1.digitalocean.com`
   - `ns2.digitalocean.com`
   - `ns3.digitalocean.com`

Or update A record to droplet IP.

### Step 9: Auto-Deploy with GitHub Actions

Create `.github/workflows/deploy-do.yml`:

```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy via SSH
        env:
          DEPLOY_KEY: ${{ secrets.DO_SSH_KEY }}
          DEPLOY_HOST: ${{ secrets.DO_HOST }}
          DEPLOY_USER: ${{ secrets.DO_USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no \
            $DEPLOY_USER@$DEPLOY_HOST \
            'cd /opt/papers && git pull && npm ci && npm run build && pm2 reload squants-frontend'
```

### DigitalOcean Cost

```
Droplet:
- Basic: $4/month (1GB RAM)
- Standard: $6/month (1GB RAM, 1 CPU, 30GB SSD)

Scaling:
- $12/month: 2GB RAM, 1 vCPU, 50GB SSD
- $24/month: 4GB RAM, 2 vCPU, 80GB SSD

Total monthly: $4-24 (plus domain ~$10/year)
```

---

## 🚀 Option 5: Docker + Kubernetes (Advanced)

### Use This If:
- ✅ Running full microservices
- ✅ Need auto-scaling
- ✅ Multiple environments (dev, staging, prod)
- ✅ High availability required

### HTTPS with cert-manager

Create `k8s/ingress.yaml`:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: squants-cert
spec:
  secretName: squants-tls
  issuerRef:
    name: letsencrypt-prod
  dnsNames:
    - squants.com
    - www.squants.com
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: squants-ingress
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - squants.com
        - www.squants.com
      secretName: squants-tls
  rules:
    - host: squants.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 3000
    - host: api.squants.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-gateway
                port:
                  number: 3000
```

### Deploy

```powershell
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@squants.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
EOF

# Deploy ingress
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get certificate
kubectl describe certificate squants-cert
```

---

## 📊 Deployment Comparison

| Feature | Vercel | Netlify | AWS | DigitalOcean | K8s |
|---------|--------|---------|-----|--------------|-----|
| **HTTPS** | ✅ Auto | ✅ Auto | ✅ Free | ✅ Free | ✅ Free |
| **Cost** | Free | Free | $2-20/mo | $4-24/mo | $5-100/mo |
| **Setup Time** | 5 min | 5 min | 30 min | 20 min | 1 hour |
| **Scalability** | ✅ Auto | ✅ Auto | ✅ ✅ | Manual | ✅ ✅ |
| **Next.js Support** | ✅ Best | ✅ Good | ✅ Good | ✅ Good | ✅ Good |
| **Microservices** | No | No | ✅ | Possible | ✅ ✅ |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Learning Curve** | ⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |

---

## ✅ Recommended Path

### Phase 1: Development
- Use `localhost:3000`
- Test PWA in Chrome DevTools

### Phase 2: Staging (Free)
- Deploy to **Vercel** free tier
- Get real HTTPS certificate
- Test on real mobile devices
- URL: `staging.vercel.app`

### Phase 3: Production
- **Option A (Recommended)**: Vercel Pro ($20/mo)
  - Best for frontend
  - Auto-scaling
  - Easy deployment
  
- **Option B (Budget)**: DigitalOcean ($4/mo)
  - VPS control
  - Full stack
  - Auto-deploy via GitHub
  
- **Option C (Enterprise)**: AWS/Azure
  - Global CDN
  - High availability
  - Microservices support

---

## 🔒 Pre-Deployment Checklist

- [ ] **HTTPS enabled** on deployment platform
- [ ] **Service Worker** works (check DevTools)
- [ ] **Manifest.json** valid
- [ ] **App icons** in place
- [ ] **Environment variables** configured
- [ ] **Database** accessible (PostgreSQL, Redis)
- [ ] **API Gateway** running
- [ ] **Security headers** set in Next.js config
- [ ] **Domain DNS** pointing to deployment
- [ ] **CORS** configured for API calls
- [ ] **Rate limiting** enabled on API
- [ ] **Logging** configured
- [ ] **Monitoring** setup (optional)

---

## 🚀 Quick Start: Vercel

```powershell
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
cd d:\squants
vercel --prod

# 4. Add environment variables in Vercel console

# 5. Connect custom domain
# Done! HTTPS auto-enabled
```

That's it! Your PWA is live with HTTPS. 🎉

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **AWS Docs**: https://docs.aws.amazon.com
- **DigitalOcean Docs**: https://docs.digitalocean.com
- **Let's Encrypt**: https://letsencrypt.org
- **cert-manager**: https://cert-manager.io
