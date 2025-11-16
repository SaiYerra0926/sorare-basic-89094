import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../database/config.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        u.id, u.username, u.email, u.role, u.full_name, u.is_active, 
        u.created_at, u.updated_at, u.last_login,
        p.can_access_billing, p.can_access_dashboard, p.can_access_forms,
        p.can_access_reports, p.can_manage_users
      FROM users u
      LEFT JOIN permissions p ON u.id = p.user_id
      ORDER BY u.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Get single user
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      `SELECT 
        u.id, u.username, u.email, u.role, u.full_name, u.is_active,
        u.created_at, u.updated_at, u.last_login,
        p.can_access_billing, p.can_access_dashboard, p.can_access_forms,
        p.can_access_reports, p.can_manage_users
      FROM users u
      LEFT JOIN permissions p ON u.id = p.user_id
      WHERE u.id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: userResult.rows[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// Create new user (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role, fullName, permissions } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Check if username or email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const userResult = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, full_name, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, role, full_name, is_active, created_at`,
      [username, email, passwordHash, role || 'user', fullName || null, true]
    );

    const newUser = userResult.rows[0];

    // Insert permissions
    const permData = permissions || {
      can_access_billing: role === 'admin',
      can_access_dashboard: true,
      can_access_forms: true,
      can_access_reports: role === 'admin',
      can_manage_users: role === 'admin'
    };

    await pool.query(
      `INSERT INTO permissions 
       (user_id, can_access_billing, can_access_dashboard, can_access_forms, 
        can_access_reports, can_manage_users)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        newUser.id,
        permData.can_access_billing || false,
        permData.can_access_dashboard !== undefined ? permData.can_access_dashboard : true,
        permData.can_access_forms !== undefined ? permData.can_access_forms : true,
        permData.can_access_reports || false,
        permData.can_manage_users || false
      ]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, fullName, isActive, permissions } = req.body;

    // Check if user exists
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (username) {
      updateFields.push(`username = $${paramCount++}`);
      updateValues.push(username);
    }
    if (email) {
      updateFields.push(`email = $${paramCount++}`);
      updateValues.push(email);
    }
    if (role) {
      updateFields.push(`role = $${paramCount++}`);
      updateValues.push(role);
    }
    if (fullName !== undefined) {
      updateFields.push(`full_name = $${paramCount++}`);
      updateValues.push(fullName);
    }
    if (isActive !== undefined) {
      updateFields.push(`is_active = $${paramCount++}`);
      updateValues.push(isActive);
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await pool.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount}`,
        updateValues
      );
    }

    // Update permissions if provided
    if (permissions) {
      await pool.query(
        `UPDATE permissions SET
         can_access_billing = $1,
         can_access_dashboard = $2,
         can_access_forms = $3,
         can_access_reports = $4,
         can_manage_users = $5,
         updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $6`,
        [
          permissions.can_access_billing || false,
          permissions.can_access_dashboard !== undefined ? permissions.can_access_dashboard : true,
          permissions.can_access_forms !== undefined ? permissions.can_access_forms : true,
          permissions.can_access_reports || false,
          permissions.can_manage_users || false,
          id
        ]
      );
    }

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// Change password
router.post('/:id/change-password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, id]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

export default router;

