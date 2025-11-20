# Safiri Afya (Afya Karibu Kenya)

**AI-Powered Healthcare Platform for Kenya** 🇰🇪
![readme img](src/assets/README.jpg)

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://safiriafya.netlify.app)
[![Backend API](https://img.shields.io/badge/API-live-success)](https://safiri-afya.vercel.app/api/health)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Full-stack healthcare platform connecting Kenyans to quality medical services. Features AI symptom checking (bilingual English + Swahili), interactive clinic locator, doctor appointment booking, and M-Pesa payment integration.

**🌐 Live Application:** https://safiriafya.netlify.app
**🔌 Backend API:** https://safiri-afya.vercel.app/api

---

## 🚀 Current Deployment (Split Architecture)

### Architecture
```
┌──────────────────────────────┐
│   Netlify (Frontend)         │
│   React SPA + Vite           │
│   safiriafya.netlify.app     │
└─────────────┬────────────────┘
              │
              │ HTTPS/CORS
              │ API Calls
              ▼
┌──────────────────────────────┐
│   Vercel (Backend API)       │
│   Express.js Serverless      │
│   safiri-afya.vercel.app/api │
└─────────────┬────────────────┘
              │
              │ Prisma ORM
              │ Connection Pooling
              ▼
┌──────────────────────────────┐
│   Supabase (Database)        │
│   PostgreSQL + pgbouncer     │
└──────────────────────────────┘
```

**Benefits:** Global CDN (Netlify Edge), serverless auto-scaling (Vercel), robust database (Supabase), 100% free tier!

### Prerequisites
- GitHub account
- [Netlify account](https://netlify.com/) (free tier: 100GB bandwidth)
- [Vercel account](https://vercel.com/) (free tier: 100GB bandwidth)
- [Supabase account](https://supabase.com/) (free tier: 500MB database)
- M-Pesa sandbox credentials from [Safaricom](https://developer.safaricom.co.ke/)

### Step 1: Create Supabase Database (3 min)

1. Go to https://supabase.com/ → **"New Project"**
2. **Name:** safiri-afya | **Region:** Southeast Asia (Singapore) or EU West (Ireland)
3. Generate strong **database password** (save it!)
4. Go to **Settings → Database** → Copy TWO connection strings:
   - **Session mode (port 6543):** Add `?pgbouncer=true` → Save as `DATABASE_URL`
   - **Transaction mode (port 5432):** Save as `DIRECT_URL`

### Step 2: Deploy Backend on Vercel (5 min)

1. Go to https://vercel.com/new → **"Import Git Repository"**
2. Select `Langat1999/safiri-afya-ui` → Configure as follows:
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** Leave empty (serverless functions)
3. Go to **Settings → Environment Variables** and add:

**Backend Environment Variables:**
```bash
# Database (Required)
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@...pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxxx:[PASSWORD]@...pooler.supabase.com:5432/postgres

# Server Config (Required)
NODE_ENV=production
PORT=3001
JWT_SECRET=your-64-char-secret-min-32-chars

# M-Pesa Integration (Required)
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://your-backend.vercel.app/api/payments/mpesa/callback
MPESA_RESULT_URL=https://your-backend.vercel.app/api/payments/mpesa/result

# CORS & Security (Required - UPDATE AFTER NETLIFY DEPLOYMENT)
ALLOWED_ORIGINS=https://your-frontend.netlify.app
APP_URL=https://your-frontend.netlify.app

# Optional Services
OPENROUTER_API_KEY=your_key        # AI symptom checker
GUARDIAN_API_KEY=your_key          # Health news
SENDGRID_API_KEY=your_key          # Email service
FROM_EMAIL=noreply@safiriafya.com
DEVELOPER_MPESA_NUMBER=254XXXXXXXXX
DEVELOPER_COMMISSION_PERCENTAGE=15
```

4. **Deploy** → Note your Vercel backend URL (e.g., `https://safiri-afya.vercel.app`)

### Step 3: Deploy Frontend on Netlify (4 min)

1. Go to https://app.netlify.com/ → **"Add new site" → "Import an existing project"**
2. Connect to GitHub → Select `Langat1999/safiri-afya-ui`
3. Configure build settings:
   - **Build command:** `npm run build:frontend`
   - **Publish directory:** `dist`
4. Add Environment Variables:
   - `VITE_API_URL` = `https://your-backend.vercel.app/api` (your Vercel backend URL from Step 2)
   - `NODE_VERSION` = `22`
   - `SECRETS_SCAN_OMIT_KEYS` = `VITE_API_URL`
5. **Deploy site** → Note your Netlify URL (e.g., `https://safiriafya.netlify.app`)

### Step 4: Update CORS Settings (2 min)

1. Go back to **Vercel** → Your backend project → **Settings → Environment Variables**
2. Update these variables with your actual Netlify URL:
   - `ALLOWED_ORIGINS` = `https://your-actual-frontend.netlify.app`
   - `APP_URL` = `https://your-actual-frontend.netlify.app`
3. **Deployments → Redeploy** to apply changes

### Step 5: Seed Database (2 min)

```bash
# Local terminal
cd backend
DIRECT_URL="your-supabase-direct-url" npm run seed
```

Adds: 8 clinics + 10 doctors + admin (admin@safiriafya.com / Admin@123456)

### Step 6: Test Your Deployment

```bash
# Test backend API
curl https://your-backend.vercel.app/api/health

# Expected response:
# {"status":"healthy","timestamp":"...","database":"connected"}

# Open frontend
# Visit: https://your-frontend.netlify.app
```

**Done! 🎉** Your healthcare platform is live on split architecture!

📖 **Full Guides:**
- [DEPLOYMENT_GUIDE_SPLIT.md](Documents/DEPLOYMENT_GUIDE_SPLIT.md) - Complete split deployment guide
- [QUICK_DEPLOY_REFERENCE.md](Documents/QUICK_DEPLOY_REFERENCE.md) - Quick reference

---

## 📋 Features

- **AI Symptom Checker** - Bilingual (English/Swahili)
- **Clinic Locator** - Interactive map, nearby search
- **Appointment Booking** - Book doctors instantly
- **M-Pesa Payments** - Secure STK Push integration
- **Admin Dashboard** - Manage bookings, users, revenue
- **Health News** - Curated from WHO, Medical News Today
- **User Profiles** - Appointments, payments, settings

---

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui
**Backend:** Node.js 18 + Express 5 + Vercel Serverless
**Database:** Supabase PostgreSQL (free tier: 500MB)
**Services:** M-Pesa Daraja, SendGrid, OpenRouter AI
**Deploy:** **Netlify** (Frontend) + **Vercel** (Backend API) + **Supabase** (Database) - **100% FREE!**

---

## 💻 Local Development

```bash
# Clone
git clone https://github.com/Langat1999/safiri-afya-ui.git
cd safiri-afya-ui

# Install
npm install
cd backend && npm install

# Configure
cp .env.example .env
cp backend/.env.example backend/.env
# Edit both .env files:
# - .env: VITE_API_URL=http://localhost:3001/api
# - backend/.env: Add your Supabase connection strings

# Setup DB
cd backend
npx prisma migrate dev
npm run seed

# Run (open 2 terminals)
# Terminal 1 - Frontend:
npm run dev          # http://localhost:8080

# Terminal 2 - Backend:
npm run backend:dev  # http://localhost:3001
```

---

## 🗄️ API Endpoints (42+)

- `/api/auth/*` - Authentication (8)
- `/api/clinics/*` - Clinics (4)
- `/api/doctors/*` - Doctors (3)
- `/api/appointments/*` - Appointments (5)
- `/api/symptoms/*` - Symptom checker (2)
- `/api/payments/*` - M-Pesa payments (4)
- `/api/admin/*` - Admin dashboard (15+)
- `/api/health` - Health check

**Frontend Routes:** All non-API routes serve the React SPA
**Backend Routes:** All `/api/*` routes go to Express backend

---

## 🔐 Environment Variables

### Production - Netlify (Frontend)
Add in Netlify Dashboard → Site settings → Environment variables:

```bash
VITE_API_URL=https://your-backend.vercel.app/api
NODE_VERSION=22
SECRETS_SCAN_OMIT_KEYS=VITE_API_URL
```

### Production - Vercel (Backend)
Add in Vercel Dashboard → Settings → Environment Variables:

**Required:**
```bash
# Database
DATABASE_URL=postgresql://...?pgbouncer=true
DIRECT_URL=postgresql://...

# Server Config
NODE_ENV=production
PORT=3001
JWT_SECRET=64-char-secret-min-32-chars

# M-Pesa Integration
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_PASSKEY=...
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://your-backend.vercel.app/api/payments/mpesa/callback
MPESA_RESULT_URL=https://your-backend.vercel.app/api/payments/mpesa/result

# CORS & Security (use your Netlify URL)
ALLOWED_ORIGINS=https://your-frontend.netlify.app
APP_URL=https://your-frontend.netlify.app
```

**Optional (Recommended):**
```bash
OPENROUTER_API_KEY=...      # AI symptom checker
GUARDIAN_API_KEY=...        # Health news
SENDGRID_API_KEY=...        # Email service
FROM_EMAIL=noreply@safiriafya.com
DEVELOPER_MPESA_NUMBER=254XXXXXXXXX
DEVELOPER_COMMISSION_PERCENTAGE=15
```

### Local Development
Create `.env` in project root:
```bash
VITE_API_URL=http://localhost:3001/api
```

Backend already has `backend/.env` with all required variables.

---

## 📚 Project Structure

```
safiri-afya-ui/
├── src/                    # Frontend React app
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities, API client
│   └── assets/           # Images, styles
├── backend/                # Backend Node.js API
│   ├── src/
│   │   ├── server.js      # Main API entry (deployed to Vercel)
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Auth, validation
│   │   ├── services/      # M-Pesa, email, AI
│   │   └── prismadb.js    # Database client
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   ├── migrations/    # Database migrations
│   │   └── seed.js        # Database seeding
│   ├── vercel.json        # Backend Vercel config
│   └── package.json       # Backend dependencies
├── dist/                   # Frontend build output (deployed to Netlify)
├── Documents/              # Project documentation
│   ├── PROJECT_PITCH.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── DEPLOYMENT_GUIDE_SPLIT.md
│   └── QUICK_DEPLOY_REFERENCE.md
├── netlify.toml           # Netlify frontend config
└── package.json           # Frontend dependencies
```

---

## 🚀 Deployment

### Automatic (Recommended)
Push to `main` branch:
- **Netlify** auto-deploys frontend
- **Vercel** auto-deploys backend API

### Manual

**Frontend (Netlify):**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Backend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from backend directory
cd backend
vercel --prod
```

---

## 🔧 Configuration Files

### netlify.toml (Frontend)
```toml
[build]
  command = "npm run build:frontend"
  publish = "dist"

  [build.environment]
    NODE_VERSION = "22"
    SECRETS_SCAN_OMIT_KEYS = "VITE_API_URL"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Routes: All routes → React SPA (client-side routing)

### backend/vercel.json (Backend)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/server.js"
    }
  ]
}
```

Routes: All `/api/*` routes → Express serverless functions

### .env (Frontend - Local)
```bash
VITE_API_URL=http://localhost:3001/api
```

### .env (Frontend - Production/Netlify)
```bash
VITE_API_URL=https://safiri-afya.vercel.app/api
```

---

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Test backend API
npm run backend:dev
curl http://localhost:3001/api/health

# Test database connection
curl http://localhost:3001/api/clinics
```

---

## 📊 Database Schema

**11 Models:**
- User - Authentication & profiles
- Clinic - Healthcare facilities
- Doctor - Medical professionals
- Appointment - Bookings
- Booking - Confirmed visits
- Payment - M-Pesa transactions
- SymptomHistory - AI analysis logs
- PasswordReset - Reset tokens
- AdminLog - Audit trail
- SystemSetting - App configuration

**See:** [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

---

## 🛠️ Troubleshooting

### Frontend (Netlify) Issues

**Build fails with secrets scanning error:**
- Ensure `SECRETS_SCAN_OMIT_KEYS=VITE_API_URL` is set in Netlify environment variables
- VITE_ variables are meant to be public in frontend bundle

**API calls fail (Network errors):**
- Verify `VITE_API_URL` in Netlify points to correct Vercel backend URL
- Example: `https://safiri-afya.vercel.app/api`

### Backend (Vercel) Issues

**API returns 404:**
- Ensure environment variables are set in Vercel
- Check deployment logs for errors
- Verify `backend/vercel.json` configuration

**CORS errors:**
- Update `ALLOWED_ORIGINS` in Vercel to include your Netlify URL
- Example: `https://safiriafya.netlify.app`
- Redeploy backend after updating environment variables

**Database connection errors:**
- Verify `DATABASE_URL` and `DIRECT_URL` in Vercel
- Check Supabase dashboard for connection string format
- Ensure password is URL-encoded (# → %23, @ → %40)

### Build Issues

**Netlify build fails:**
- Check build logs for dependency errors
- Verify `NODE_VERSION=22` is set
- Ensure `npm run build:frontend` script exists

**Vercel build fails:**
- Check Vercel build logs
- Verify `package.json` scripts in backend folder
- Ensure Prisma client generation succeeds

**Full troubleshooting guides:**
- [DEPLOYMENT_GUIDE_SPLIT.md](Documents/DEPLOYMENT_GUIDE_SPLIT.md)
- [QUICK_DEPLOY_REFERENCE.md](Documents/QUICK_DEPLOY_REFERENCE.md)

---

## 💰 Cost (Free Tier)

| Service | Free Tier | Monthly Limit | Usage |
|---------|-----------|---------------|-------|
| **Netlify** | 100GB bandwidth | 300 build minutes | Frontend hosting |
| **Vercel** | 100GB bandwidth | Unlimited requests | Backend API |
| **Supabase** | 500MB database | 2GB bandwidth | PostgreSQL database |
| **Total** | **$0/month** | Supports 10K-50K users | Full-stack app |

---

## 📈 Performance

- **Frontend:** Global CDN (Netlify Edge Network) - Sub-50ms static content
- **Backend:** Serverless functions (Vercel) - Auto-scaling, cold start ~200ms
- **Database:** Connection pooling (pgbouncer) - Optimized for serverless
- **API Response:** < 300ms (cross-origin HTTPS requests)
- **SSL/HTTPS:** Automatic on both Netlify and Vercel

---

## 🔒 Security

- JWT authentication (7-day expiry)
- Password hashing (bcrypt)
- CORS protection
- Input validation (Zod)
- SQL injection prevention (Prisma ORM)
- Environment variable secrets
- HTTPS enforced (Vercel)

---

## 📖 Documentation

### Deployment Guides
- [DEPLOYMENT_GUIDE_SPLIT.md](Documents/DEPLOYMENT_GUIDE_SPLIT.md) - Complete split deployment guide (Netlify + Vercel)
- [QUICK_DEPLOY_REFERENCE.md](Documents/QUICK_DEPLOY_REFERENCE.md) - Quick deployment reference

### Project Documentation
- [PROJECT_PITCH.md](Documents/PROJECT_PITCH.md) - Investor pitch deck & market analysis
- [TECHNICAL_ARCHITECTURE.md](Documents/TECHNICAL_ARCHITECTURE.md) - System architecture documentation

### Technical References
- [backend/prisma/schema.prisma](backend/prisma/schema.prisma) - Database schema
- [netlify.toml](netlify.toml) - Frontend deployment configuration
- [backend/vercel.json](backend/vercel.json) - Backend deployment configuration

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🆘 Support

- **Issues:** https://github.com/Langat1999/safiri-afya-ui/issues
- **Email:** info@safiriafya.com
- **Live Demo:** https://safiriafya.netlify.app
- **API Health:** https://safiri-afya.vercel.app/api/health

---

## 🎯 Production Checklist

Before going live:

**Backend (Vercel):**
- [ ] All environment variables set in Vercel dashboard
- [ ] `ALLOWED_ORIGINS` includes production Netlify URL
- [ ] `MPESA_CALLBACK_URL` points to Vercel backend
- [ ] Database seeded with initial data
- [ ] API health check returns success

**Frontend (Netlify):**
- [ ] `VITE_API_URL` points to production Vercel backend
- [ ] `SECRETS_SCAN_OMIT_KEYS` configured
- [ ] Build completes successfully
- [ ] All pages load correctly

**General:**
- [ ] M-Pesa switched to production mode (not sandbox)
- [ ] Update M-Pesa callback URLs in Safaricom portal
- [ ] Custom domains configured (optional)
- [ ] Database backed up on Supabase
- [ ] SSL/HTTPS enabled (automatic on both platforms)
- [ ] Error tracking configured (Sentry recommended)
- [ ] Test all features end-to-end:
  - [ ] User registration & login
  - [ ] Clinic search & filtering
  - [ ] Appointment booking
  - [ ] M-Pesa payment flow
  - [ ] AI symptom checker
  - [ ] Admin dashboard

---

**Built with ❤️ for Kenya 🇰🇪**

Empowering healthcare access through technology.

