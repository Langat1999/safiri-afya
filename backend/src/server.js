import express from 'express';
import cors from 'cors';

import { config } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiters.js';
import logger from './utils/logger.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';

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

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      message: 'API Request',
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`
    });
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

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use((req, res) => {
  logger.warn(`Endpoint not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({
    message: 'Unhandled Error',
    error: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });
  res.status(500).json({ error: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(config.port, () => {
    logger.info(`🏥 Safiri Afya Backend Server running on http://localhost:${config.port}`);
    logger.info(`📊 Health check: http://localhost:${config.port}/api/health`);
  });
}

// Export for Vercel serverless
export default app;
