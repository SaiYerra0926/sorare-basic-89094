import pool from './database/config.js';

async function verifyTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verifying database tables...\n');
    
    // Check main form tables
    const mainTables = ['encounters', 'snap_assessments', 'discharge_summaries', 'wrap_plans'];
    
    console.log('📋 Main Form Tables:');
    for (const table of mainTables) {
      try {
        const result = await client.query(
          `SELECT COUNT(*) as count FROM information_schema.tables 
           WHERE table_schema = 'public' AND table_name = $1`,
          [table]
        );
        
        if (result.rows[0].count > 0) {
          // Get row count
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
          console.log(`   ✅ ${table} - exists (${countResult.rows[0].count} records)`);
        } else {
          console.log(`   ❌ ${table} - NOT FOUND`);
        }
      } catch (error) {
        console.log(`   ❌ ${table} - ERROR: ${error.message}`);
      }
    }
    
    // Check master data tables
    console.log('\n📋 Master Data Tables:');
    const masterDataTables = [
      'encounter_type_of_contact',
      'encounter_recovery_interventions',
      'encounter_location_of_service',
      'snap_strengths_options',
      'snap_needs_options',
      'snap_abilities_options',
      'discharge_services_options',
      'discharge_criteria_options'
    ];
    
    for (const table of masterDataTables) {
      try {
        const result = await client.query(
          `SELECT COUNT(*) as count FROM information_schema.tables 
           WHERE table_schema = 'public' AND table_name = $1`,
          [table]
        );
        
        if (result.rows[0].count > 0) {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
          console.log(`   ✅ ${table} - exists (${countResult.rows[0].count} options)`);
        } else {
          console.log(`   ❌ ${table} - NOT FOUND`);
        }
      } catch (error) {
        console.log(`   ❌ ${table} - ERROR: ${error.message}`);
      }
    }
    
    // Check junction tables
    console.log('\n📋 Junction Tables:');
    const junctionTables = [
      'encounter_service_logs',
      'snap_assessment_strengths',
      'snap_assessment_needs',
      'snap_assessment_abilities',
      'snap_assessment_preferences',
      'discharge_summary_services',
      'discharge_summary_criteria'
    ];
    
    for (const table of junctionTables) {
      try {
        const result = await client.query(
          `SELECT COUNT(*) as count FROM information_schema.tables 
           WHERE table_schema = 'public' AND table_name = $1`,
          [table]
        );
        
        if (result.rows[0].count > 0) {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
          console.log(`   ✅ ${table} - exists (${countResult.rows[0].count} records)`);
        } else {
          console.log(`   ❌ ${table} - NOT FOUND`);
        }
      } catch (error) {
        console.log(`   ❌ ${table} - ERROR: ${error.message}`);
      }
    }
    
    console.log('\n✨ Verification complete!');
    
  } catch (error) {
    console.error('❌ Error verifying tables:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

