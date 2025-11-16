-- Discharge Summary Form Database Schema
-- Database: Worx
-- Run this script to create all required tables for Discharge Summary forms

-- Main Discharge Summary table
CREATE TABLE IF NOT EXISTS discharge_summaries (
    id SERIAL PRIMARY KEY,
    participant_name VARCHAR(100) NOT NULL,
    date_of_referral DATE NOT NULL,
    primary_diagnosis VARCHAR(500),
    ma_number VARCHAR(50),
    date_of_admission DATE NOT NULL,
    date_of_discharge DATE NOT NULL,
    cps_crs_program_hours_completed VARCHAR(200),
    date_letter_sent DATE,
    reason_for_discharge TEXT,
    referrals TEXT,
    after_care_plan TEXT,
    staff_signature TEXT,
    staff_credential VARCHAR(200),
    staff_signature_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discharge from services selected (many-to-many relationship)
CREATE TABLE IF NOT EXISTS discharge_summary_services (
    id SERIAL PRIMARY KEY,
    discharge_summary_id INTEGER REFERENCES discharge_summaries(id) ON DELETE CASCADE,
    service_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nature of discharge criteria selected (many-to-many relationship)
CREATE TABLE IF NOT EXISTS discharge_summary_criteria (
    id SERIAL PRIMARY KEY,
    discharge_summary_id INTEGER REFERENCES discharge_summaries(id) ON DELETE CASCADE,
    criteria_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Master data tables for options
CREATE TABLE IF NOT EXISTS discharge_services_options (
    id SERIAL PRIMARY KEY,
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discharge_criteria_options (
    id SERIAL PRIMARY KEY,
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert master data for Discharge from Services
INSERT INTO discharge_services_options (value, label, display_order) VALUES
    ('willstan-housing', 'WillSTAN Housing', 1),
    ('rsw', 'RSW', 2),
    ('both-services', 'Both Services', 3)
ON CONFLICT (value) DO NOTHING;

-- Insert master data for Nature of Discharge Criteria
INSERT INTO discharge_criteria_options (value, label, display_order) VALUES
    ('successfully-completed', 'Successfully Completed', 1),
    ('agrees-to-discontinue', 'Agrees to Discontinue', 2),
    ('no-longer-benefits', 'No longer benefits from the service(s)', 3),
    ('violation-of-program', 'Violation of the program(s)', 4)
ON CONFLICT (value) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_discharge_summaries_participant_name ON discharge_summaries(participant_name);
CREATE INDEX IF NOT EXISTS idx_discharge_summaries_created_at ON discharge_summaries(created_at);
CREATE INDEX IF NOT EXISTS idx_discharge_summaries_date_of_discharge ON discharge_summaries(date_of_discharge);
CREATE INDEX IF NOT EXISTS idx_discharge_summary_services_discharge_summary_id ON discharge_summary_services(discharge_summary_id);
CREATE INDEX IF NOT EXISTS idx_discharge_summary_criteria_discharge_summary_id ON discharge_summary_criteria(discharge_summary_id);

