# 🚀 Vercel Deployment Step-by-Step Guide (Web Interface)

## Complete guide for deploying SquantsCo/papers on Vercel without CLI

---

## 📋 Prerequisites

✅ GitHub account with `SquantsCo/papers` repository  
✅ Code pushed to main branch  
✅ Vercel account (free)  

---

## 🎯 Step 1: Create Vercel Account (If Needed)

### 1.1 Visit Vercel

Open: **https://vercel.com/signup**

### 1.2 Choose Sign-Up Method

You have 3 options:

**Option A: Sign Up with GitHub (Recommended)**
1. Click "Continue with GitHub"
2. Authorize Vercel to access GitHub
3. Done! Your GitHub account is linked

**Option B: Sign Up with Email**
1. Enter email address
2. Check email for verification link
3. Click link to verify
4. Set password

**Option C: Sign Up with Google/GitLab**
1. Click "Continue with Google" or "Continue with GitLab"
2. Authorize Vercel
3. Done

### 1.3 Confirm Email (if needed)

Check your email for verification link and click it.

---

## 📁 Step 2: Import Your GitHub Repository

### 2.1 Go to New Project Page

After sign-up, you'll see the dashboard. Click:

```
→ "Add New" (top right)
→ "Project"
```

Or go directly to: **https://vercel.com/new**

### 2.2 Select Import Git Repository

You'll see three options:

```
┌─────────────────────────────────┐
│ Select a Git Repository         │
├─────────────────────────────────┤
│ ☐ Import Git Repository         │ ← Click this
│ ☐ Continue with Templates       │
│ ☐ Clone a Template              │
└─────────────────────────────────┘
```

Click on **"Import Git Repository"**

### 2.3 Connect GitHub Account (if not already)

If not connected yet:

```
1. Click "Install Vercel GitHub App"
2. Choose GitHub account
3. Select repositories to authorize
   (choose "All repositories" or select specific ones)
4. Click "Install & Authorize"
```

### 2.4 Search for Your Repository

After connecting GitHub, you'll see a search box:

```
Find a Repository:
[Search box with "SquantsCo" text field]
```

**Type**: `papers`

Or full name: `SquantsCo/papers`

### 2.5 Select the Repository

The repository list appears:

```
┌──────────────────────────────────┐
│ SquantsCo/papers                 │
│ Updated 2 minutes ago            │
│                                  │
│ [Select]                         │ ← Click this
└──────────────────────────────────┘
```

Click **"Select"** button on the right.

---

## ⚙️ Step 3: Configure Project Settings

After selecting the repo, you'll see the project configuration page.

### 3.1 Project Name

```
Project Name
[squants-papers] ← Can be different from repo name
```

You can keep default or change it. This is your project name in Vercel.

Recommended: `squants-papers` or `squants-frontend`

### 3.2 Framework

Vercel auto-detects Next.js. Verify it shows:

```
Framework: Next.js
```

If not, click dropdown and select **"Next.js"**

### 3.3 Build & Development Settings

Click **"Build and Output Settings"** to expand:

```
Build Command: npm run build
├─ This runs when deploying
└─ Should already be set correctly

Output Directory: 
├─ Usually blank for Next.js
└─ Vercel auto-detects

Install Command: npm ci
├─ Downloads dependencies
└─ Already set correctly
```

These are usually correct for Next.js. No changes needed.

### 3.4 Root Directory

If your `package.json` is in the root, leave blank.

Since your `package.json` is at `d:\squants\package.json`, this is correct.

---

## 🔐 Step 4: Set Environment Variables (Optional)

Environment variables configure your app settings.

### 4.1 View Environment Variables Section

You'll see:

```
Environment Variables

Key                    Value              [−]
NEXT_PUBLIC_API_URL    http://localhost:3000
DATABASE_URL           [your-value]
REDIS_URL              [your-value]
JWT_SECRET             dev-secret-key-change-in-production

[+ Add More]
```

### 4.2 Review Current Variables

The interface shows your current variables:

- **NEXT_PUBLIC_API_URL**: Where your API is located
  - Currently: `http://localhost:3000` (development)
  - Change to: `https://api.squants.com` when API is deployed
  
- **DATABASE_URL**: Database connection (optional for frontend)
- **REDIS_URL**: Redis connection (optional for frontend)
- **JWT_SECRET**: Secret key for authentication

### 4.3 Update Variables (Optional)

To update a variable:

1. Click on the **Value** field
2. Edit the value
3. Press **Enter** to save

To remove a variable:

1. Click the **minus (−)** button on the right
2. Variable is deleted

To add a new variable:

1. Click **"+ Add More"** button
2. Enter **Key** name
3. Enter **Value**
4. New variable is added

### 4.4 For Frontend-Only Deployment

You can safely:

- Remove: `DATABASE_URL` (frontend doesn't need it)
- Remove: `REDIS_URL` (frontend doesn't need it)
- Keep: `NEXT_PUBLIC_API_URL` (tells frontend where API is)
- Keep: `JWT_SECRET` (for future use)

OR just keep everything as-is and deploy!

---

## 🚀 Step 5: Deploy

### 5.1 Click Deploy Button

At bottom right of page:

```
[Cancel]  [Deploy]
```

Click the **"Deploy"** button (blue button on right)

### 5.2 Wait for Deployment

You'll see:

```
Deployment in Progress...
├─ Building...
├─ Generating images...
├─ Creating serverless functions...
└─ Finalizing...

[Progress bar]
```

This takes **2-5 minutes** depending on:
- Dependencies to install
- Build size
- Vercel server load

### 5.3 Check Deployment Status

When complete, you'll see:

```
✓ Deployment Complete!

Congratulations! Your project has been successfully deployed.

[Visit] → https://squants-papers.vercel.app

[Go to Dashboard]
```

Your app is now **LIVE** with HTTPS!

---

## ✅ Step 6: Verify Deployment

### 6.1 Visit Your Deployed App

Click the preview link that appears:

```
https://squants-papers.vercel.app
```

Or copy the URL to your browser.

### 6.2 Check If It Works

- [ ] Page loads
- [ ] No 404 errors
- [ ] HTTPS enabled (lock icon in URL bar)
- [ ] Navigation links work
- [ ] API calls work (if backend is accessible)

### 6.3 Check Deployment Logs

1. Go to **Deployments** tab (at top)
2. Click on latest deployment
3. View build logs
4. Look for errors

---

## 🌐 Step 7: Connect Custom Domain

### 7.1 Go to Project Settings

In Vercel dashboard:

```
Your Project → Settings → Domains
```

### 7.2 Add Domain

```
Add Domain
[Input field: squants.com]
[Enter]
```

Type your domain: `squants.com`

### 7.3 Vercel Shows DNS Instructions

Vercel displays:

```
Configure your domain
├─ Option 1: Update nameservers (easy)
├─ Option 2: Add DNS records (advanced)
└─ Option 3: CNAME record (if already using DNS)
```

**Recommended**: **Option 1** (Update nameservers)

### 7.4 Update Domain Registrar

Where you bought your domain (GoDaddy, Namecheap, etc.):

1. Log in to registrar
2. Find "Nameservers" settings
3. Change to Vercel's nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```
4. Save changes

### 7.5 Wait for DNS Propagation

DNS takes **24-48 hours** to fully propagate, but usually works within **10 minutes**.

Check status at: https://dnschecker.org

### 7.6 Verify HTTPS

Once DNS is updated:

```
✓ https://squants.com works
✓ SSL certificate auto-enabled (Let's Encrypt)
✓ Certificate auto-renews yearly
```

---

## 📊 Step 8: Configure Auto-Deployment

Vercel auto-deploys on every push to `main` branch. Verify this is set up:

### 8.1 Go to Project Settings

```
Settings → Git Integration
```

### 8.2 Check Production Branch

Should show:

```
Production Branch: main
```

If not, click "Edit" and select `main`.

### 8.3 Test Auto-Deployment

1. Make a small change to your code
2. Push to GitHub:
   ```powershell
   git add .
   git commit -m "test deployment"
   git push origin main
   ```
3. Go to Vercel Dashboard
4. Watch **Deployments** tab
5. Should see new deployment starting automatically

---

## 🔔 Step 9: Enable Notifications (Optional)

### 9.1 Go to Account Settings

Top right → **Settings** → **Notifications**

### 9.2 Configure Alerts

Enable notifications for:
- ✅ Deployment started
- ✅ Deployment completed
- ✅ Deployment failed (important!)

Choose notification method:
- Email
- Slack (if you have Slack workspace)

---

## 🎯 Step 10: Monitor Your App

### 10.1 View Deployments

Click **Deployments** tab to see:

```
Deployments
├─ Latest (Production)
│  ├─ Date/time
│  ├─ Commit message
│  ├─ Status ✓
│  └─ Duration
├─ Previous deployment
├─ Previous deployment
└─ ...
```

### 10.2 Check Analytics

Click **Analytics** tab to see:

```
Real-time Analytics
├─ Requests
├─ Status codes
├─ Response times
├─ Top pages
└─ Browser usage
```

### 10.3 View Logs

Click on deployment → **Logs** tab:

```
Build Logs
├─ npm ci
├─ npm run build
├─ Deployment configuration
└─ [Server logs if available]
```

---

## 🐛 Troubleshooting

### Build Fails with "Module not found"

**Solution:**
1. Make sure `package-lock.json` is committed to GitHub
2. Check all imports are correct
3. Redeploy

### App Shows 500 Error

**Solution:**
1. Check Environment Variables are set correctly
2. Verify database/API URLs are correct
3. Check logs in Deployments tab
4. Redeploy

### HTTPS Certificate Not Working

**Solution:**
- Vercel auto-creates certificates
- Wait 5 minutes if just deployed
- Check domain DNS is pointing to Vercel

### Domain Not Working

**Solution:**
1. Check DNS propagation: https://dnschecker.org
2. Wait 24 hours for full propagation
3. Check nameservers in registrar match Vercel

---

## 📋 Quick Reference

| Step | Action | Location |
|------|--------|----------|
| 1 | Create account | https://vercel.com/signup |
| 2 | Import repo | https://vercel.com/new |
| 3 | Configure project | After selecting repo |
| 4 | Set env variables | Environment Variables section |
| 5 | Deploy | Click blue "Deploy" button |
| 6 | Verify | Visit squants-papers.vercel.app |
| 7 | Add domain | Settings → Domains |
| 8 | Check auto-deploy | Settings → Git Integration |
| 9 | Monitor | Deployments tab |

---

## ✅ Deployment Checklist

- [ ] Vercel account created
- [ ] GitHub repo imported
- [ ] Environment variables set (development)
- [ ] Environment variables set (production)
- [ ] Initial deployment successful
- [ ] App loads at vercel.app URL
- [ ] HTTPS working (lock icon visible)
- [ ] Custom domain added
- [ ] DNS updated at registrar
- [ ] Custom domain resolves
- [ ] Auto-deployment configured
- [ ] Notifications enabled
- [ ] Can monitor deployments

---

## 🎉 Success!

Once you complete these steps, your app will be:

✅ **Live on HTTPS** - squants.com  
✅ **Auto-scaling** - Vercel handles traffic  
✅ **Auto-deploying** - Every push to main deploys  
✅ **PWA enabled** - Users can install app  
✅ **Mobile optimized** - Works on all devices  
✅ **Monitored** - Get alerts on failures  

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Next.js Deployment**: https://nextjs.org/learn/basics/deploying-nextjs-app

---

## 🚀 Next: Set Up Backend

After frontend is deployed:

1. Deploy API Gateway to separate service
2. Update `NEXT_PUBLIC_API_URL` to API endpoint
3. Deploy other microservices
4. Connect everything

Your frontend is done! 🎉
