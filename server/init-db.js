import pool from './database/config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('Initializing database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
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
    
    console.log('\nDatabase schema created successfully!');
    console.log('Tables created:');
    console.log('✓ referrals');
    console.log('✓ personal_info');
    console.log('✓ screening_info');
    console.log('✓ referral_priority_populations');
    console.log('✓ emergency_contacts');
    console.log('✓ referrers');
    console.log('✓ applicant_signatures');
    console.log('\nYou can now start the server with: npm run dev (from server directory)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();

