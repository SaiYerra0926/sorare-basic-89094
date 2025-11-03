import pool from './database/config.js';

async function verifyDatabase() {
  const client = await pool.connect();
  try {
    console.log('Verifying database tables...\n');
    
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No tables found in database!');
      process.exit(1);
    }
    
    console.log('✓ Database tables found:');
    const expectedTables = [
      'referrals',
      'personal_info',
      'screening_info',
      'referral_priority_populations',
      'emergency_contacts',
      'referrers',
      'applicant_signatures'
    ];
    
    const foundTables = result.rows.map(r => r.table_name);
    
    for (const table of expectedTables) {
      if (foundTables.includes(table)) {
        console.log(`  ✓ ${table}`);
      } else {
        console.log(`  ✗ ${table} - MISSING!`);
      }
    }
    
    console.log(`\nTotal tables found: ${foundTables.length}`);
    console.log('\n✅ Database verification complete!');
    
  } catch (error) {
    console.error('Error verifying database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyDatabase();

