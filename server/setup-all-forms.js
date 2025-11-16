import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function executeSQLFile(filePath) {
  const client = await pool.connect();
  
  try {
    console.log(`\n📄 Executing: ${path.basename(filePath)}`);
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Remove DO $$ blocks and comments
    let cleanSQL = sql
      .replace(/DO \$\$[\s\S]*?\$\$;/g, '') // Remove DO blocks
      .replace(/--.*$/gm, '') // Remove single-line comments
      .trim();
    
    // Split by semicolon but keep CREATE TABLE statements together
    const statements = [];
    let currentStatement = '';
    let inCreateTable = false;
    
    for (let i = 0; i < cleanSQL.length; i++) {
      const char = cleanSQL[i];
      const nextChars = cleanSQL.substring(i, i + 12).toUpperCase();
      
      if (nextChars.startsWith('CREATE TABLE')) {
        inCreateTable = true;
      }
      
      currentStatement += char;
      
      if (char === ';' && !inCreateTable) {
        const stmt = currentStatement.trim();
        if (stmt.length > 10) {
          statements.push(stmt);
        }
        currentStatement = '';
      } else if (char === ';' && inCreateTable) {
        // Check if this is the end of CREATE TABLE
        const stmt = currentStatement.trim();
        if (stmt.includes('CREATE TABLE') && stmt.endsWith(';')) {
          statements.push(stmt);
          currentStatement = '';
          inCreateTable = false;
        }
      }
    }
    
    if (currentStatement.trim().length > 10) {
      statements.push(currentStatement.trim());
    }
    
    let success = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const statement of statements) {
      if (!statement || statement.length < 10) continue;
      
      try {
        await client.query(statement);
        success++;
      } catch (error) {
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.code === '42P07' ||
            error.code === '23505') {
          skipped++;
        } else {
          errors++;
          console.error(`   ⚠️  Error: ${error.message.substring(0, 80)}`);
        }
      }
    }
    
    console.log(`   ✓ Success: ${success}, ⊘ Skipped: ${skipped}, ✗ Errors: ${errors}`);
    
  } catch (error) {
    console.error(`   ❌ Failed to execute ${filePath}:`, error.message);
  } finally {
    client.release();
  }
}

async function setupAllForms() {
  try {
    console.log('🚀 Setting up all form database tables...\n');
    
    const schemaFiles = [
      'encounter_schema.sql',
      'snap_assessment_schema.sql',
      'discharge_summary_schema.sql',
      'wrap_plan_schema.sql'
    ];
    
    for (const file of schemaFiles) {
      const filePath = path.join(__dirname, 'database', file);
      if (fs.existsSync(filePath)) {
        await executeSQLFile(filePath);
      } else {
        console.log(`⚠️  File not found: ${file}`);
      }
    }
    
    console.log('\n✅ All schema files processed!');
    console.log('\n📊 Summary:');
    console.log('   - Encounter Form tables');
    console.log('   - SNAP Assessment tables');
    console.log('   - Discharge Summary tables');
    console.log('   - WRAP Plan tables');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await pool.end();
  }
}

setupAllForms()
  .then(() => {
    console.log('\n✨ Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  });

