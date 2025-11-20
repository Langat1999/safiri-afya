# Quick Deploy Reference - Safiri Afya

## 🎯 Deployment Architecture

```
Frontend (Netlify) → Backend (Vercel) → Database (Supabase)
   All FREE TIER ✅
```

---

## 📝 Manual Steps Checklist

### 1️⃣ Deploy Backend to Vercel (Do This First!)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"** → Import your GitHub repo
3. Configure:
   - **Framework:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
4. Add ALL environment variables from `backend/.env`
5. Deploy and **COPY THE VERCEL URL** (you'll need it for step 2)

**Test:** Visit `https://your-backend.vercel.app/api/health`

---

### 2️⃣ Deploy Frontend to Netlify (Do This Second!)

1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"** → GitHub
3. Select your `safiri-afya-ui` repository
4. Configure is auto-detected from `netlify.toml` ✅
5. **BEFORE deploying**, add environment variable:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
   (Use the Vercel URL from step 1)
6. Deploy and **COPY THE NETLIFY URL**

**Test:** Visit `https://your-app.netlify.app`

---

### 3️⃣ Update Backend CORS (Critical!)

1. Go back to Vercel → Your backend project → Settings → Environment Variables
2. Update these two variables:
   ```
   ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,https://your-app.netlify.app
   APP_URL=https://your-app.netlify.app
   ```
   (Use the Netlify URL from step 2)
3. **Redeploy backend:** Deployments → Click ⋯ → Redeploy

---

### 4️⃣ Test Everything

- ✅ Visit frontend: `https://your-app.netlify.app`
- ✅ Register a new user
- ✅ Test symptom checker
- ✅ Test clinic locator
- ✅ Check browser console for errors (should be none)

---

## 🔑 Environment Variables Quick Copy

### For Vercel (Backend):
```bash
# Copy ALL from backend/.env
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=...
MPESA_PASSKEY=...
MPESA_CALLBACK_URL=https://your-backend.vercel.app/api/payments/mpesa/callback
MPESA_RESULT_URL=https://your-backend.vercel.app/api/payments/mpesa/result
SENDGRID_API_KEY=...
OPENROUTER_API_KEY=...
GUARDIAN_API_KEY=...
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,https://your-app.netlify.app
APP_URL=https://your-app.netlify.app
NODE_ENV=production
PORT=3001
```

### For Netlify (Frontend):
```bash
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🚀 Deployment Order

**ALWAYS deploy in this order:**
1. Backend (Vercel) → Get URL
2. Frontend (Netlify) → Use backend URL
3. Update backend CORS → Use frontend URL
4. Redeploy backend

---

## 🆘 Common Issues

### "Failed to fetch" error on frontend
- Check `VITE_API_URL` in Netlify matches your Vercel backend URL
- Check `ALLOWED_ORIGINS` in Vercel includes your Netlify URL
- Make sure both URLs have `https://` and NO trailing slash

### Backend 500 errors
- Check Vercel function logs for missing env variables
- Verify `DATABASE_URL` has `?pgbouncer=true`

### M-Pesa not working
- Update callback URLs in Safaricom Developer Portal:
  - `https://your-backend.vercel.app/api/payments/mpesa/callback`
  - `https://your-backend.vercel.app/api/payments/mpesa/result`

---

## 📁 Files Created for You

- ✅ `netlify.toml` - Netlify configuration
- ✅ `backend/vercel.json` - Vercel backend configuration
- ✅ `.env.example` - Frontend env template (updated)
- ✅ `backend/.env.example` - Backend env template (updated)
- ✅ `DEPLOYMENT_GUIDE_SPLIT.md` - Full detailed guide

---

## 💰 Cost: $0/month (All Free Tier!)

- Netlify Free: 100GB bandwidth
- Vercel Hobby: 100GB bandwidth
- Supabase Free: 500MB database

---

## 📚 Resources

- Full Guide: See `DEPLOYMENT_GUIDE_SPLIT.md`
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com/

---

**Ready to deploy!** 🎉
