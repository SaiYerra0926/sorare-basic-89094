import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/config.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user by username or email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE (username = $1 OR email = $1) AND is_active = TRUE',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];

    // Check if password is bcrypt hash ($2a$, $2b$, or $2y$) or plain text
    let isValidPassword = false;
    
    if (user.password_hash.startsWith('$2a$') || 
        user.password_hash.startsWith('$2b$') || 
        user.password_hash.startsWith('$2y$')) {
      // Bcrypt hash (all variants)
      isValidPassword = await bcrypt.compare(password, user.password_hash);
    } else {
      // Plain text fallback for initial setup
      isValidPassword = password === user.password_hash;
    }

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Get user permissions
    const permissionsResult = await pool.query(
      'SELECT * FROM permissions WHERE user_id = $1',
      [user.id]
    );

    const permissions = permissionsResult.rows[0] || {
      can_access_billing: user.role === 'admin',
      can_access_dashboard: true,
      can_access_forms: true,
      can_access_reports: user.role === 'admin',
      can_manage_users: user.role === 'admin'
    };

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
          permissions
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = TRUE',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    const user = userResult.rows[0];

    // Get permissions
    const permissionsResult = await pool.query(
      'SELECT * FROM permissions WHERE user_id = $1',
      [user.id]
    );

    const permissions = permissionsResult.rows[0] || {
      can_access_billing: user.role === 'admin',
      can_access_dashboard: true,
      can_access_forms: true,
      can_access_reports: user.role === 'admin',
      can_manage_users: user.role === 'admin'
    };

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          fullName: user.full_name,
          permissions
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

export default router;

