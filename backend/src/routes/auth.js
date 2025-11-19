import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismadb.js';
import emailService from '../services/emailService.js';
import authenticateToken from '../middleware/authenticateToken.js';
import {
  validate,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
} from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'safiri-afya-secret-key-change-in-production';

router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
        isActive: true,
      },
    });

    emailService.sendWelcomeEmail(email, name).catch(err => {
      console.error('Failed to send welcome email:', err.message);
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.json({ message: 'Token refreshed successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: 'If the email exists, a reset code has been sent.' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = new Date(Date.now() + 3600000);

    await prisma.passwordReset.deleteMany({ where: { email } });
    await prisma.passwordReset.create({
      data: {
        email,
        code: resetCode,
        expiresAt: resetExpiry,
      },
    });

    emailService.sendPasswordResetEmail(email, user.name, resetCode).catch(err => {
      console.error('Failed to send password reset email:', err.message);
    });

    console.log(`[DEV] Password reset code for ${email}: ${resetCode}`);

    res.json({
      message: 'If the email exists, a reset code has been sent. Please check your email.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.post('/verify-reset-code', authLimiter, validate(verifyResetCodeSchema), async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const resetRequest = await prisma.passwordReset.findFirst({ where: { email, code } });
    if (!resetRequest) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    if (new Date() > new Date(resetRequest.expiresAt)) {
      return res.status(400).json({ error: 'Reset code has expired' });
    }

    res.json({ message: 'Code verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.post('/reset-password', authLimiter, validate(resetPasswordSchema), async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, code, and new password are required' });
    }

    const resetRequest = await prisma.passwordReset.findFirst({ where: { email, code } });
    if (!resetRequest) {
      return res.status(400).json({ error: 'Invalid reset code' });
    }

    if (new Date() > new Date(resetRequest.expiresAt)) {
      return res.status(400).json({ error: 'Reset code has expired' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.delete({ where: { id: resetRequest.id } });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

export default router;

