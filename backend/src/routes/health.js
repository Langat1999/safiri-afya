import express from 'express';
import prisma from '../prismadb.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoints
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Safiri Afya Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /health/status:
 *   get:
 *     summary: Detailed system status check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System status including database connection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 database:
 *                   type: string
 *                   example: connected
 *       503:
 *         description: System unavailable
 */
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
