import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initHandbookDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Initializing handbook database tables...');
    
    // Read the handbook schema file
    const schemaPath = path.join(__dirname, 'database', 'handbook_schema.sql');
    let schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Remove comments
    schema = schema.replace(/--.*$/gm, '');
    
    // Split by semicolon, but preserve DO blocks and functions
    const statements = [];
    let currentStatement = '';
    let inDollarQuote = false;
    let dollarTag = '';
    let i = 0;
    
    while (i < schema.length) {
      const char = schema[i];
      
      if (!inDollarQuote && char === '$') {
        // Start of dollar-quoted string
        const tagStart = i;
        i++;
        while (i < schema.length && schema[i] !== '$') {
          i++;
        }
        dollarTag = schema.substring(tagStart, i + 1);
        inDollarQuote = true;
        currentStatement += dollarTag;
        i++;
        continue;
      }
      
      if (inDollarQuote && schema.substring(i, i + dollarTag.length) === dollarTag) {
        // End of dollar-quoted string
        currentStatement += dollarTag;
        i += dollarTag.length;
        inDollarQuote = false;
        dollarTag = '';
        continue;
      }
      
      if (!inDollarQuote && char === ';') {
        const trimmed = currentStatement.trim();
        if (trimmed.length > 0) {
          statements.push(trimmed);
        }
        currentStatement = '';
      } else {
        currentStatement += char;
      }
      i++;
    }
    
    // Execute statements
    for (const statement of statements) {
      if (statement.trim().length > 0) {
        try {
          await client.query(statement);
        } catch (err) {
          // Skip errors for IF NOT EXISTS or already exists
          if (err.code !== '42P07' && err.code !== '42710' && err.code !== '42P16') {
            console.warn('Warning:', err.message.substring(0, 100));
          }
        }
      }
    }
    
    console.log('✓ Handbook database tables created successfully!');
    console.log('Tables created:');
    console.log('  - handbook_submissions');
    console.log('  - consent_to_participate');
    console.log('  - privacy_practices_ack');
    console.log('  - recording_authorization');
    console.log('  - covid19_screening');
    console.log('  - rights_acknowledgment');
    console.log('  - tobacco_cessation');
    console.log('  - suicide_risk_screening');
    console.log('  - homicide_risk_assessment');
    console.log('  - staff_risk_assessment');
    console.log('  - overdose_risk_screening');
    console.log('  - maud_moud_education');
    console.log('  - snap_assessment');
    console.log('  - snap_outcomes_isp');
    console.log('  - camberwell_outcomes');
    console.log('  - camberwell_assessment_need');
    console.log('  - preliminary_isp');
    console.log('  - orientation_confirmation');
    
  } catch (error) {
    console.error('Error initializing handbook database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initHandbookDatabase()
  .then(() => {
    console.log('\n✓ Handbook database initialization complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Handbook database initialization failed:', error);
    process.exit(1);
  });

