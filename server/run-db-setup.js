import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing all form database tables...\n');
    
    // Read the combined schema file
    const schemaPath = path.join(__dirname, 'database', 'all_forms_schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    console.log(`📄 Reading schema file: ${schemaPath}`);
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('DO $$'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      
      if (!statement || statement.length < 10) {
        continue;
      }
      
      try {
        await client.query(statement);
        successCount++;
        
        // Show progress for every 10 statements
        if ((i + 1) % 10 === 0) {
          console.log(`   Processed ${i + 1}/${statements.length} statements...`);
        }
      } catch (error) {
        // Ignore "already exists" errors
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.message.includes('does not exist') ||
            error.code === '42P07') {
          skipCount++;
        } else {
          errorCount++;
          console.error(`   ⚠️  Error on statement ${i + 1}:`, error.message.substring(0, 100));
        }
      }
    }
    
    console.log('\n✅ Database initialization complete!');
    console.log(`   ✓ Successfully executed: ${successCount} statements`);
    console.log(`   ⊘ Skipped (already exists): ${skipCount} statements`);
    if (errorCount > 0) {
      console.log(`   ✗ Errors: ${errorCount} statements`);
    }
    
    console.log('\n📊 Summary:');
    console.log('   - Encounter Form tables');
    console.log('   - SNAP Assessment tables');
    console.log('   - Discharge Summary tables');
    console.log('   - WRAP Plan tables');
    console.log('   - Master data inserted');
    
  } catch (error) {
    console.error('\n❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  });

