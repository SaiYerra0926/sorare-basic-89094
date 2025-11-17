import bcrypt from 'bcryptjs';
import pool from './config.js';

async function updateAdminPassword() {
  try {
    console.log('Updating admin password to: worx@123');
    
    // Hash the new password using bcrypt with 10 salt rounds
    const newPasswordHash = await bcrypt.hash('worx@123', 10);
    
    console.log('Password hash generated (bcrypt with 10 salt rounds)');
    console.log('Hash format: $2b$10$... (bcrypt variant 2b)');
    
    // Update admin password in database
    const result = await pool.query(
      `UPDATE users 
       SET password_hash = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE username = 'admin' 
       RETURNING id, username, email, role`,
      [newPasswordHash]
    );
    
    if (result.rows.length === 0) {
      console.error('❌ Admin user not found in database!');
      process.exit(1);
    }
    
    const admin = result.rows[0];
    console.log('✅ Admin password updated successfully!');
    console.log('Updated user:', admin);
    console.log('\n📝 Encryption Details:');
    console.log('  Type: bcrypt (via bcryptjs library)');
    console.log('  Salt Rounds: 10');
    console.log('  Hash Format: $2b$10$... (bcrypt variant 2b)');
    console.log('  Algorithm: Blowfish-based adaptive hashing');
    console.log('\n🔐 New Admin Credentials:');
    console.log('  Username: admin');
    console.log('  Password: worx@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin password:', error);
    process.exit(1);
  }
}

updateAdminPassword();

