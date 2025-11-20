# Safiri Afya - Split Deployment Guide

**Architecture:** Frontend on Netlify | Backend on Vercel | Database on Supabase

All services use **FREE TIER** 🎉

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Part 1: Deploy Backend to Vercel](#part-1-deploy-backend-to-vercel)
4. [Part 2: Deploy Frontend to Netlify](#part-2-deploy-frontend-to-netlify)
5. [Part 3: Configure M-Pesa Callbacks](#part-3-configure-m-pesa-callbacks)
6. [Testing Your Deployment](#testing-your-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

✅ **Accounts Required:**
- [GitHub](https://github.com/) - Free
- [Vercel](https://vercel.com/) - Free tier
- [Netlify](https://www.netlify.com/) - Free tier
- [Supabase](https://supabase.com/) - Already set up

✅ **Your Code:**
- Push your code to GitHub repository

---

## Architecture Overview

```
┌─────────────────────────────┐
│   Netlify (Frontend)        │
│ https://app.netlify.app     │  ← User visits this URL
│                             │
│ - React App (Vite)          │
│ - Static Assets             │
│ - SPA Routing               │
└──────────┬──────────────────┘
           │
           │ HTTPS API Calls
           │ Authorization: Bearer <JWT>
           │
           ▼
┌─────────────────────────────┐
│  Vercel (Backend API)       │
│ https://backend.vercel.app  │  ← API endpoints
│                             │
│ - Express Server            │
│ - Authentication            │
│ - M-Pesa Integration        │
│ - Health API                │
└──────────┬──────────────────┘
           │
           │ Prisma ORM
           │ PostgreSQL
           │
           ▼
┌─────────────────────────────┐
│   Supabase (Database)       │
│                             │
│ - PostgreSQL Database       │
│ - Connection Pooling        │
└─────────────────────────────┘
```

---

## Part 1: Deploy Backend to Vercel

### Step 1.1: Prepare Backend for Deployment

Your backend is already configured! These files have been created:
- ✅ `backend/vercel.json` - Vercel configuration
- ✅ `backend/.env.example` - Environment variable template

### Step 1.2: Create Vercel Project

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Your GitHub Repository**
   - Click **"Import Git Repository"**
   - Select your `safiri-afya-ui` repository
   - Click **"Import"**

3. **Configure Project Settings**

   **IMPORTANT:** Configure these settings:

   ```
   Framework Preset: Other
   Root Directory: backend
   Build Command: npm run build
   Output Directory: (leave empty)
   Install Command: npm install
   ```

   Click **"Environment Variables"** to add all variables.

### Step 1.3: Add Environment Variables to Vercel

Copy all values from `backend/.env` and add them to Vercel:

**Required Environment Variables:**

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres

# JWT Authentication
JWT_SECRET=your_jwt_secret_here_minimum_64_characters

# M-Pesa
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_INITIATOR_NAME=your_initiator_name
MPESA_SECURITY_CREDENTIAL=your_credential
MPESA_CALLBACK_URL=https://YOUR-BACKEND.vercel.app/api/payments/mpesa/callback
MPESA_RESULT_URL=https://YOUR-BACKEND.vercel.app/api/payments/mpesa/result
DEVELOPER_MPESA_NUMBER=254XXXXXXXXX
DEVELOPER_COMMISSION_PERCENTAGE=15

# Email (SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_key
FROM_EMAIL=noreply@safiriafya.com
APP_URL=https://YOUR-FRONTEND.netlify.app

# AI Services
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key

# News API
GUARDIAN_API_KEY=your_guardian_key

# CORS - IMPORTANT: Add Netlify URL after Part 2
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,https://YOUR-FRONTEND.netlify.app

# Server
PORT=3001
NODE_ENV=production
```

**To add variables in Vercel:**
1. In project settings, go to **"Settings"** → **"Environment Variables"**
2. Add each variable with its value
3. Select **"Production"**, **"Preview"**, and **"Development"**
4. Click **"Save"**

### Step 1.4: Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. **Copy your Vercel backend URL**: `https://YOUR-BACKEND.vercel.app`

### Step 1.5: Test Backend Deployment

Test the health endpoint:

```bash
curl https://YOUR-BACKEND.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Safiri Afya Backend API is running",
  "timestamp": "2025-11-20T..."
}
```

✅ **Backend deployment complete!**

---

## Part 2: Deploy Frontend to Netlify

### Step 2.1: Prepare Frontend

Your frontend is already configured! These files have been created:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `.env.example` - Environment variable template

### Step 2.2: Create Netlify Project

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/
   - Click **"Add new site"** → **"Import an existing project"**

2. **Connect to GitHub**
   - Click **"GitHub"**
   - Authorize Netlify
   - Select your `safiri-afya-ui` repository

3. **Configure Build Settings**

   Netlify will auto-detect settings from `netlify.toml`, but verify:

   ```
   Base directory: (leave empty - root)
   Build command: npm run build:frontend
   Publish directory: dist
   ```

### Step 2.3: Add Environment Variables to Netlify

**IMPORTANT:** Add the backend URL you got from Part 1

1. Before deploying, click **"Site settings"** → **"Environment variables"**
2. Add this variable:

```bash
VITE_API_URL=https://YOUR-BACKEND.vercel.app/api
```

Replace `YOUR-BACKEND` with your actual Vercel backend URL from Part 1.

### Step 2.4: Deploy Frontend

1. Click **"Deploy site"**
2. Wait for deployment (2-3 minutes)
3. **Copy your Netlify frontend URL**: `https://YOUR-APP.netlify.app`

### Step 2.5: Update Backend CORS

**CRITICAL:** Now that you have your Netlify URL, update the backend CORS settings:

1. Go back to **Vercel Dashboard** → Your backend project
2. Go to **"Settings"** → **"Environment Variables"**
3. Find `ALLOWED_ORIGINS` and edit it:

```bash
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,https://YOUR-APP.netlify.app
```

4. Also update `APP_URL`:

```bash
APP_URL=https://YOUR-APP.netlify.app
```

5. Click **"Save"**
6. **Redeploy backend**: Go to **"Deployments"** → Click ⋯ on latest deployment → **"Redeploy"**

### Step 2.6: Test Frontend Deployment

Visit your Netlify URL: `https://YOUR-APP.netlify.app`

You should see the Safiri Afya homepage! 🎉

✅ **Frontend deployment complete!**

---

## Part 3: Configure M-Pesa Callbacks

If you're using M-Pesa payments, update callback URLs in Safaricom Developer Portal:

1. Visit: https://developer.safaricom.co.ke/
2. Go to your app settings
3. Update callback URLs:

```
Callback URL: https://YOUR-BACKEND.vercel.app/api/payments/mpesa/callback
Result URL: https://YOUR-BACKEND.vercel.app/api/payments/mpesa/result
```

---

## Testing Your Deployment

### 1. Test Frontend Homepage
- Visit: `https://YOUR-APP.netlify.app`
- Should load without errors

### 2. Test API Connection
Open browser console (F12) and check for CORS errors. Should see none!

### 3. Test Authentication
1. Click **"Register"** on your Netlify site
2. Create a test account
3. Login
4. Check browser console - should see successful API calls

### 4. Test Features
- ✅ Symptom Checker
- ✅ Clinic Locator
- ✅ Doctor Appointments
- ✅ Health News
- ✅ User Profile

---

## Troubleshooting

### Frontend shows "Failed to fetch" errors

**Problem:** CORS error or wrong API URL

**Solution:**
1. Check Netlify environment variable `VITE_API_URL` is correct
2. Check Vercel `ALLOWED_ORIGINS` includes your Netlify URL (no trailing slash!)
3. Redeploy both frontend and backend

### Backend returns 500 errors

**Problem:** Missing environment variables

**Solution:**
1. Check Vercel logs: **Deployments** → Click deployment → **"View Function Logs"**
2. Verify all required env vars are set
3. Check database connection strings

### M-Pesa payments not working

**Problem:** Callback URLs not updated

**Solution:**
1. Update `MPESA_CALLBACK_URL` and `MPESA_RESULT_URL` in Vercel to point to your backend
2. Update callback URLs in Safaricom Developer Portal
3. Redeploy backend

### Database connection errors

**Problem:** Prisma can't connect to Supabase

**Solution:**
1. Check `DATABASE_URL` has `?pgbouncer=true` at the end
2. Check `DIRECT_URL` is set correctly
3. Verify Supabase database is active
4. Check Supabase connection limit (free tier: 60 connections)

### "Module not found" errors in Vercel build

**Problem:** Incorrect root directory

**Solution:**
1. Go to Vercel project **Settings** → **General**
2. Set **Root Directory** to: `backend`
3. Redeploy

### Frontend 404 on page refresh

**Problem:** SPA routing not configured (but `netlify.toml` should handle this)

**Solution:**
1. Check `netlify.toml` exists in root directory
2. Verify it has the redirect rule: `from = "/*"` to `to = "/index.html"`
3. Redeploy Netlify

---

## Cost Breakdown (FREE TIER)

| Service  | Plan | Cost | Limits |
|----------|------|------|--------|
| **Netlify** | Free | $0/month | 100GB bandwidth, 300 build minutes |
| **Vercel** | Hobby | $0/month | 100GB bandwidth, Serverless functions |
| **Supabase** | Free | $0/month | 500MB database, 2GB file storage |
| **TOTAL** | | **$0/month** | Suitable for development & testing |

---

## Manual Steps Summary

### ✅ Completed Automatically
- [x] Created `backend/vercel.json`
- [x] Created `netlify.toml`
- [x] Updated environment variable templates
- [x] Configured CORS support
- [x] Local testing completed

### ⚠️ Requires Manual Action

**One-Time Setup:**
- [ ] Create Vercel account (if you don't have one)
- [ ] Create Netlify account (if you don't have one)
- [ ] Push code to GitHub

**Backend Deployment (Vercel):**
- [ ] Create new Vercel project
- [ ] Set root directory to `backend`
- [ ] Add all environment variables from `backend/.env`
- [ ] Deploy and copy backend URL

**Frontend Deployment (Netlify):**
- [ ] Create new Netlify site
- [ ] Add `VITE_API_URL` environment variable with Vercel backend URL
- [ ] Deploy and copy frontend URL

**Final Configuration:**
- [ ] Update `ALLOWED_ORIGINS` in Vercel with Netlify URL
- [ ] Update `APP_URL` in Vercel with Netlify URL
- [ ] Redeploy Vercel backend
- [ ] Update M-Pesa callback URLs in Safaricom portal (if using M-Pesa)

---

## Next Steps

1. **Custom Domains (Optional)**
   - Netlify: Settings → Domain management → Add custom domain
   - Vercel: Settings → Domains → Add domain

2. **SendGrid Email Setup**
   - Sign up at: https://signup.sendgrid.com/
   - Create API key
   - Add to Vercel environment variables

3. **Production M-Pesa**
   - Apply for production credentials
   - Update environment variables
   - Update callback URLs

4. **Monitoring**
   - Vercel: Built-in analytics and logs
   - Netlify: Built-in analytics
   - Supabase: Database monitoring dashboard

---

## Support

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com/
- Supabase Docs: https://supabase.com/docs

**Deployment successful!** 🚀

Your application is now live with:
- ✅ Fast frontend on Netlify CDN
- ✅ Scalable backend on Vercel serverless
- ✅ Reliable database on Supabase
- ✅ All on FREE tier!
