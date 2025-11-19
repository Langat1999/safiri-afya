import express from 'express';
import prisma from '../prismadb.js';
import { validate, createBookingSchema } from '../middleware/validation.js';
import emailService from '../services/emailService.js';

const router = express.Router();

router.post('/', validate(createBookingSchema), async (req, res) => {
  try {
    const {
      facilityId,
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      symptoms,
    } = req.body;

    if (!facilityId || !patientName || !patientPhone || !appointmentDate || !appointmentTime || !symptoms) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const facility = await prisma.clinic.findUnique({ where: { id: facilityId } });

    const booking = await prisma.booking.create({
      data: {
        facilityId,
        facilityName: facility?.name || 'Unknown Facility',
        patientName,
        patientEmail: patientEmail || null,
        patientPhone,
        appointmentDate,
        appointmentTime,
        symptoms,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        consultationFee: facility?.consultationFee || 1000,
      },
    });

    if (patientEmail) {
      emailService.sendBookingConfirmationEmail(patientEmail, {
        id: booking.id,
        facilityName: booking.facilityName,
        patientName,
        date: appointmentDate,
        time: appointmentTime,
        amount: booking.consultationFee,
      }).catch(err => {
        console.error('Failed to send booking confirmation email:', err.message);
      });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

export default router;

