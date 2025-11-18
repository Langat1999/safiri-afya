# Safiri Afya (Afya Karibu Kenya)

**AI-Powered Healthcare Platform for Kenya**

Full-stack healthcare platform connecting Kenyans to quality medical services. Features AI symptom checking (English + Swahili), clinic locator, appointment booking, and M-Pesa payments.

---

## 🚀 Quick Deploy (15 Minutes)

### Prerequisites
- GitHub account
- [Render account](https://render.com/) (free tier works)
- M-Pesa sandbox credentials from [Safaricom](https://developer.safaricom.co.ke/)

### Step 1: Deploy Backend (10 min)

1. Go to https://dashboard.render.com/
2. Click **"New +" → "Blueprint"**
3. Connect repository: `Langat1999/safiri-afya-ui`
4. Click **"Apply"** (creates database + backend)

### Step 2: Add Environment Variables (2 min)

In Render → Your service → Environment tab:

```bash
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379
MPESA_ENVIRONMENT=sandbox
MPESA_CALLBACK_URL=https://safiri-afya-api.onrender.com/api/payments/mpesa/callback
MPESA_RESULT_URL=https://safiri-afya-api.onrender.com/api/payments/mpesa/result
DEVELOPER_MPESA_NUMBER=254713809220
DEVELOPER_COMMISSION_PERCENTAGE=15
OPENROUTER_API_KEY=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
GUARDIAN_API_KEY=7dbc521f-3149-4416-b103-de0ff728e4ce
FROM_EMAIL=noreply@safiriafya.com
ALLOWED_ORIGINS=https://your-netlify-url.netlify.app
```

### Step 3: Seed Database (1 min)

In Render Shell:
```bash
cd backend
npm run seed
```

Adds: 8 clinics + 10 doctors + admin (admin@safiriafya.com / Admin@123456)

### Step 4: Connect Frontend

On Netlify → Environment variables:
```
VITE_API_URL=https://safiri-afya-api.onrender.com/api
```

Then trigger deploy.

**Done!** 🎉

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
**Backend:** Node.js 18 + Express 5 + PostgreSQL + Prisma ORM
**Services:** M-Pesa Daraja, SendGrid, OpenRouter AI
**Deploy:** Render (backend) + Netlify (frontend)

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
# Edit both .env files

# Setup DB
cd backend
npx prisma migrate dev
npm run seed

# Run
npm run dev          # Frontend: http://localhost:5173
cd backend && npm run dev  # Backend: http://localhost:3001
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

---

## 🔐 Environment Variables

### Backend Required
```bash
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=3001
JWT_SECRET=64-char-secret
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_PASSKEY=...
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://...
ALLOWED_ORIGINS=https://...
```

### Frontend
```bash
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📁 Project Structure

```
├── src/              # React frontend
├── backend/          # Node.js backend
│   ├── src/
│   │   ├── server.js      # 42+ API endpoints
│   │   ├── seed.js        # Database seeding
│   │   ├── middleware/    # Auth, validation
│   │   └── services/      # M-Pesa, email
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── migrations/    # DB migrations
├── render.yaml       # Render deployment
└── package.json      # Dependencies
```

---

## 🚢 Deployment

**Render (Backend):**
- Use Blueprint (automatic)
- Or manual: PostgreSQL + Web Service
- Build: `npm install && npm run build`
- Start: `npm run deploy`

**Netlify (Frontend):**
- Auto-deploy from GitHub
- Build: `npm run build`
- Publish: `dist/`

---

## 📊 Database

**13 Models:** User, Clinic, Doctor, Appointment, Booking, Payment, SymptomHistory, PasswordReset, AdminLog, SystemSetting, etc.

**Seed Data:**
- 8 Nairobi clinics (Aga Khan, Kenyatta, Mater, etc.)
- 10 doctors (GP, Pediatrics, Cardiology, etc.)
- 1 admin user

---

## 🔒 Security

- JWT authentication (7-day expiry)
- bcrypt password hashing
- Rate limiting (5-100 req/15min)
- CORS whitelist
- Input validation (Zod)
- Prisma ORM (SQL injection prevention)

---

## 🎯 Roadmap

**Phase 1 (Done ✅):**
Authentication, AI symptom checker, clinic locator, booking, M-Pesa, admin dashboard

**Phase 2 (Next 3mo):**
Mobile apps, telemedicine, pharmacy, NHIF insurance, notifications

**Phase 3 (6-12mo):**
Health records, lab tests, prescriptions, regional expansion

---

## 🤝 Contributing

1. Fork repo
2. Create feature branch
3. Commit changes
4. Push and open PR

---

## 📝 License

MIT License

---

## 📞 Support

- GitHub Issues
- Email: info@safiriafya.com

---

**Made with ❤️ in Kenya**

🚀 Deploy now: https://dashboard.render.com/
