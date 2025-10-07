const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' })); // Reduced from 10mb for security

// Input sanitization middleware
app.use((req, res, next) => {
  if (req.body) {
    // Remove any potentially dangerous characters from string inputs
    const sanitize = (obj) => {
      if (typeof obj === 'string') {
        return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  .trim()
                  .slice(0, 1000); // Limit string length
      }
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
          obj[key] = sanitize(obj[key]);
        });
      }
      return obj;
    };
    req.body = sanitize(req.body);
  }
  next();
});

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Terlalu banyak percobaan login, silakan coba lagi nanti.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Terlalu banyak permintaan, silakan coba lagi nanti.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        score INTEGER NOT NULL,
        genetic_score INTEGER DEFAULT 0,
        lifestyle_score INTEGER NOT NULL,
        risk_level VARCHAR(50) NOT NULL,
        answers JSONB NOT NULL,
        user_info JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initDatabase();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Helper function to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Security logging middleware
const logSecurityEvent = (req, type, details) => {
  console.log(`[SECURITY] ${new Date().toISOString()} - ${type} - IP: ${req.ip} - ${details}`);
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'D-FENSE API is running' });
});

// Sign up
app.post('/api/auth/signup', authLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      logSecurityEvent(req, 'SIGNUP_FAILED', 'Missing required fields');
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    // Validate name
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Nama harus antara 2-100 karakter' });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      logSecurityEvent(req, 'SIGNUP_FAILED', 'Invalid email format');
      return res.status(400).json({ error: 'Format email tidak valid' });
    }

    if (email.length > 255) {
      return res.status(400).json({ error: 'Email terlalu panjang' });
    }

    // Validate password
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: 'Password harus antara 8-128 karakter' });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({ error: 'Password harus mengandung huruf kecil, huruf besar, dan angka' });
    }

    // Check for common weak passwords
    const weakPasswords = ['password', '12345678', 'qwerty123', 'admin123'];
    if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
      return res.status(400).json({ error: 'Password terlalu lemah' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      logSecurityEvent(req, 'SIGNUP_FAILED', 'Email already exists');
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password with higher salt rounds for better security
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email.toLowerCase(), passwordHash, name]
    );

    const user = result.rows[0];
    const tokens = generateTokens(user.id);

    logSecurityEvent(req, 'SIGNUP_SUCCESS', `User created: ${user.email}`);

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at
      },
      ...tokens
    });
  } catch (error) {
    console.error('Signup error:', error);
    logSecurityEvent(req, 'SIGNUP_ERROR', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan internal' });
  }
});

// Sign in
app.post('/api/auth/signin', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logSecurityEvent(req, 'SIGNIN_FAILED', 'Missing credentials');
      return res.status(400).json({ error: 'Email dan password harus diisi' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      logSecurityEvent(req, 'SIGNIN_FAILED', 'Invalid email format');
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, name, password_hash, created_at FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      logSecurityEvent(req, 'SIGNIN_FAILED', `User not found: ${email}`);
      // Don't reveal if user exists or not
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      logSecurityEvent(req, 'SIGNIN_FAILED', `Invalid password for: ${email}`);
      // Don't reveal which field is incorrect
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const tokens = generateTokens(user.id);

    logSecurityEvent(req, 'SIGNIN_SUCCESS', `User logged in: ${user.email}`);

    res.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at
      },
      ...tokens
    });
  } catch (error) {
    console.error('Signin error:', error);
    logSecurityEvent(req, 'SIGNIN_ERROR', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan internal' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      createdAt: req.user.created_at
    }
  });
});

// Sign out
app.post('/api/auth/signout', authenticateToken, (req, res) => {
  // In a production app, you might want to blacklist the token
  res.json({ message: 'Signed out successfully' });
});

// Reset password request
app.post('/api/auth/reset-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: result.rows[0].id, purpose: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Save reset token to database
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [resetToken, resetTokenExpires, result.rows[0].id]
    );

    // In a real app, send email here
    // For demo, just log the reset link
    console.log(`Reset password link: ${process.env.CLIENT_URL}/reset-password?token=${resetToken}`);

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save assessment result
app.post('/api/assessments', apiLimiter, authenticateToken, async (req, res) => {
  try {
    const { score, geneticScore, lifestyleScore, answers, userInfo } = req.body;

    // Validate input
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ error: 'Skor tidak valid' });
    }

    if (typeof geneticScore !== 'number' || geneticScore < 0 || geneticScore > 60) {
      return res.status(400).json({ error: 'Skor genetik tidak valid' });
    }

    if (typeof lifestyleScore !== 'number' || lifestyleScore < 0 || lifestyleScore > 46) {
      return res.status(400).json({ error: 'Skor gaya hidup tidak valid' });
    }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Data jawaban tidak valid' });
    }

    if (!userInfo || typeof userInfo !== 'object') {
      return res.status(400).json({ error: 'Data pengguna tidak valid' });
    }

    // Determine risk level
    let riskLevel = 'low';
    if (score > 39) riskLevel = 'high';
    else if (score > 20) riskLevel = 'medium';

    const result = await pool.query(
      'INSERT INTO assessments (user_id, score, genetic_score, lifestyle_score, risk_level, answers, user_info) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at',
      [req.user.id, score, geneticScore, lifestyleScore, riskLevel, JSON.stringify(answers), JSON.stringify(userInfo)]
    );

    logSecurityEvent(req, 'ASSESSMENT_SAVED', `User ${req.user.email} saved assessment`);

    res.status(201).json({
      message: 'Assessment berhasil disimpan',
      assessmentId: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    console.error('Save assessment error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal' });
  }
});

// Get user assessments
app.get('/api/assessments', apiLimiter, authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    // Validate limits to prevent abuse
    if (limit > 100 || limit < 1) {
      return res.status(400).json({ error: 'Limit harus antara 1-100' });
    }

    if (offset < 0) {
      return res.status(400).json({ error: 'Offset tidak valid' });
    }

    const result = await pool.query(
      'SELECT id, score, genetic_score, lifestyle_score, risk_level, created_at FROM assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [req.user.id, limit, offset]
    );

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM assessments WHERE user_id = $1',
      [req.user.id]
    );

    res.json({ 
      assessments: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Daily statistics endpoint
app.get('/api/assessments/statistics', apiLimiter, authenticateToken, async (req, res) => {
  try {
    // Get user's assessment statistics
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_assessments,
        AVG(score) as average_score,
        MIN(score) as lowest_score,
        MAX(score) as highest_score,
        MIN(created_at) as first_assessment,
        MAX(created_at) as last_assessment
      FROM assessments 
      WHERE user_id = $1
    `, [req.user.id]);

    // Get risk level distribution
    const distribution = await pool.query(`
      SELECT risk_level, COUNT(*) as count
      FROM assessments
      WHERE user_id = $1
      GROUP BY risk_level
    `, [req.user.id]);

    // Get monthly progress
    const monthlyProgress = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        AVG(score) as avg_score,
        COUNT(*) as count
      FROM assessments
      WHERE user_id = $1 AND created_at > NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `, [req.user.id]);

    res.json({
      statistics: stats.rows[0],
      riskDistribution: distribution.rows,
      monthlyProgress: monthlyProgress.rows
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  logSecurityEvent(req, 'UNHANDLED_ERROR', error.message);
  res.status(500).json({ error: 'Terjadi kesalahan internal' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

app.listen(PORT, () => {
  console.log(`🛡️  D-FENSE API server running on port ${PORT}`);
  console.log(`🔒 Security features: Helmet, CORS, Rate Limiting, Input Sanitization`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;