# 📋 Step-by-Step Vercel Setup Guide

**Complete configuration guide for deploying Safiri Afya on Vercel with Supabase**

---

## ✅ Required Vercel Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

For each variable below:
1. Click **"Add"**
2. Enter **Key** and **Value**
3. Select **Production**, **Preview**, and **Development**
4. Click **"Save"**

---

### 🗄️ Database Configuration (Supabase)

#### 1. DATABASE_URL
```
postgresql://postgres.vixtrsbooqqxidqzpxza:%23Mutisojackson55@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```
**Description:** Session pooler for runtime queries with connection pooling

**How to get it:**
1. Go to Supabase Dashboard → Project Settings → Database
2. Under "Connection string" → Select **"Session mode"**
3. Copy the URI
4. Add `?pgbouncer=true` at the end
5. Replace `[YOUR-PASSWORD]` with your actual password
6. **Important:** URL-encode special characters (# → %23)

---

#### 2. DIRECT_URL
```
postgresql://postgres.vixtrsbooqqxidqzpxza:%23Mutisojackson55@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```
**Description:** Transaction pooler for migrations

**How to get it:**
1. Supabase Dashboard → Project Settings → Database
2. Under "Connection string" → Select **"Transaction mode"**
3. Copy the URI
4. Replace `[YOUR-PASSWORD]` with your actual password
5. **Important:** URL-encode special characters (# → %23)

---

### ⚙️ Server Configuration

#### 3. NODE_ENV
```
production
```
**Description:** Tells the app it's running in production mode

---

#### 4. PORT
```
3001
```
**Description:** Port number for the backend server (Vercel handles this automatically)

---

### 🔐 Authentication

#### 5. JWT_SECRET
```
6742680a3437944e6e100f6f39bf618b889c89aab83e1a69570d656a75f742d26163e738d38bd006dc3151411b6a9bf0fdcb6743c222b1bd7907a7a75afd82c2
```
**Description:** Secret key for JWT token generation (64+ characters)

**How to generate your own:**
```bash
# On Linux/Mac
openssl rand -hex 64

# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# Online
# Visit: https://generate-random.org/api-key-generator
```

---

### 💳 M-Pesa Configuration

#### 6. MPESA_ENVIRONMENT
```
sandbox
```
**Description:** Use "sandbox" for testing, "production" for live payments

---

#### 7. MPESA_CONSUMER_KEY
```
PAW87o1bIJEU3hAyhauUAXuZnwpDNANnLS7vFrA9UUGZXmSR
```
**Description:** M-Pesa API consumer key

**How to get it:**
1. Go to https://developer.safaricom.co.ke/
2. Login/Register
3. Create an app (select STK Push)
4. Copy the Consumer Key from your app

---

#### 8. MPESA_CONSUMER_SECRET
```
mmDn4f8Hy0hnHvzUXxGnJ8uUoKuB10yL8pP5uQj4KTGWwDmF7zD4ttPShaUheoJc
```
**Description:** M-Pesa API consumer secret

**How to get it:**
- Same as Consumer Key (shown on the same page)

---

#### 9. MPESA_SHORTCODE
```
174379
```
**Description:** M-Pesa business short code

**For sandbox:** Use `174379`
**For production:** Use your actual business shortcode

---

#### 10. MPESA_PASSKEY
```
bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
```
**Description:** M-Pesa Lipa Na M-Pesa passkey

**For sandbox:** Use the key above
**For production:** Get from Safaricom after approval

---

#### 11. MPESA_INITIATOR_NAME
```
testapi
```
**Description:** Initiator name for M-Pesa transactions

**For sandbox:** Use `testapi`
**For production:** Use your actual initiator name

---

#### 12. MPESA_SECURITY_CREDENTIAL
```
Safaricom999!*!
```
**Description:** Security credential for M-Pesa

**For sandbox:** Use `Safaricom999!*!`
**For production:** Get encrypted credential from Safaricom

---

#### 13. MPESA_CALLBACK_URL
```
https://safiri-afya-ui.vercel.app/api/payments/mpesa/callback
```
**Description:** URL where M-Pesa sends payment confirmations

**How to set it:**
- Replace `safiri-afya-ui.vercel.app` with YOUR Vercel domain
- Keep the `/api/payments/mpesa/callback` path
- Example: `https://my-health-app.vercel.app/api/payments/mpesa/callback`

**Important:** After deployment, update this in:
1. Vercel environment variables
2. Safaricom Developer Portal (under your app settings)

---

#### 14. MPESA_RESULT_URL
```
https://safiri-afya-ui.vercel.app/api/payments/mpesa/result
```
**Description:** URL where M-Pesa sends transaction results

**How to set it:**
- Same as MPESA_CALLBACK_URL but with `/result` endpoint
- Example: `https://my-health-app.vercel.app/api/payments/mpesa/result`

---

#### 15. DEVELOPER_MPESA_NUMBER
```
254713809220
```
**Description:** Your M-Pesa number for receiving commission payments

**Format:** 254XXXXXXXXX (Kenya format)

---

#### 16. DEVELOPER_COMMISSION_PERCENTAGE
```
15
```
**Description:** Percentage of payment you keep as commission

**Example:** 15 means you keep 15% of each payment

---

### 🌐 CORS & Frontend Configuration

#### 17. ALLOWED_ORIGINS
```
http://localhost:8080,http://localhost:5173,https://safiri-afya-ui.vercel.app
```
**Description:** Allowed domains for API access (CORS)

**How to set it:**
- Replace `safiri-afya-ui.vercel.app` with YOUR Vercel domain
- Keep localhost URLs for local development
- Separate multiple URLs with commas (no spaces)

**Example:**
```
http://localhost:8080,http://localhost:5173,https://my-health-app.vercel.app
```

---

#### 18. APP_URL
```
https://safiri-afya-ui.vercel.app
```
**Description:** Your frontend application URL

**How to set it:**
- Use your Vercel deployment URL
- Example: `https://my-health-app.vercel.app`

---

### 🤖 AI Services (Optional but Recommended)

#### 19. OPENROUTER_API_KEY
```
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
```
**Description:** API key for AI-powered symptom checker

**How to get it:**
1. Go to https://openrouter.ai/
2. Sign up / Login
3. Go to Keys → Generate New Key
4. Copy the key (starts with `sk-or-v1-`)

**If you skip this:** Symptom checker will not work

---

### 📰 News Services (Optional)

#### 20. GUARDIAN_API_KEY
```
7dbc521f-3149-4416-b103-de0ff728e4ce
```
**Description:** API key for health news from The Guardian

**How to get it:**
1. Go to https://open-platform.theguardian.com/
2. Register for a developer key
3. Copy the API key

**If you skip this:** Health news will not display

---

### 📧 Email Service (Optional)

#### 21. SENDGRID_API_KEY
```
(leave empty if not using SendGrid)
```
**Description:** API key for sending emails

**How to get it:**
1. Go to https://sendgrid.com/
2. Sign up (free tier available)
3. Settings → API Keys → Create API Key
4. Copy the key (starts with `SG.`)

**If you skip this:** Password reset emails won't work (users can still register/login)

---

#### 22. FROM_EMAIL
```
noreply@safiriafya.com
```
**Description:** Email address that appears as sender

**How to set it:**
- If using SendGrid: Use your verified sender email
- Otherwise: Keep as `noreply@safiriafya.com` (won't send emails but won't crash)

---

### 🗄️ Supabase Direct Client (Optional)

#### 23. SUPABASE_URL
```
https://vixtrsbooqqxidqzpxza.supabase.co
```
**Description:** Your Supabase project URL

**How to get it:**
1. Supabase Dashboard → Project Settings → API
2. Copy the "Project URL"

---

#### 24. SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeHRyc2Jvb3FxeGlkcXpweHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjUxNjYsImV4cCI6MjA3OTA0MTE2Nn0.C6ioXnyqkK6hvtR_uQczW4bdsixmmnszlb48HnJI2Zs
```
**Description:** Supabase anonymous/public key

**How to get it:**
1. Supabase Dashboard → Project Settings → API
2. Copy the "anon public" key

---

## 🚀 After Adding All Variables

### Step 1: Redeploy
1. Go to **Deployments** tab in Vercel
2. Click the **"•••"** menu on the latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"**
5. Click **"Redeploy"**

### Step 2: Wait for Deployment
- Build takes ~2-3 minutes
- Watch the build logs for any errors
- Once complete, you'll see "Deployment Ready"

### Step 3: Test Your Deployment

**Test Backend API:**
```bash
curl https://YOUR-VERCEL-DOMAIN.vercel.app/api/health
```
Expected response:
```json
{"status":"healthy"}
```

**Test Database Connection:**
```bash
curl https://YOUR-VERCEL-DOMAIN.vercel.app/api/clinics
```
Expected: Array of clinics with data

**Test Frontend:**
- Open: `https://YOUR-VERCEL-DOMAIN.vercel.app`
- You should see the homepage load
- Try these features:
  - ✅ View clinics on map
  - ✅ AI symptom checker
  - ✅ Register new account
  - ✅ Login (admin@safiriafya.com / Admin@123456)

---

## 🎯 Environment Variables Checklist

Copy this checklist and mark off as you add each variable:

### Required (Must Have)
- [ ] DATABASE_URL
- [ ] DIRECT_URL
- [ ] NODE_ENV
- [ ] PORT
- [ ] JWT_SECRET
- [ ] MPESA_ENVIRONMENT
- [ ] MPESA_CONSUMER_KEY
- [ ] MPESA_CONSUMER_SECRET
- [ ] MPESA_SHORTCODE
- [ ] MPESA_PASSKEY
- [ ] MPESA_INITIATOR_NAME
- [ ] MPESA_SECURITY_CREDENTIAL
- [ ] MPESA_CALLBACK_URL
- [ ] MPESA_RESULT_URL
- [ ] DEVELOPER_MPESA_NUMBER
- [ ] DEVELOPER_COMMISSION_PERCENTAGE
- [ ] ALLOWED_ORIGINS
- [ ] APP_URL

### Optional (Recommended)
- [ ] OPENROUTER_API_KEY (AI symptoms)
- [ ] GUARDIAN_API_KEY (Health news)
- [ ] SENDGRID_API_KEY (Emails)
- [ ] FROM_EMAIL
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY

---

## 🔧 Common Issues

### Issue: "Database connection failed"
**Solution:**
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check password is URL-encoded (# → %23)
- Ensure Supabase project is active

### Issue: "M-Pesa callback not working"
**Solution:**
- Verify `MPESA_CALLBACK_URL` points to your actual Vercel domain
- Update callback URLs in Safaricom Developer Portal
- Check M-Pesa credentials are correct

### Issue: "CORS errors in browser"
**Solution:**
- Add your Vercel domain to `ALLOWED_ORIGINS`
- Redeploy after updating

### Issue: "JWT_SECRET invalid"
**Solution:**
- Ensure it's at least 64 characters long
- No spaces or special characters that need encoding
- Generate a new one if unsure

---

## 📞 Need Help?

- **Full Deployment Guide:** [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **GitHub Issues:** https://github.com/Langat1999/safiri-afya-ui/issues
- **Email:** info@safiriafya.com

---

**Congratulations!** 🎉

Your healthcare platform should now be live on Vercel!

Visit: `https://YOUR-VERCEL-DOMAIN.vercel.app`
