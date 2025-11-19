import express from 'express';
import prisma, { parseClinics, parseClinicServices } from '../prismadb.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const clinics = await prisma.clinic.findMany();
    res.json(parseClinics(clinics));
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const clinic = await prisma.clinic.findUnique({ where: { id: req.params.id } });
    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }
    res.json(parseClinicServices(clinic));
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.post('/search', async (req, res) => {
  try {
    const { location } = req.body;
    if (!location) {
      const clinics = await prisma.clinic.findMany();
      return res.json(parseClinics(clinics));
    }

    const filtered = await prisma.clinic.findMany({
      where: {
        OR: [
          { location: { contains: location, mode: 'insensitive' } },
          { name: { contains: location, mode: 'insensitive' } },
        ],
      },
    });

    res.json(parseClinics(filtered));
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.post('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10 } = req.body;
    const allClinics = await prisma.clinic.findMany();
    const clinics = parseClinics(allClinics)
      .map(clinic => {
        const distance = Math.sqrt(
          Math.pow(clinic.latitude - lat, 2) +
          Math.pow(clinic.longitude - lng, 2),
        ) * 111;

        return { ...clinic, calculatedDistance: `${distance.toFixed(1)} km` };
      })
      .filter(clinic => parseFloat(clinic.calculatedDistance) <= maxDistance)
      .sort((a, b) => parseFloat(a.calculatedDistance) - parseFloat(b.calculatedDistance));

    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

export default router;

