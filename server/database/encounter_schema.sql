-- Individual Encounter Form Database Schema
-- Database: Worx
-- Run this script to create all required tables for encounter forms

-- Main encounter form table
CREATE TABLE IF NOT EXISTS encounters (
    id SERIAL PRIMARY KEY,
    participant_name VARCHAR(100) NOT NULL,
    ma_id VARCHAR(50),
    chart_number VARCHAR(50),
    dsm5 VARCHAR(200),
    type_of_contact VARCHAR(50) NOT NULL,
    type_of_contact_other VARCHAR(200),
    recovery_interventions VARCHAR(100) NOT NULL,
    location_of_service VARCHAR(50) NOT NULL,
    location_of_service_details TEXT,
    goal TEXT,
    objective TEXT,
    service_description TEXT,
    peer_comments TEXT,
    plan_for_next_session TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service log entries table
CREATE TABLE IF NOT EXISTS encounter_service_logs (
    id SERIAL PRIMARY KEY,
    encounter_id INTEGER REFERENCES encounters(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    units VARCHAR(50) NOT NULL,
    participant_signature TEXT,
    staff_signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Master data tables for dropdowns
CREATE TABLE IF NOT EXISTS encounter_type_of_contact (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS encounter_recovery_interventions (
    id SERIAL PRIMARY KEY,
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS encounter_location_of_service (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert master data for Type of Contact
INSERT INTO encounter_type_of_contact (value, label, display_order) VALUES
    ('in-person', 'In-Person', 1),
    ('phone', 'Phone', 2),
    ('video', 'Video Conference', 3),
    ('home-visit', 'Home Visit', 4),
    ('community', 'Community Setting', 5),
    ('other', 'Other', 6)
ON CONFLICT (value) DO NOTHING;

-- Insert master data for Recovery Interventions
INSERT INTO encounter_recovery_interventions (value, label, display_order) VALUES
    ('individual-counseling', 'Individual Counseling', 1),
    ('group-counseling', 'Group Counseling', 2),
    ('peer-support', 'Peer Support', 3),
    ('case-management', 'Case Management', 4),
    ('crisis-intervention', 'Crisis Intervention', 5),
    ('skill-building', 'Skill Building', 6),
    ('recovery-planning', 'Recovery Planning', 7),
    ('resource-coordination', 'Resource Coordination', 8),
    ('advocacy', 'Advocacy', 9),
    ('other', 'Other', 10)
ON CONFLICT (value) DO NOTHING;

-- Insert master data for Location of Service
INSERT INTO encounter_location_of_service (value, label, display_order) VALUES
    ('office', 'Office', 1),
    ('home', 'Home', 2),
    ('community', 'Community', 3),
    ('telehealth', 'Telehealth', 4),
    ('hospital', 'Hospital', 5),
    ('residential', 'Residential Facility', 6),
    ('other', 'Other', 7)
ON CONFLICT (value) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_encounters_participant_name ON encounters(participant_name);
CREATE INDEX IF NOT EXISTS idx_encounters_created_at ON encounters(created_at);
CREATE INDEX IF NOT EXISTS idx_encounter_service_logs_encounter_id ON encounter_service_logs(encounter_id);
CREATE INDEX IF NOT EXISTS idx_encounter_service_logs_date ON encounter_service_logs(date);

