import express from 'express';
import prisma from '../prismadb.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Safiri Afya Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

router.get('/status', async (req, res) => {
  const status = {
    database: 'unknown',
    timestamp: new Date().toISOString(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    status.database = 'connected';
    res.json({ status: 'ok', details: status });
  } catch (error) {
    status.database = 'error';
    res.status(503).json({
      status: 'degraded',
      details: status,
      error: error.message,
    });
  }
});

export default router;

