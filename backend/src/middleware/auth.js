import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'safiri-afya-secret-key-change-in-production';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = {
      id: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  });
};

export const signToken = (payload, options = {}) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', ...options });
};

