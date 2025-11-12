import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db, { initializeDatabase } from './database.js';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'safiri-afya-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Create data directory
await mkdir(join(__dirname, '../data'), { recursive: true });

// Initialize database
await initializeDatabase();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============= AUTHENTICATION ENDPOINTS =============

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    await db.read();

    // Check if user already exists
    const existingUser = db.data.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newUser);
    await db.write();

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    await db.read();

    // Find user
    const user = db.data.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// ============= CLINIC ENDPOINTS =============

// Get all clinics
app.get('/api/clinics', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.clinics);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get clinic by ID
app.get('/api/clinics/:id', async (req, res) => {
  try {
    await db.read();
    const clinic = db.data.clinics.find(c => c.id === req.params.id);

    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }

    res.json(clinic);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Search clinics by location
app.post('/api/clinics/search', async (req, res) => {
  try {
    const { location } = req.body;
    await db.read();

    if (!location) {
      return res.json(db.data.clinics);
    }

    const filtered = db.data.clinics.filter(clinic =>
      clinic.location.toLowerCase().includes(location.toLowerCase()) ||
      clinic.name.toLowerCase().includes(location.toLowerCase())
    );

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get nearby clinics (simplified - in production, use geospatial queries)
app.post('/api/clinics/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10 } = req.body;
    await db.read();

    // Simple distance calculation (for production, use proper geospatial library)
    const clinics = db.data.clinics.map(clinic => {
      const distance = Math.sqrt(
        Math.pow(clinic.coordinates.lat - lat, 2) +
        Math.pow(clinic.coordinates.lng - lng, 2)
      ) * 111; // Rough conversion to km

      return { ...clinic, calculatedDistance: distance.toFixed(1) + ' km' };
    })
    .filter(clinic => parseFloat(clinic.calculatedDistance) <= maxDistance)
    .sort((a, b) => parseFloat(a.calculatedDistance) - parseFloat(b.calculatedDistance));

    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// ============= DOCTOR ENDPOINTS =============

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.doctors);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get doctor by ID
app.get('/api/doctors/:id', async (req, res) => {
  try {
    await db.read();
    const doctor = db.data.doctors.find(d => d.id === req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get doctor availability
app.get('/api/doctors/:id/availability', async (req, res) => {
  try {
    await db.read();
    const doctor = db.data.doctors.find(d => d.id === req.params.id);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ availability: doctor.availability });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// ============= APPOINTMENT ENDPOINTS =============

// Create appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { doctorId, date, time, reason, name, email, phone } = req.body;

    if (!doctorId || !date || !time || !reason || !name || !email || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await db.read();

    // Verify doctor exists
    const doctor = db.data.doctors.find(d => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check for existing appointment at same time
    const existingAppointment = db.data.appointments.find(
      a => a.doctorId === doctorId && a.date === date && a.time === time && a.status !== 'cancelled'
    );

    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    const newAppointment = {
      id: uuidv4(),
      userId: req.user.id,
      doctorId,
      doctorName: doctor.name,
      date,
      time,
      reason,
      name,
      email,
      phone,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    db.data.appointments.push(newAppointment);
    await db.write();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get user appointments
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    await db.read();
    const userAppointments = db.data.appointments.filter(a => a.userId === req.user.id);
    res.json(userAppointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get appointment by ID
app.get('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    await db.read();
    const appointment = db.data.appointments.find(a => a.id === req.params.id && a.userId === req.user.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Update appointment
app.put('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { date, time, reason, status } = req.body;
    await db.read();

    const appointmentIndex = db.data.appointments.findIndex(
      a => a.id === req.params.id && a.userId === req.user.id
    );

    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = db.data.appointments[appointmentIndex];

    // Update fields
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;
    if (status) appointment.status = status;
    appointment.updatedAt = new Date().toISOString();

    await db.write();

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Cancel appointment
app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    await db.read();

    const appointmentIndex = db.data.appointments.findIndex(
      a => a.id === req.params.id && a.userId === req.user.id
    );

    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Soft delete by updating status
    db.data.appointments[appointmentIndex].status = 'cancelled';
    db.data.appointments[appointmentIndex].cancelledAt = new Date().toISOString();

    await db.write();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// ============= SYMPTOM CHECKER ENDPOINT =============

// Analyze symptoms
app.post('/api/symptoms/analyze', async (req, res) => {
  try {
    const { symptoms, userId } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms description is required' });
    }

    await db.read();

    // Simple keyword-based analysis (In production, integrate with AI/ML model)
    let urgency = 'low';
    let condition = 'Common Cold or Flu';
    let recommendations = [
      'Rest and stay hydrated',
      'Monitor your symptoms',
      'Take over-the-counter medication if needed'
    ];

    const symptomsLower = symptoms.toLowerCase();

    // High urgency keywords
    if (symptomsLower.includes('chest pain') ||
        symptomsLower.includes('difficulty breathing') ||
        symptomsLower.includes('severe bleeding') ||
        symptomsLower.includes('unconscious') ||
        symptomsLower.includes('stroke')) {
      urgency = 'high';
      condition = 'Potentially Serious Condition';
      recommendations = [
        'Seek immediate medical attention',
        'Call emergency services or go to the nearest hospital',
        'Do not delay treatment'
      ];
    }
    // Medium urgency keywords
    else if (symptomsLower.includes('high fever') ||
             symptomsLower.includes('persistent pain') ||
             symptomsLower.includes('vomiting') ||
             symptomsLower.includes('diarrhea') ||
             symptomsLower.includes('rash')) {
      urgency = 'medium';
      condition = 'Moderate Condition Requiring Attention';
      recommendations = [
        'Schedule an appointment with a healthcare provider',
        'Monitor symptoms closely',
        'Seek care within 24-48 hours',
        'Keep a symptom diary'
      ];
    }

    const analysis = {
      id: uuidv4(),
      userId: userId || 'anonymous',
      symptoms,
      urgency,
      condition,
      recommendations,
      disclaimer: 'This is a preliminary assessment only. Always consult with a healthcare professional for proper diagnosis and treatment.',
      analyzedAt: new Date().toISOString()
    };

    // Save to history
    db.data.symptomHistory.push(analysis);
    await db.write();

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get symptom history
app.get('/api/symptoms/history', authenticateToken, async (req, res) => {
  try {
    await db.read();
    const history = db.data.symptomHistory.filter(s => s.userId === req.user.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// ============= HEALTH CHECK =============

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Safiri Afya Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🏥 Safiri Afya Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});
