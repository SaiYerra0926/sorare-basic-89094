import pool from './config.js';

async function checkAdminPassword() {
  try {
    const result = await pool.query(
      `SELECT username, LEFT(password_hash, 30) as hash_preview, role, updated_at 
       FROM users 
       WHERE username = 'admin'`
    );
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('✅ Admin user found in database:');
      console.log('  Username:', admin.username);
      console.log('  Role:', admin.role);
      console.log('  Hash Preview:', admin.hash_preview + '...');
      console.log('  Last Updated:', admin.updated_at);
      console.log('\n📝 Hash Information:');
      console.log('  Encryption Type: bcrypt (via bcryptjs)');
      console.log('  Format: $2b$10$... (bcrypt variant 2b, 10 salt rounds)');
      console.log('  Algorithm: Blowfish-based adaptive hashing');
    } else {
      console.log('❌ Admin user not found!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAdminPassword();

