# Forms Database Setup Guide

This guide explains how to set up the database tables for all forms in the Worx application.

## Forms Included

1. **Encounter Form** - Individual encounter records with service logs
2. **SNAP Assessment Form** - Strengths, Needs, Abilities, and Preferences assessment
3. **Discharge Summary Form** - Participant discharge information and aftercare planning
4. **WRAP Plan Form** - Wellness Recovery Action Plan with Traffic Light system

## Database Setup Methods

### Method 1: Run Combined Schema (Recommended)

Run all form tables at once using the combined schema file:

```bash
# Using psql directly
psql -U postgres -h localhost -p 5433 -d Worx -f database/all_forms_schema.sql

# Or using npm script
cd server
npm run init-forms-db
```

### Method 2: Run Individual Schema Files

If you prefer to run schemas individually:

```bash
# Encounter Form
psql -U postgres -h localhost -p 5433 -d Worx -f database/encounter_schema.sql

# SNAP Assessment Form
psql -U postgres -h localhost -p 5433 -d Worx -f database/snap_assessment_schema.sql

# Discharge Summary Form
psql -U postgres -h localhost -p 5433 -d Worx -f database/discharge_summary_schema.sql

# WRAP Plan Form
psql -U postgres -h localhost -p 5433 -d Worx -f database/wrap_plan_schema.sql
```

### Method 3: Using Node.js Script

You can also use the Node.js initialization script:

```bash
cd server/database
node init-all-forms-db.js
```

## Tables Created

### Encounter Form Tables
- `encounters` - Main encounter records
- `encounter_service_logs` - Service log entries with signatures
- `encounter_type_of_contact` - Master data for contact types
- `encounter_recovery_interventions` - Master data for interventions
- `encounter_location_of_service` - Master data for service locations

### SNAP Assessment Tables
- `snap_assessments` - Main assessment records
- `snap_assessment_strengths` - Junction table for strengths
- `snap_assessment_needs` - Junction table for needs
- `snap_assessment_abilities` - Junction table for abilities
- `snap_assessment_preferences` - Junction table for preferences
- `snap_assessment_preferences_interested_in` - Junction table for interests
- `snap_strengths_options` - Master data for strengths
- `snap_needs_options` - Master data for needs
- `snap_abilities_options` - Master data for abilities
- `snap_preferences_learn_better_options` - Master data for learning preferences
- `snap_preferences_living_situation_options` - Master data for living situations
- `snap_preferences_interested_in_options` - Master data for interests

### Discharge Summary Tables
- `discharge_summaries` - Main discharge records
- `discharge_summary_services` - Junction table for services
- `discharge_summary_criteria` - Junction table for discharge criteria
- `discharge_services_options` - Master data for services
- `discharge_criteria_options` - Master data for criteria

### WRAP Plan Tables
- `wrap_plans` - Main WRAP plan records with all 6 sections

## Master Data

All master data is automatically inserted when you run the schema files. This includes:
- Dropdown options for all forms
- Checkbox options for multi-select fields
- Pre-configured values with proper ordering

## API Endpoints

After setting up the database, the following API endpoints will be available:

### Encounter Form
- `POST /api/encounters` - Create new encounter
- `GET /api/encounters` - Get all encounters (paginated)
- `GET /api/encounters/:id` - Get specific encounter
- `GET /api/encounters/master-data/*` - Get master data options

### SNAP Assessment
- `POST /api/snap-assessments` - Create new assessment
- `GET /api/snap-assessments` - Get all assessments (paginated)
- `GET /api/snap-assessments/:id` - Get specific assessment
- `GET /api/snap-assessments/master-data/*` - Get master data options

### Discharge Summary
- `POST /api/discharge-summaries` - Create new discharge summary
- `GET /api/discharge-summaries` - Get all summaries (paginated)
- `GET /api/discharge-summaries/:id` - Get specific summary
- `GET /api/discharge-summaries/master-data/*` - Get master data options

### WRAP Plan
- `POST /api/wrap-plans` - Create new WRAP plan
- `GET /api/wrap-plans` - Get all plans (paginated)
- `GET /api/wrap-plans/:id` - Get specific plan

## Verification

To verify that all tables were created successfully, you can run:

```sql
-- Check if all main tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'encounters',
    'snap_assessments',
    'discharge_summaries',
    'wrap_plans'
);

-- Check master data tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%_options' 
OR table_name LIKE 'encounter_%'
OR table_name LIKE 'snap_%'
OR table_name LIKE 'discharge_%';
```

## Troubleshooting

### Tables Already Exist
If you see errors about tables already existing, that's okay! The `CREATE TABLE IF NOT EXISTS` statements will skip existing tables.

### Master Data Already Exists
The `ON CONFLICT (value) DO NOTHING` clauses ensure that master data won't be duplicated if you run the schema multiple times.

### Connection Issues
Make sure:
1. PostgreSQL is running
2. Database "Worx" exists
3. Connection credentials in `.env` are correct
4. Port 5433 is accessible (or update the port in commands)

## Next Steps

After setting up the database:
1. Start the backend server: `cd server && npm run dev`
2. Verify API endpoints are working
3. Test form submissions from the frontend
4. Check database records to confirm data is being saved

