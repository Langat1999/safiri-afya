import express from 'express';
import prisma, { parseDoctors, parseDoctorAvailability } from '../prismadb.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    res.json(parseDoctors(doctors));
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: req.params.id } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(parseDoctorAvailability(doctor));
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      select: { availability: true },
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const availability = typeof doctor.availability === 'string'
      ? JSON.parse(doctor.availability)
      : doctor.availability;

    res.json({ availability });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

export default router;

