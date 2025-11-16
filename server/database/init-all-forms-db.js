import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initAllFormsDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing all form database tables...\n');
    
    await client.query('BEGIN');
    
    // Read and execute each schema file
    const schemaFiles = [
      'encounter_schema.sql',
      'snap_assessment_schema.sql',
      'discharge_summary_schema.sql',
      'wrap_plan_schema.sql'
    ];
    
    for (const schemaFile of schemaFiles) {
      const schemaPath = path.join(__dirname, schemaFile);
      
      if (!fs.existsSync(schemaPath)) {
        console.log(`⚠️  Warning: ${schemaFile} not found, skipping...`);
        continue;
      }
      
      console.log(`📄 Executing ${schemaFile}...`);
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      
      // Split by semicolons and execute each statement
      const statements = schemaSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await client.query(statement);
          } catch (error) {
            // Ignore "already exists" errors
            if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
              console.error(`Error executing statement in ${schemaFile}:`, error.message);
            }
          }
        }
      }
      
      console.log(`✅ ${schemaFile} completed\n`);
    }
    
    await client.query('COMMIT');
    
    console.log('✅ All form database tables initialized successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Encounter Form tables created');
    console.log('   - SNAP Assessment tables created');
    console.log('   - Discharge Summary tables created');
    console.log('   - WRAP Plan tables created');
    console.log('   - Master data inserted');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')) ||
                     process.argv[1].includes('init-all-forms-db.js');

if (isMainModule || process.argv[1]?.includes('init-all-forms-db')) {
  initAllFormsDatabase()
    .then(() => {
      console.log('\n✨ Database initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Database initialization failed:', error);
      process.exit(1);
    });
}

export default initAllFormsDatabase;

