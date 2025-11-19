import express from 'express';
import prisma from '../prismadb.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { validate, createAppointmentSchema } from '../middleware/validation.js';
import emailService from '../services/emailService.js';

const router = express.Router();

router.post('/', authenticateToken, validate(createAppointmentSchema), async (req, res) => {
  try {
    const { doctorId, date, time, reason, name, email, phone } = req.body;

    if (!doctorId || !date || !time || !reason || !name || !email || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date,
        time,
        status: { not: 'CANCELLED' },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        userId: req.user.id,
        doctorId,
        doctorName: doctor.name,
        date,
        time,
        reason,
        status: 'CONFIRMED',
      },
    });

    emailService.sendAppointmentConfirmationEmail(email, {
      patientName: name,
      doctorName: doctor.name,
      date,
      time,
      reason,
    }).catch(err => {
      console.error('Failed to send appointment confirmation email:', err.message);
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userAppointments = await prisma.appointment.findMany({
      where: { userId: req.user.id },
      include: { doctor: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(userAppointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: { doctor: true },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { date, time, reason, status } = req.body;

    const existing = await prisma.appointment.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const updateData = {};
    if (date !== undefined) updateData.date = date;
    if (time !== undefined) updateData.time = time;
    if (reason !== undefined) updateData.reason = reason;
    if (status !== undefined) updateData.status = status.toUpperCase();

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await prisma.appointment.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

export default router;

