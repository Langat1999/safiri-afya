import express from 'express';
import cors from 'cors';

import { config } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiters.js';

import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import clinicsRouter from './routes/clinics.js';
import doctorsRouter from './routes/doctors.js';
import appointmentsRouter from './routes/appointments.js';
import symptomsRouter from './routes/symptoms.js';
import bookingsRouter from './routes/bookings.js';
import paymentsRouter from './routes/payments.js';
import newsRouter from './routes/news.js';
import adminRouter from './routes/admin.js';
import healthRouter from './routes/health.js';

const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (!config.allowedOrigins.includes(origin) && process.env.NODE_ENV === 'production') {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

app.use('/api', generalLimiter);

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/clinics', clinicsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/symptoms', symptomsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/news', newsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/health', healthRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// For local development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`\n🏥 Safiri Afya Backend Server running on http://localhost:${config.port}`);
    console.log(`📊 Health check: http://localhost:${config.port}/api/health\n`);
  });
}

// Export for Vercel serverless
export default app;

