import pool from './database/config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkSetup() {
  console.log('🔍 Checking server setup...\n');

  // Check if node_modules exists
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('❌ node_modules not found');
    console.log('   Run: npm install\n');
    return false;
  }
  console.log('✅ node_modules found');

  // Check if required packages are installed
  const requiredPackages = ['bcryptjs', 'jsonwebtoken', 'express', 'pg'];
  let allPackagesInstalled = true;
  for (const pkg of requiredPackages) {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (!fs.existsSync(pkgPath)) {
      console.log(`❌ Package '${pkg}' not found`);
      allPackagesInstalled = false;
    }
  }
  if (!allPackagesInstalled) {
    console.log('   Run: npm install\n');
    return false;
  }
  console.log('✅ All required packages installed');

  // Check database connection
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.log('❌ Database connection failed');
    console.log(`   Error: ${error.message}`);
    console.log('   Check your .env file and PostgreSQL connection\n');
    return false;
  }

  // Check if users table exists
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    if (result.rows[0].exists) {
      console.log('✅ Users table exists');
      
      // Check if default users exist
      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`✅ Found ${userCount.rows[0].count} user(s) in database`);
    } else {
      console.log('❌ Users table does not exist');
      console.log('   Run: npm run init-users-db\n');
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking users table');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }

  console.log('\n✅ Setup check complete! Server is ready to start.');
  console.log('   Run: npm start\n');
  return true;
}

checkSetup()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Error during setup check:', error);
    process.exit(1);
  });

