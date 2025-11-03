-- Create database schema for Worx Referral Forms
-- Database: Worx
-- Run this script to create all required tables

-- Main referral form table
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referral_date DATE NOT NULL,
    services TEXT[] NOT NULL, -- Array of selected services
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal information table
CREATE TABLE IF NOT EXISTS personal_info (
    id SERIAL PRIMARY KEY,
    referral_id INTEGER REFERENCES referrals(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    pronouns VARCHAR(50),
    legal_name VARCHAR(100),
    birth_date DATE NOT NULL,
    is_homeless BOOLEAN DEFAULT FALSE,
    address VARCHAR(200),
    city_state_zip VARCHAR(100),
    home_phone VARCHAR(20),
    cell_phone VARCHAR(20),
    ssn VARCHAR(11),
    email VARCHAR(255),
    medical_assistance_id VARCHAR(50),
    medical_assistance_provider VARCHAR(100),
    gender VARCHAR(50) NOT NULL,
    gender_other VARCHAR(100),
    race VARCHAR(50) NOT NULL,
    race_other VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Screening and health information table
CREATE TABLE IF NOT EXISTS screening_info (
    id SERIAL PRIMARY KEY,
    referral_id INTEGER REFERENCES referrals(id) ON DELETE CASCADE,
    is_pregnant TEXT,
    drug_of_choice VARCHAR(200),
    last_date_of_use DATE,
    mental_health_conditions TEXT,
    diagnosis TEXT,
    medical_conditions TEXT,
    allergies TEXT,
    physical_limitations TEXT,
    medications TEXT,
    tobacco_user TEXT,
    criminal_offenses TEXT,
    probation_parole TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Priority populations table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS referral_priority_populations (
    id SERIAL PRIMARY KEY,
    referral_id INTEGER REFERENCES referrals(id) ON DELETE CASCADE,
    priority_population VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contact table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id SERIAL PRIMARY KEY,
    referral_id INTEGER REFERENCES referrals(id) ON DELETE CASCADE,
    name VARCHAR(100),
    relationship VARCHAR(50),
    phone VARCHAR(20),
    address VARCHAR(200),
    city_state_zip VARCHAR(100),
    cell_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referrer information table
CREATE TABLE IF NOT EXISTS referrers (
    id SERIAL PRIMARY KEY,
    referral_id INTEGER REFERENCES referrals(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    agency VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(255),
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applicant signature table
CREATE TABLE IF NOT EXISTS applicant_signatures (
    id SERIAL PRIMARY KEY,
    referral_id INTEGER REFERENCES referrals(id) ON DELETE CASCADE,
    signature TEXT,
    signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at);
CREATE INDEX IF NOT EXISTS idx_personal_info_referral_id ON personal_info(referral_id);
CREATE INDEX IF NOT EXISTS idx_screening_info_referral_id ON screening_info(referral_id);
CREATE INDEX IF NOT EXISTS idx_priority_populations_referral_id ON referral_priority_populations(referral_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_referral_id ON emergency_contacts(referral_id);
CREATE INDEX IF NOT EXISTS idx_referrers_referral_id ON referrers(referral_id);

-- Function to update updated_at timestamp
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
    ) THEN
        CREATE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $func$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $func$ language 'plpgsql';
    END IF;
END $$;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_referrals_updated_at ON referrals;
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

