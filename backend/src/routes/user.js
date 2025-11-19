import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prismadb.js';
import authenticateToken from '../middleware/authenticateToken.js';
import {
  validate,
  updateProfileSchema,
  changePasswordSchema,
  updateSettingsSchema,
  deleteAccountSchema,
} from '../middleware/validation.js';

const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { appointments: true, symptomHistory: true, bookings: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      location: user.location || '',
      profilePicture: user.profilePicture || '',
      role: user.role || 'USER',
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      stats: {
        totalAppointments: user.appointments.length,
        totalSymptomChecks: user.symptomHistory.length,
        totalBookings: user.bookings.length,
        accountAge: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.put('/profile', authenticateToken, validate(updateProfileSchema), async (req, res) => {
  try {
    const { name, phone, dateOfBirth, gender, location, profilePicture } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (location !== undefined) updateData.location = location;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        location: user.location,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.put('/change-password', authenticateToken, validate(changePasswordSchema), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        dataSharing: true,
        language: true,
        theme: true,
        timezone: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      settings: {
        notifications: {
          email: user.emailNotifications,
          sms: user.smsNotifications,
          push: user.pushNotifications,
        },
        privacy: {
          dataSharing: user.dataSharing,
        },
        preferences: {
          language: user.language,
          theme: user.theme,
          timezone: user.timezone,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.put('/settings', authenticateToken, validate(updateSettingsSchema), async (req, res) => {
  try {
    const { notifications, privacy, preferences } = req.body;
    const updateData = {};

    if (notifications) {
      if (notifications.email !== undefined) updateData.emailNotifications = notifications.email;
      if (notifications.sms !== undefined) updateData.smsNotifications = notifications.sms;
      if (notifications.push !== undefined) updateData.pushNotifications = notifications.push;
    }

    if (privacy && privacy.dataSharing !== undefined) {
      updateData.dataSharing = privacy.dataSharing;
    }

    if (preferences) {
      if (preferences.language !== undefined) updateData.language = preferences.language;
      if (preferences.theme !== undefined) updateData.theme = preferences.theme;
      if (preferences.timezone !== undefined) updateData.timezone = preferences.timezone;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        dataSharing: true,
        language: true,
        theme: true,
        timezone: true,
      },
    });

    res.json({
      message: 'Settings updated successfully',
      settings: {
        notifications: {
          email: user.emailNotifications,
          sms: user.smsNotifications,
          push: user.pushNotifications,
        },
        privacy: {
          dataSharing: user.dataSharing,
        },
        preferences: {
          language: user.language,
          theme: user.theme,
          timezone: user.timezone,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.delete('/account', authenticateToken, validate(deleteAccountSchema), async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    await prisma.user.delete({ where: { id: user.id } });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

export default router;

