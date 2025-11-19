import express from 'express';
import prisma, {
  parseClinics,
  parseClinicServices,
  parseDoctors,
  prepareClinicForDB,
} from '../prismadb.js';
import { requireAdmin, requireSuperAdmin, logAdminActivity } from '../middleware/adminAuth.js';
import { validate, updateUserSchema, createClinicSchema } from '../middleware/validation.js';

const router = express.Router();

router.get('/dashboard/stats', requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalAppointments,
      totalBookings,
      totalClinics,
      totalDoctors,
      paymentsAggregate,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } }),
      prisma.appointment.count(),
      prisma.booking.count(),
      prisma.clinic.count(),
      prisma.doctor.count(),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.adminLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalAppointments,
        totalBookings,
        totalClinics,
        totalDoctors,
        totalRevenue: paymentsAggregate._sum.amount || 0,
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/users/:id', requireAdmin, validate(updateUserSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role.toUpperCase().replace('-', '_');
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    await logAdminActivity(req.user.id, 'UPDATE_USER', {
      targetUserId: id,
      changes: { name, email, role, isActive },
    });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (id === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({ where: { id } });
    await logAdminActivity(req.user.id, 'DELETE_USER', {
      targetUserId: id,
      email: user.email,
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/appointments', requireAdmin, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { user: { select: { name: true, email: true } }, doctor: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/bookings', requireAdmin, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/payments', requireAdmin, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { booking: { select: { facilityName: true, patientName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/clinics', requireAdmin, async (req, res) => {
  try {
    const clinics = await prisma.clinic.findMany();
    res.json({ success: true, clinics: parseClinics(clinics) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/clinics', requireAdmin, validate(createClinicSchema), async (req, res) => {
  try {
    const newClinic = await prisma.clinic.create({
      data: prepareClinicForDB(req.body),
    });

    await logAdminActivity(req.user.id, 'CREATE_CLINIC', { clinicId: newClinic.id });
    res.json({ success: true, clinic: parseClinicServices(newClinic) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/clinics/:id', requireAdmin, async (req, res) => {
  try {
    const clinic = await prisma.clinic.update({
      where: { id: req.params.id },
      data: prepareClinicForDB(req.body),
    });

    await logAdminActivity(req.user.id, 'UPDATE_CLINIC', { clinicId: req.params.id });
    res.json({ success: true, clinic: parseClinicServices(clinic) });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/clinics/:id', requireSuperAdmin, async (req, res) => {
  try {
    await prisma.clinic.delete({ where: { id: req.params.id } });
    await logAdminActivity(req.user.id, 'DELETE_CLINIC', { clinicId: req.params.id });
    res.json({ success: true, message: 'Clinic deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/doctors', requireAdmin, async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.json({ success: true, doctors: parseDoctors(doctors) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/settings', requireAdmin, async (req, res) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    res.json({ success: true, settings: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/settings', requireSuperAdmin, async (req, res) => {
  try {
    const updates = Object.entries(req.body).map(([key, value]) =>
      prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    );

    await Promise.all(updates);
    await logAdminActivity(req.user.id, 'UPDATE_SETTINGS', { settings: req.body });

    const settings = await prisma.systemSetting.findMany();
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    res.json({ success: true, settings: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/logs', requireAdmin, async (req, res) => {
  try {
    const logs = await prisma.adminLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/symptom-analytics', requireAdmin, async (req, res) => {
  try {
    const [totalChecks, lowRisk, mediumRisk, highRisk, recentChecks] = await Promise.all([
      prisma.symptomHistory.count(),
      prisma.symptomHistory.count({ where: { riskLevel: 'low' } }),
      prisma.symptomHistory.count({ where: { riskLevel: 'medium' } }),
      prisma.symptomHistory.count({ where: { riskLevel: 'high' } }),
      prisma.symptomHistory.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      analytics: {
        totalChecks,
        byRiskLevel: {
          low: lowRisk,
          medium: mediumRisk,
          high: highRisk,
        },
        recentChecks,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

