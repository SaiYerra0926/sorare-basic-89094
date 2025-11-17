import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initUsersDatabase() {
  try {
    console.log('Initializing users and permissions database...');
    
    // Create tables directly instead of reading from SQL file
    // This avoids issues with DO blocks and complex SQL
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        full_name VARCHAR(200),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);
    
    // Create permissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        can_access_billing BOOLEAN DEFAULT FALSE,
        can_access_dashboard BOOLEAN DEFAULT TRUE,
        can_access_forms BOOLEAN DEFAULT TRUE,
        can_access_reports BOOLEAN DEFAULT FALSE,
        can_manage_users BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_permissions_user_id ON permissions(user_id);`);
    
    // Create function for updating updated_at (if it doesn't exist)
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_users_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    // Create triggers (skip if they already exist)
    try {
      await pool.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON users`);
      await pool.query(`CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_users_updated_at()`);
    } catch (e) {
      if (!e.message.includes('already exists')) {
        console.log('Note: Could not create users trigger:', e.message);
      }
    }
    
    try {
      await pool.query(`DROP TRIGGER IF EXISTS update_permissions_updated_at ON permissions`);
      await pool.query(`CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions FOR EACH ROW EXECUTE FUNCTION update_users_updated_at()`);
    } catch (e) {
      if (!e.message.includes('already exists')) {
        console.log('Note: Could not create permissions trigger:', e.message);
      }
    }
    
    // Hash passwords and insert default users
    const adminPasswordHash = await bcrypt.hash('worx@123', 10);
    const userPasswordHash = await bcrypt.hash('user123', 10);
    
    // Insert admin user
    const adminResult = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, full_name, is_active)
       VALUES ('admin', 'admin@theworx.com', $1, 'admin', 'System Administrator', TRUE)
       ON CONFLICT (username) DO UPDATE SET password_hash = $1
       RETURNING id`,
      [adminPasswordHash]
    );
    
    // Insert regular user
    const userResult = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, full_name, is_active)
       VALUES ('user', 'user@theworx.com', $1, 'user', 'Default User', TRUE)
       ON CONFLICT (username) DO UPDATE SET password_hash = $1
       RETURNING id`,
      [userPasswordHash]
    );
    
    // Create permissions for admin
    if (adminResult.rows.length > 0) {
      const adminId = adminResult.rows[0].id;
      await pool.query(
        `INSERT INTO permissions (user_id, can_access_billing, can_access_dashboard, can_access_forms, can_access_reports, can_manage_users)
         VALUES ($1, TRUE, TRUE, TRUE, TRUE, TRUE)
         ON CONFLICT (user_id) DO UPDATE SET
           can_access_billing = TRUE,
           can_access_dashboard = TRUE,
           can_access_forms = TRUE,
           can_access_reports = TRUE,
           can_manage_users = TRUE,
           updated_at = CURRENT_TIMESTAMP`,
        [adminId]
      );
    }
    
    // Create permissions for user
    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].id;
      await pool.query(
        `INSERT INTO permissions (user_id, can_access_billing, can_access_dashboard, can_access_forms, can_access_reports, can_manage_users)
         VALUES ($1, FALSE, TRUE, TRUE, FALSE, FALSE)
         ON CONFLICT (user_id) DO UPDATE SET
           can_access_billing = FALSE,
           can_access_dashboard = TRUE,
           can_access_forms = TRUE,
           can_access_reports = FALSE,
           can_manage_users = FALSE,
           updated_at = CURRENT_TIMESTAMP`,
        [userId]
      );
    }
    
    console.log('✅ Users and permissions database initialized successfully!');
    console.log('Default credentials:');
    console.log('  Admin: username=admin, password=worx@123');
    console.log('  User: username=user, password=user123');
    console.log('⚠️  Please change these passwords in production!');
    console.log('\n📝 Password Encryption:');
    console.log('  Type: bcrypt (via bcryptjs library)');
    console.log('  Salt Rounds: 10');
    console.log('  Hash Format: $2b$10$... (bcrypt variant 2b)');
    console.log('  Algorithm: Blowfish-based adaptive hashing');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing users database:', error);
    process.exit(1);
  }
}

initUsersDatabase();

