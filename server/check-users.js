import pool from './database/config.js';

async function checkUsers() {
  try {
    const result = await pool.query('SELECT username, email, role, is_active FROM users');
    console.log('\nUsers in database:');
    if (result.rows.length === 0) {
      console.log('❌ No users found!');
      console.log('Run: npm run init-users-db');
      process.exit(1);
    } else {
      result.rows.forEach(u => {
        console.log(`  - ${u.username} (${u.role}) - Active: ${u.is_active}`);
      });
      console.log(`\n✅ Found ${result.rows.length} user(s)`);
    }
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

checkUsers();

