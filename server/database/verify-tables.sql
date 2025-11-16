-- Verification Script for All Form Tables
-- Run this script to verify all tables were created successfully

-- Check main form tables
SELECT 
    'Main Form Tables' as category,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN (
    'encounters',
    'snap_assessments',
    'discharge_summaries',
    'wrap_plans'
)
ORDER BY table_name;

-- Check junction tables
SELECT 
    'Junction Tables' as category,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND (
    table_name LIKE '%_service_logs' OR
    table_name LIKE '%_strengths' OR
    table_name LIKE '%_needs' OR
    table_name LIKE '%_abilities' OR
    table_name LIKE '%_preferences%' OR
    table_name LIKE '%_services' OR
    table_name LIKE '%_criteria'
)
ORDER BY table_name;

-- Check master data tables
SELECT 
    'Master Data Tables' as category,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND (
    table_name LIKE '%_options' OR
    table_name LIKE 'encounter_%' OR
    table_name LIKE 'snap_%' OR
    table_name LIKE 'discharge_%'
)
AND table_name NOT LIKE '%_strengths'
AND table_name NOT LIKE '%_needs'
AND table_name NOT LIKE '%_abilities'
AND table_name NOT LIKE '%_preferences%'
AND table_name NOT LIKE '%_services'
AND table_name NOT LIKE '%_criteria'
AND table_name NOT LIKE '%_service_logs'
ORDER BY table_name;

-- Count records in master data tables
SELECT 
    'Master Data Counts' as category,
    'encounter_type_of_contact' as table_name,
    COUNT(*) as record_count
FROM encounter_type_of_contact
UNION ALL
SELECT 
    'Master Data Counts',
    'encounter_recovery_interventions',
    COUNT(*)
FROM encounter_recovery_interventions
UNION ALL
SELECT 
    'Master Data Counts',
    'encounter_location_of_service',
    COUNT(*)
FROM encounter_location_of_service
UNION ALL
SELECT 
    'Master Data Counts',
    'snap_strengths_options',
    COUNT(*)
FROM snap_strengths_options
UNION ALL
SELECT 
    'Master Data Counts',
    'snap_needs_options',
    COUNT(*)
FROM snap_needs_options
UNION ALL
SELECT 
    'Master Data Counts',
    'snap_abilities_options',
    COUNT(*)
FROM snap_abilities_options
UNION ALL
SELECT 
    'Master Data Counts',
    'discharge_services_options',
    COUNT(*)
FROM discharge_services_options
UNION ALL
SELECT 
    'Master Data Counts',
    'discharge_criteria_options',
    COUNT(*)
FROM discharge_criteria_options;

-- Summary
SELECT 
    'SUMMARY' as info,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('encounters', 'snap_assessments', 'discharge_summaries', 'wrap_plans')) as main_tables,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND (table_name LIKE '%_options' OR table_name LIKE 'encounter_%' OR table_name LIKE 'snap_%' OR table_name LIKE 'discharge_%')) as total_tables;

