# Safiri Afya Backend API

Backend API for the Safiri Afya healthcare accessibility platform for Kenya.

## Features

- **User Authentication** - Register, login, and profile management with JWT tokens
- **Clinic Management** - Browse, search, and locate nearby clinics
- **Doctor Directory** - View available doctors and their specialties
- **Appointment Booking** - Schedule appointments with healthcare professionals
- **Symptom Analysis** - AI-powered symptom checking with recommendations

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.x
- **Database**: LowDB (JSON-based, file storage)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for frontend integration

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (`.env` file already created):
```env
PORT=3001
JWT_SECRET=<your-secure-jwt-secret>
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3001`

### Development Mode

For auto-restart on file changes:
```bash
npm run dev
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

---

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>

Response:
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2025-01-12T..."
}
```

---

### Clinic Endpoints

#### Get All Clinics
```http
GET /api/clinics

Response:
[
  {
    "id": "1",
    "name": "Nairobi Central Hospital",
    "location": "Nairobi CBD",
    "distance": "2.5 km",
    "rating": 4.5,
    "services": ["General Practice", "Emergency", "Pediatrics"],
    "hours": "24/7",
    "phone": "+254 20 123 4567",
    "coordinates": { "lat": -1.2864, "lng": 36.8172 }
  }
]
```

#### Get Clinic by ID
```http
GET /api/clinics/:id
```

#### Search Clinics
```http
POST /api/clinics/search
Content-Type: application/json

{
  "location": "Nairobi"
}
```

#### Get Nearby Clinics
```http
POST /api/clinics/nearby
Content-Type: application/json

{
  "lat": -1.2864,
  "lng": 36.8172,
  "maxDistance": 10
}
```

---

### Doctor Endpoints

#### Get All Doctors
```http
GET /api/doctors

Response:
[
  {
    "id": "1",
    "name": "Dr. Sarah Kamau",
    "specialty": "General Practice",
    "availability": ["Monday", "Wednesday", "Friday"]
  }
]
```

#### Get Doctor by ID
```http
GET /api/doctors/:id
```

#### Get Doctor Availability
```http
GET /api/doctors/:id/availability

Response:
{
  "availability": ["Monday", "Wednesday", "Friday"]
}
```

---

### Appointment Endpoints

#### Create Appointment
```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctorId": "1",
  "date": "2025-01-15",
  "time": "10:00",
  "reason": "General checkup",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254 712 345 678"
}

Response:
{
  "message": "Appointment booked successfully",
  "appointment": { ... }
}
```

#### Get User Appointments
```http
GET /api/appointments
Authorization: Bearer <token>
```

#### Get Appointment by ID
```http
GET /api/appointments/:id
Authorization: Bearer <token>
```

#### Update Appointment
```http
PUT /api/appointments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-01-16",
  "time": "11:00",
  "reason": "Updated reason"
}
```

#### Cancel Appointment
```http
DELETE /api/appointments/:id
Authorization: Bearer <token>
```

---

### Symptom Checker Endpoints

#### Analyze Symptoms
```http
POST /api/symptoms/analyze
Content-Type: application/json

{
  "symptoms": "I have a headache and fever",
  "userId": "optional_user_id"
}

Response:
{
  "id": "uuid",
  "userId": "anonymous",
  "symptoms": "I have a headache and fever",
  "urgency": "low",
  "condition": "Common Cold or Flu",
  "recommendations": [
    "Rest and stay hydrated",
    "Monitor your symptoms",
    "Take over-the-counter medication if needed"
  ],
  "disclaimer": "This is a preliminary assessment only...",
  "analyzedAt": "2025-01-12T..."
}
```

#### Get Symptom History
```http
GET /api/symptoms/history
Authorization: Bearer <token>
```

---

### Health Check

#### Server Health Status
```http
GET /api/health

Response:
{
  "status": "healthy",
  "message": "Safiri Afya Backend API is running",
  "timestamp": "2025-01-12T..."
}
```

---

## Database

The backend uses **LowDB**, a simple JSON file-based database. Data is stored in `backend/data/db.json`.

### Database Structure
```json
{
  "users": [],
  "clinics": [],
  "doctors": [],
  "appointments": [],
  "symptomHistory": []
}
```

### Data Persistence

- All data is automatically saved to `data/db.json`
- Database is initialized with sample clinics and doctors on first run
- To reset the database, delete `data/db.json` and restart the server

---

## Security

- Passwords are hashed using bcryptjs (10 salt rounds)
- JWT tokens expire after 7 days
- Protected routes require valid JWT token in Authorization header
- CORS is enabled for frontend integration

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Future Improvements

- [ ] Integrate real AI/ML model for symptom analysis
- [ ] Add email notifications for appointment confirmations
- [ ] Implement SMS notifications (Twilio/Africa's Talking)
- [ ] Add payment processing for paid services
- [ ] Migrate to PostgreSQL/MongoDB for production
- [ ] Add admin dashboard endpoints
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up automated testing
- [ ] Add API documentation with Swagger/OpenAPI

---

## License

MIT

---

## Support

For issues or questions, please open an issue on GitHub.
