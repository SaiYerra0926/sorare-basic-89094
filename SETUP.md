# Worx Referral Form - Database Setup Guide

## Database Configuration

- **Host**: localhost
- **Port**: 5433
- **Database**: Worx
- **User**: postgres
- **Password**: postgres

## Setup Instructions

### 1. Install Backend Dependencies

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

### 2. Create Database Tables

You have two options to create the database tables:

#### Option A: Using the init script (Recommended)
```bash
cd server
npm run init-db
```

#### Option B: Using psql directly
```bash
psql -U postgres -h localhost -p 5433 -d Worx -f database/schema.sql
```

Or connect to PostgreSQL and run:
```bash
psql -U postgres -h localhost -p 5433
\c Worx
\i database/schema.sql
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on http://localhost:3001

### 4. Start the Frontend Application

In the root directory:
```bash
npm run dev
```

The frontend will start on http://localhost:8080 (or the port specified in vite.config.ts)

## Database Schema

The following tables will be created:

1. **referrals** - Main referral records
2. **personal_info** - Personal information (name, DOB, contact info, etc.)
3. **screening_info** - Screening and health information
4. **referral_priority_populations** - Priority population categories
5. **emergency_contacts** - Emergency contact information
6. **referrers** - Referrer information
7. **applicant_signatures** - Applicant signatures and dates

## API Endpoints

- **POST /api/referrals** - Submit a new referral form
- **GET /api/referrals** - Get all referrals (paginated)
- **GET /api/referrals/:id** - Get a specific referral by ID
- **GET /health** - Health check endpoint

## Testing

Once both servers are running, you can:

1. Open the frontend application
2. Navigate to the Referral Form
3. Fill out and submit the form
4. The data will be saved to the PostgreSQL database

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify PostgreSQL is running:
   ```bash
   psql -U postgres -h localhost -p 5433 -d Worx
   ```

2. Check the `.env` file in the `server` directory matches your database configuration

3. Ensure the database "Worx" exists:
   ```sql
   CREATE DATABASE "Worx";
   ```

### Schema Issues

If tables already exist and you want to recreate them:

```sql
-- Drop existing tables (in order due to foreign keys)
DROP TABLE IF EXISTS applicant_signatures CASCADE;
DROP TABLE IF EXISTS referrers CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS referral_priority_populations CASCADE;
DROP TABLE IF EXISTS screening_info CASCADE;
DROP TABLE IF EXISTS personal_info CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
```

Then run the schema file again.

## Notes

- The API server runs on port 3001 by default
- The frontend is configured to call `http://localhost:3001/api` by default
- All form submissions are saved to the database with proper relationships
- The system uses transactions to ensure data integrity

