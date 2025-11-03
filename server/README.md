# Worx Referral API Server

Backend API server for managing referral form submissions.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create the database and run the schema:
```bash
# Connect to PostgreSQL and create database
psql -U postgres -h localhost -p 5433
CREATE DATABASE "Worx";

# Run the schema file
psql -U postgres -h localhost -p 5433 -d Worx -f database/schema.sql
```

3. Update `.env` file with your database credentials if needed.

4. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:3001

## API Endpoints

### POST /api/referrals
Submit a new referral form.

### GET /api/referrals
Get all referrals (paginated).

### GET /api/referrals/:id
Get a specific referral by ID.

## Database Schema

The database includes the following tables:
- `referrals` - Main referral records
- `personal_info` - Personal information
- `screening_info` - Screening and health information
- `referral_priority_populations` - Priority populations
- `emergency_contacts` - Emergency contact information
- `referrers` - Referrer information
- `applicant_signatures` - Applicant signatures

