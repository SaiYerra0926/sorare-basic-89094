import pool from './database/config.js';
import bcrypt from 'bcryptjs';

async function testLogin() {
  try {
    // Get admin user
    const result = await pool.query('SELECT * FROM users WHERE username = $1', ['admin']);
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    const user = result.rows[0];
    console.log('Admin user found:');
    console.log(`  Username: ${user.username}`);
    console.log(`  Password hash: ${user.password_hash.substring(0, 20)}...`);
    console.log(`  Hash starts with $2b$: ${user.password_hash.startsWith('$2b$')}`);
    
    // Test password
    const testPassword = 'admin123';
    let isValid = false;
    
    if (user.password_hash.startsWith('$2b$')) {
      isValid = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`\nBcrypt comparison result: ${isValid}`);
    } else {
      isValid = testPassword === user.password_hash;
      console.log(`\nPlain text comparison result: ${isValid}`);
    }
    
    if (isValid) {
      console.log('✅ Password verification works!');
    } else {
      console.log('❌ Password verification failed!');
      console.log('Re-hashing password...');
      const newHash = await bcrypt.hash(testPassword, 10);
      await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [newHash, 'admin']);
      console.log('✅ Password re-hashed. Try login again.');
    }
    
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

testLogin();

