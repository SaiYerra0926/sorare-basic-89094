-- Combined Database Schema for All Forms
-- Database: Worx
-- This script creates all tables for: Encounter Form, SNAP Assessment, Discharge Summary, and WRAP Plan
-- Run this script to create all required tables at once

-- ============================================================================
-- ENCOUNTER FORM TABLES
-- ============================================================================

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

-- Create indexes for Encounter Form
CREATE INDEX IF NOT EXISTS idx_encounters_participant_name ON encounters(participant_name);
CREATE INDEX IF NOT EXISTS idx_encounters_created_at ON encounters(created_at);
CREATE INDEX IF NOT EXISTS idx_encounter_service_logs_encounter_id ON encounter_service_logs(encounter_id);
CREATE INDEX IF NOT EXISTS idx_encounter_service_logs_date ON encounter_service_logs(date);

-- ============================================================================
-- SNAP ASSESSMENT FORM TABLES
-- ============================================================================

-- Main SNAP Assessment table
CREATE TABLE IF NOT EXISTS snap_assessments (
    id SERIAL PRIMARY KEY,
    participant_name VARCHAR(100) NOT NULL,
    todays_date DATE NOT NULL,
    strengths_other TEXT,
    needs_other TEXT,
    abilities_other TEXT,
    preferences_learn_better VARCHAR(100),
    preferences_living_situation VARCHAR(100),
    preferences_living_situation_other TEXT,
    preferences_interested_in_other TEXT,
    participant_signature TEXT,
    participant_signature_date DATE,
    staff_signature TEXT,
    staff_title VARCHAR(200),
    staff_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Strengths selected (many-to-many relationship)
CREATE TABLE IF NOT EXISTS snap_assessment_strengths (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES snap_assessments(id) ON DELETE CASCADE,
    strength_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Needs selected (many-to-many relationship)
CREATE TABLE IF NOT EXISTS snap_assessment_needs (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES snap_assessments(id) ON DELETE CASCADE,
    need_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Abilities selected (many-to-many relationship)
CREATE TABLE IF NOT EXISTS snap_assessment_abilities (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES snap_assessments(id) ON DELETE CASCADE,
    ability_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Preferences selected (many-to-many relationship)
CREATE TABLE IF NOT EXISTS snap_assessment_preferences (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES snap_assessments(id) ON DELETE CASCADE,
    preference_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Preferences interested in selected (many-to-many relationship)
CREATE TABLE IF NOT EXISTS snap_assessment_preferences_interested_in (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES snap_assessments(id) ON DELETE CASCADE,
    interested_in_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Master data tables for SNAP Assessment options
CREATE TABLE IF NOT EXISTS snap_strengths_options (
    id SERIAL PRIMARY KEY,
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS snap_needs_options (
    id SERIAL PRIMARY KEY,
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS snap_abilities_options (
    id SERIAL PRIMARY KEY,
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS snap_preferences_learn_better_options (
    id SERIAL PRIMARY KEY,
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS snap_preferences_living_situation_options (
    id SERIAL PRIMARY KEY,
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS snap_preferences_interested_in_options (
    id SERIAL PRIMARY KEY,
    value VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert master data for Strengths
INSERT INTO snap_strengths_options (value, label, display_order) VALUES
    ('open-minded', 'Open minded', 1),
    ('friendly', 'Friendly', 2),
    ('creative', 'Creative', 3),
    ('good-listener', 'Good Listener', 4),
    ('quick-learner', 'Quick Learner', 5),
    ('good-grooming', 'Good Grooming', 6),
    ('organized', 'Organized', 7),
    ('takes-personal-responsibility', 'Takes personal responsibility', 8),
    ('strong-personal-or-spiritual-values', 'Strong personal or spiritual values', 9),
    ('independent', 'Independent', 10),
    ('assertive', 'Assertive', 11),
    ('hard-worker', 'Hard Worker', 12),
    ('able-to-learn-from-experiences', 'Able to learn from my experiences', 13),
    ('can-collaborate-work-with-others', 'Can collaborate/ work with others', 14),
    ('good-problem-solver', 'Good Problem Solver', 15),
    ('good-decision-maker', 'Good Decision Maker', 16),
    ('dependable', 'Dependable', 17),
    ('motivation', 'Motivation', 18),
    ('good-health', 'Good health', 19)
ON CONFLICT (value) DO NOTHING;

-- Insert master data for Needs
INSERT INTO snap_needs_options (value, label, display_order) VALUES
    ('increase-knowledge-of-resources', 'Increase my knowledge of resources that provide me with support', 1),
    ('referral-to-resources-job-training-education', 'Referral to resources for job training or education', 2),
    ('access-to-medical-care', 'Access to medical care for health related concerns', 3),
    ('staying-in-sober-environment', 'Staying in a sober environment to help me not use drugs and or alcohol', 4),
    ('gain-knowledge-mental-health-diagnosis', 'Gain more knowledge and understanding about: My mental health diagnosis', 5),
    ('gain-knowledge-medications', 'Gain more knowledge and understanding about: My medication(s)', 6),
    ('gain-knowledge-symptoms-behaviors', 'Gain more knowledge and understanding about: My symptoms / behaviors related to my mental health diagnosis', 7),
    ('get-help-to-stop-smoking', 'Get help to stop smoking', 8),
    ('learn-how-to-empower-myself', 'Learn how to empower myself to take a more active role in my treatment', 9),
    ('increasing-effective-communication-skills', 'Increasing effective communication skills to improve my relationships with others', 10),
    ('learn-how-to-talk-about-concerns', 'Learn how to talk about my concerns/issues/feelings', 11),
    ('practice-coping-skills', 'Practice my coping skills in a safe environment', 12),
    ('learn-coping-skills-improving-sleep', 'Learn more about effective coping skills related to: Improving my sleep', 13),
    ('learn-coping-skills-reducing-anxiety', 'Learn more about effective coping skills related to: Reducing anxiety and using relaxation', 14),
    ('learn-coping-skills-managing-depression', 'Learn more about effective coping skills related to: Managing my depression', 15),
    ('learn-coping-skills-leisure-skills', 'Learn more about effective coping skills related to: Leisure skills', 16),
    ('learn-coping-skills-organizing-daily-activities', 'Learn more about effective coping skills related to: Organizing daily activities', 17),
    ('learn-coping-skills-managing-anger', 'Learn more about effective coping skills related to: Managing anger', 18),
    ('learn-coping-skills-mood-regulation', 'Learn more about effective coping skills related to: Mood Regulation', 19),
    ('learn-coping-skills-improving-reality-based-thinking', 'Learn more about effective coping skills related to: Improving reality-based thinking', 20),
    ('learn-coping-skills-eating-healthy', 'Learn more about effective coping skills related to: Eating Healthy', 21)
ON CONFLICT (value) DO NOTHING;

-- Insert master data for Abilities
INSERT INTO snap_abilities_options (value, label, display_order) VALUES
    ('basic-ability-to-read-and-write', 'Basic ability to read and write', 1),
    ('computer-knowledge-and-skills', 'Computer knowledge and skills', 2),
    ('ability-to-work-effectively-with-others', 'Ability to work effectively with others', 3),
    ('knowledge-or-tools-to-manage-emotions', 'Knowledge or tools that I use to help me manage my emotions', 4),
    ('ability-to-have-positive-relationships', 'Ability to have positive relationships with others', 5),
    ('ability-to-make-healthy-decisions', 'Ability to make healthy decisions about my life', 6),
    ('job-skills', 'Job Skills', 7),
    ('education-training', 'Education / Training', 8),
    ('leisure-skills', 'Leisure Skills', 9),
    ('ability-to-manage-time-and-structure-daily-activities', 'Ability to manage my time and structure my daily activities', 10)
ON CONFLICT (value) DO NOTHING;

-- Insert master data for Preferences Learn Better
INSERT INTO snap_preferences_learn_better_options (value, label, display_order) VALUES
    ('face-to-face', 'Face to face', 1),
    ('hands-on-instruction-and-practice', 'Hands on instruction and practice', 2),
    ('reading-written-material', 'Reading written material', 3),
    ('alone', 'Alone', 4),
    ('in-discussion-with-others', 'In discussion with others', 5)
ON CONFLICT (value) DO NOTHING;

-- Insert master data for Preferences Living Situation
INSERT INTO snap_preferences_living_situation_options (value, label, display_order) VALUES
    ('independently-on-my-own', 'Independently, on my own', 1),
    ('independently-with-community-support', 'Independently, with community support', 2),
    ('with-others', 'With others', 3)
ON CONFLICT (value) DO NOTHING;

-- Insert master data for Preferences Interested In
INSERT INTO snap_preferences_interested_in_options (value, label, display_order) VALUES
    ('outpatient-programming', 'Outpatient programming', 1),
    ('community-resources', 'Community resources', 2)
ON CONFLICT (value) DO NOTHING;

-- Create indexes for SNAP Assessment
CREATE INDEX IF NOT EXISTS idx_snap_assessments_participant_name ON snap_assessments(participant_name);
CREATE INDEX IF NOT EXISTS idx_snap_assessments_created_at ON snap_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_snap_assessment_strengths_assessment_id ON snap_assessment_strengths(assessment_id);
CREATE INDEX IF NOT EXISTS idx_snap_assessment_needs_assessment_id ON snap_assessment_needs(assessment_id);
CREATE INDEX IF NOT EXISTS idx_snap_assessment_abilities_assessment_id ON snap_assessment_abilities(assessment_id);
CREATE INDEX IF NOT EXISTS idx_snap_assessment_preferences_assessment_id ON snap_assessment_preferences(assessment_id);

-- ============================================================================
-- DISCHARGE SUMMARY FORM TABLES
-- ============================================================================

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

-- Master data tables for Discharge Summary options
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

-- Create indexes for Discharge Summary
CREATE INDEX IF NOT EXISTS idx_discharge_summaries_participant_name ON discharge_summaries(participant_name);
CREATE INDEX IF NOT EXISTS idx_discharge_summaries_created_at ON discharge_summaries(created_at);
CREATE INDEX IF NOT EXISTS idx_discharge_summaries_date_of_discharge ON discharge_summaries(date_of_discharge);
CREATE INDEX IF NOT EXISTS idx_discharge_summary_services_discharge_summary_id ON discharge_summary_services(discharge_summary_id);
CREATE INDEX IF NOT EXISTS idx_discharge_summary_criteria_discharge_summary_id ON discharge_summary_criteria(discharge_summary_id);

-- ============================================================================
-- WRAP PLAN FORM TABLES
-- ============================================================================

-- Main WRAP Plan table
CREATE TABLE IF NOT EXISTS wrap_plans (
    id SERIAL PRIMARY KEY,
    daily_maintenance_plan TEXT,
    triggers_action_plan TEXT,
    early_warning_signs_action_plan TEXT,
    breaking_down_action_plan TEXT,
    crisis_plan TEXT,
    post_crisis_plan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for WRAP Plan
CREATE INDEX IF NOT EXISTS idx_wrap_plans_created_at ON wrap_plans(created_at);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify all tables were created
DO $$
BEGIN
    RAISE NOTICE '✅ All form tables have been created successfully!';
    RAISE NOTICE '   - Encounter Form tables: encounters, encounter_service_logs, and master data tables';
    RAISE NOTICE '   - SNAP Assessment tables: snap_assessments, junction tables, and master data tables';
    RAISE NOTICE '   - Discharge Summary tables: discharge_summaries, junction tables, and master data tables';
    RAISE NOTICE '   - WRAP Plan tables: wrap_plans';
END $$;

