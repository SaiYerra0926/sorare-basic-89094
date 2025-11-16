-- Handbook Forms Database Schema
-- This schema includes all forms from the Participant Handbook

-- Main handbook submission table
CREATE TABLE IF NOT EXISTS handbook_submissions (
    id SERIAL PRIMARY KEY,
    participant_name VARCHAR(100) NOT NULL,
    participant_dob DATE NOT NULL,
    submission_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Consent to Participate in Services
CREATE TABLE IF NOT EXISTS consent_to_participate (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    participant_name VARCHAR(100) NOT NULL,
    staff_name VARCHAR(100) NOT NULL,
    questions_answered VARCHAR(10) CHECK (questions_answered IN ('Yes', 'No')),
    agree_to_participate VARCHAR(10) CHECK (agree_to_participate IN ('I DO', 'I DO NOT')),
    participant_signature TEXT,
    participant_signature_date DATE,
    staff_signature TEXT,
    staff_signature_date DATE,
    supervisor_signature TEXT,
    supervisor_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Notice of Privacy Practices
CREATE TABLE IF NOT EXISTS privacy_practices_ack (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    program VARCHAR(200),
    signature TEXT,
    signature_date DATE,
    print_name VARCHAR(100),
    personal_representative_title VARCHAR(200),
    program_staff_signature TEXT,
    program_staff_date DATE,
    program_staff_name_title VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Video/Audio/Recording Authorization
CREATE TABLE IF NOT EXISTS recording_authorization (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    street_address VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    phone VARCHAR(20),
    fax VARCHAR(20),
    email VARCHAR(255),
    signature TEXT,
    signature_date DATE,
    parent_signature TEXT,
    parent_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. COVID-19 Screening Questionnaire
CREATE TABLE IF NOT EXISTS covid19_screening (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    staff_participant_visitor VARCHAR(100),
    date_week_beginning DATE,
    initial_covid_test_result VARCHAR(50),
    initial_covid_test_initials VARCHAR(10),
    -- Questions 1-5 responses for each day of week
    q1_fever_sun VARCHAR(10),
    q1_fever_mon VARCHAR(10),
    q1_fever_tues VARCHAR(10),
    q1_fever_wed VARCHAR(10),
    q1_fever_thurs VARCHAR(10),
    q1_fever_fri VARCHAR(10),
    q1_fever_sat VARCHAR(10),
    q2_symptoms_sun VARCHAR(10),
    q2_symptoms_mon VARCHAR(10),
    q2_symptoms_tues VARCHAR(10),
    q2_symptoms_wed VARCHAR(10),
    q2_symptoms_thurs VARCHAR(10),
    q2_symptoms_fri VARCHAR(10),
    q2_symptoms_sat VARCHAR(10),
    q3_positive_test_sun VARCHAR(10),
    q3_positive_test_mon VARCHAR(10),
    q3_positive_test_tues VARCHAR(10),
    q3_positive_test_wed VARCHAR(10),
    q3_positive_test_thurs VARCHAR(10),
    q3_positive_test_fri VARCHAR(10),
    q3_positive_test_sat VARCHAR(10),
    q4_close_contact_sun VARCHAR(10),
    q4_close_contact_mon VARCHAR(10),
    q4_close_contact_tues VARCHAR(10),
    q4_close_contact_wed VARCHAR(10),
    q4_close_contact_thurs VARCHAR(10),
    q4_close_contact_fri VARCHAR(10),
    q4_close_contact_sat VARCHAR(10),
    q5_mask_available_sun VARCHAR(10),
    q5_mask_available_mon VARCHAR(10),
    q5_mask_available_tues VARCHAR(10),
    q5_mask_available_wed VARCHAR(10),
    q5_mask_available_thurs VARCHAR(10),
    q5_mask_available_fri VARCHAR(10),
    q5_mask_available_sat VARCHAR(10),
    participant_signature TEXT,
    participant_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Rights to Participants Acknowledgment
CREATE TABLE IF NOT EXISTS rights_acknowledgment (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_signature TEXT,
    signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tobacco Cessation Screening Tool
CREATE TABLE IF NOT EXISTS tobacco_cessation (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    patient_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    currently_smoke_tobacco VARCHAR(10),
    tobacco_products_used TEXT,
    years_smoking VARCHAR(50),
    cigarettes_per_day VARCHAR(50),
    previous_quit_attempts VARCHAR(10),
    health_issues VARCHAR(10),
    understand_health_risks VARCHAR(10),
    ready_to_quit VARCHAR(10),
    quit_date DATE,
    support_system TEXT,
    signature TEXT,
    signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Suicide Risk Screening Tool
CREATE TABLE IF NOT EXISTS suicide_risk_screening (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    q1_wished_dead VARCHAR(10),
    q2_family_better_off VARCHAR(10),
    q3_thoughts_killing_self VARCHAR(10),
    q4_ever_tried_kill_self VARCHAR(10),
    q4_how TEXT,
    q4_when TEXT,
    q5_thoughts_killing_now VARCHAR(10),
    q5_describe TEXT,
    screening_result VARCHAR(50),
    participant_signature TEXT,
    signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Homicide Risk Assessment
CREATE TABLE IF NOT EXISTS homicide_risk_assessment (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    thoughts_harming_others VARCHAR(10),
    time_thinking_harm VARCHAR(10),
    who TEXT,
    when_harm TEXT,
    where_harm TEXT,
    plan_to_harm VARCHAR(10),
    access_means VARCHAR(10),
    history_violence VARCHAR(10),
    environmental_risk_factors TEXT[],
    protective_factors TEXT[],
    assessment_risk VARCHAR(50),
    resource_guide_provided VARCHAR(50),
    participant_signature TEXT,
    signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Staff Use Only Risk Assessment
CREATE TABLE IF NOT EXISTS staff_risk_assessment (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    risk_level VARCHAR(50),
    risk_protective_factors TEXT,
    suicidality_homicidality TEXT,
    possible_interventions TEXT,
    low_risk_actions TEXT[],
    moderate_high_risk_actions TEXT[],
    additional_comments TEXT,
    staff_signature TEXT,
    staff_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Overdose Risk Screening Assessment
CREATE TABLE IF NOT EXISTS overdose_risk_screening (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    -- Risk factors with scores
    current_heroin_user INTEGER,
    current_injector INTEGER,
    started_injecting_six_months INTEGER,
    current_methadone_prescribed INTEGER,
    current_methadone_street INTEGER,
    not_supervised_consumption INTEGER,
    also_drinks_alcohol INTEGER,
    uses_benzodiazepines INTEGER,
    dual_use_heroin_crack INTEGER,
    prison_hospital_treatment_month INTEGER,
    ever_overdosed INTEGER,
    overdosed_once_past_year INTEGER,
    overdosed_twice_past_year INTEGER,
    using_more_five_years INTEGER,
    using_large_amounts INTEGER,
    harder_get_buzz INTEGER,
    enjoys_big_gouch INTEGER,
    prone_low_mood INTEGER,
    tends_use_alone INTEGER,
    has_health_problems INTEGER,
    erratic_patterns_use INTEGER,
    total_score INTEGER,
    risk_level VARCHAR(50),
    staff_signature TEXT,
    staff_credentials VARCHAR(50),
    participant_signature TEXT,
    signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. MAUD/MOUD Education Checklist
CREATE TABLE IF NOT EXISTS maud_moud_education (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    -- Checklist items with participant and staff initials
    education_provided_intake BOOLEAN DEFAULT FALSE,
    education_provided_intake_participant_initials VARCHAR(10),
    education_provided_intake_staff_initials VARCHAR(10),
    thorough_education_benefits_risks BOOLEAN DEFAULT FALSE,
    thorough_education_benefits_risks_participant_initials VARCHAR(10),
    thorough_education_benefits_risks_staff_initials VARCHAR(10),
    educated_overdose_risks BOOLEAN DEFAULT FALSE,
    educated_overdose_risks_participant_initials VARCHAR(10),
    educated_overdose_risks_staff_initials VARCHAR(10),
    educated_naloxone_overview BOOLEAN DEFAULT FALSE,
    educated_naloxone_overview_participant_initials VARCHAR(10),
    educated_naloxone_overview_staff_initials VARCHAR(10),
    educated_prescription_pharmacies BOOLEAN DEFAULT FALSE,
    educated_prescription_pharmacies_participant_initials VARCHAR(10),
    educated_prescription_pharmacies_staff_initials VARCHAR(10),
    educated_instructions_pir_family BOOLEAN DEFAULT FALSE,
    educated_instructions_pir_family_participant_initials VARCHAR(10),
    educated_instructions_pir_family_staff_initials VARCHAR(10),
    educated_naloxone_provided BOOLEAN DEFAULT FALSE,
    educated_naloxone_provided_participant_initials VARCHAR(10),
    educated_naloxone_provided_staff_initials VARCHAR(10),
    educated_pharmacies_stock_naloxone BOOLEAN DEFAULT FALSE,
    educated_pharmacies_stock_naloxone_participant_initials VARCHAR(10),
    educated_pharmacies_stock_naloxone_staff_initials VARCHAR(10),
    educated_relapse_risk BOOLEAN DEFAULT FALSE,
    educated_relapse_risk_participant_initials VARCHAR(10),
    educated_relapse_risk_staff_initials VARCHAR(10),
    educated_relapse_prevention BOOLEAN DEFAULT FALSE,
    educated_relapse_prevention_participant_initials VARCHAR(10),
    educated_relapse_prevention_staff_initials VARCHAR(10),
    educated_community_care_website BOOLEAN DEFAULT FALSE,
    educated_community_care_website_participant_initials VARCHAR(10),
    educated_community_care_website_staff_initials VARCHAR(10),
    educated_triggers_cravings BOOLEAN DEFAULT FALSE,
    educated_triggers_cravings_participant_initials VARCHAR(10),
    educated_triggers_cravings_staff_initials VARCHAR(10),
    educated_rights_freedom_choice BOOLEAN DEFAULT FALSE,
    educated_rights_freedom_choice_participant_initials VARCHAR(10),
    educated_rights_freedom_choice_staff_initials VARCHAR(10),
    educated_medication_access_instructions BOOLEAN DEFAULT FALSE,
    educated_medication_access_instructions_participant_initials VARCHAR(10),
    educated_medication_access_instructions_staff_initials VARCHAR(10),
    participant_signature TEXT,
    participant_signature_date DATE,
    staff_signature TEXT,
    staff_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. SNAP Assessment
CREATE TABLE IF NOT EXISTS snap_assessment (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    -- Strengths
    strengths_open_minded BOOLEAN DEFAULT FALSE,
    strengths_friendly BOOLEAN DEFAULT FALSE,
    strengths_creative BOOLEAN DEFAULT FALSE,
    strengths_good_listener BOOLEAN DEFAULT FALSE,
    strengths_quick_learner BOOLEAN DEFAULT FALSE,
    strengths_dependable BOOLEAN DEFAULT FALSE,
    strengths_motivation BOOLEAN DEFAULT FALSE,
    strengths_good_grooming BOOLEAN DEFAULT FALSE,
    strengths_organized BOOLEAN DEFAULT FALSE,
    strengths_takes_responsibility BOOLEAN DEFAULT FALSE,
    strengths_spiritual_values BOOLEAN DEFAULT FALSE,
    strengths_independent BOOLEAN DEFAULT FALSE,
    strengths_assertive BOOLEAN DEFAULT FALSE,
    strengths_hard_worker BOOLEAN DEFAULT FALSE,
    strengths_learn_from_experiences BOOLEAN DEFAULT FALSE,
    strengths_collaborate BOOLEAN DEFAULT FALSE,
    strengths_problem_solver BOOLEAN DEFAULT FALSE,
    strengths_decision_maker BOOLEAN DEFAULT FALSE,
    strengths_good_health BOOLEAN DEFAULT FALSE,
    strengths_other TEXT,
    -- Needs
    needs_increase_knowledge_resources BOOLEAN DEFAULT FALSE,
    needs_job_training_education BOOLEAN DEFAULT FALSE,
    needs_medical_care BOOLEAN DEFAULT FALSE,
    needs_sober_environment BOOLEAN DEFAULT FALSE,
    needs_mental_health_diagnosis BOOLEAN DEFAULT FALSE,
    needs_medication_knowledge BOOLEAN DEFAULT FALSE,
    needs_symptoms_behaviors_knowledge BOOLEAN DEFAULT FALSE,
    needs_empowerment BOOLEAN DEFAULT FALSE,
    needs_communication_skills BOOLEAN DEFAULT FALSE,
    needs_talk_concerns BOOLEAN DEFAULT FALSE,
    needs_practice_coping_skills BOOLEAN DEFAULT FALSE,
    needs_coping_sleep BOOLEAN DEFAULT FALSE,
    needs_coping_anxiety BOOLEAN DEFAULT FALSE,
    needs_coping_depression BOOLEAN DEFAULT FALSE,
    needs_coping_leisure BOOLEAN DEFAULT FALSE,
    needs_coping_organizing BOOLEAN DEFAULT FALSE,
    needs_coping_anger BOOLEAN DEFAULT FALSE,
    needs_coping_mood_regulation BOOLEAN DEFAULT FALSE,
    needs_coping_reality_thinking BOOLEAN DEFAULT FALSE,
    needs_coping_eating_healthy BOOLEAN DEFAULT FALSE,
    needs_stop_smoking BOOLEAN DEFAULT FALSE,
    needs_other TEXT,
    -- Abilities
    abilities_read_write BOOLEAN DEFAULT FALSE,
    abilities_computer_skills BOOLEAN DEFAULT FALSE,
    abilities_work_with_others BOOLEAN DEFAULT FALSE,
    abilities_manage_emotions BOOLEAN DEFAULT FALSE,
    abilities_positive_relationships BOOLEAN DEFAULT FALSE,
    abilities_job_skills BOOLEAN DEFAULT FALSE,
    abilities_healthy_decisions BOOLEAN DEFAULT FALSE,
    abilities_education_training TEXT,
    abilities_leisure_skills TEXT,
    abilities_time_management BOOLEAN DEFAULT FALSE,
    abilities_other TEXT,
    -- Preferences
    preferences_learn_hands_on BOOLEAN DEFAULT FALSE,
    preferences_learn_face_to_face BOOLEAN DEFAULT FALSE,
    preferences_learn_reading BOOLEAN DEFAULT FALSE,
    preferences_learn_alone BOOLEAN DEFAULT FALSE,
    preferences_learn_discussion BOOLEAN DEFAULT FALSE,
    preferences_learn_group_peers BOOLEAN DEFAULT FALSE,
    preferences_family_involved BOOLEAN DEFAULT FALSE,
    preferences_family_meeting BOOLEAN DEFAULT FALSE,
    preferences_live_independently BOOLEAN DEFAULT FALSE,
    preferences_live_community_support BOOLEAN DEFAULT FALSE,
    preferences_live_with_others BOOLEAN DEFAULT FALSE,
    preferences_live_other TEXT,
    preferences_interest_outpatient BOOLEAN DEFAULT FALSE,
    preferences_interest_community_resources BOOLEAN DEFAULT FALSE,
    preferences_interest_other TEXT,
    participant_signature TEXT,
    participant_signature_date DATE,
    staff_signature TEXT,
    staff_title VARCHAR(100),
    staff_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. SNAP Outcomes Preliminary ISP Form
CREATE TABLE IF NOT EXISTS snap_outcomes_isp (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    date_of_admission DATE,
    date_completed DATE,
    date_isp_due DATE,
    has_wrap_plan VARCHAR(10),
    wants_wrap_plan VARCHAR(10),
    domain_living_self_maintenance TEXT,
    domain_education_vocational_employment TEXT,
    domain_health_wellness TEXT,
    domain_socializing TEXT,
    goal_verbalize_physical_needs BOOLEAN DEFAULT FALSE,
    goal_complete_medical_assessment BOOLEAN DEFAULT FALSE,
    goal_verbalize_emotional_needs BOOLEAN DEFAULT FALSE,
    goal_verbalize_program_questions BOOLEAN DEFAULT FALSE,
    goal_complete_assessment BOOLEAN DEFAULT FALSE,
    goal_verbalize_recovery_needs BOOLEAN DEFAULT FALSE,
    goal_begin_treatment_services BOOLEAN DEFAULT FALSE,
    goal_begin_socializing BOOLEAN DEFAULT FALSE,
    goal_identify_family_options TEXT,
    additional_goals TEXT,
    participant_signature TEXT,
    participant_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Camberwell Assessment Outcomes Form
CREATE TABLE IF NOT EXISTS camberwell_outcomes (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    date_of_admission DATE,
    date_completed DATE,
    date_isp_due DATE,
    has_wrap_plan VARCHAR(10),
    wants_wrap_plan VARCHAR(10),
    concerns_unmet_needs TEXT,
    month_assessment_data JSONB,
    goal_verbalize_physical_needs BOOLEAN DEFAULT FALSE,
    goal_complete_medical_assessment BOOLEAN DEFAULT FALSE,
    goal_verbalize_emotional_needs BOOLEAN DEFAULT FALSE,
    goal_verbalize_program_questions BOOLEAN DEFAULT FALSE,
    goal_complete_assessment BOOLEAN DEFAULT FALSE,
    goal_verbalize_recovery_needs BOOLEAN DEFAULT FALSE,
    goal_begin_treatment_services BOOLEAN DEFAULT FALSE,
    goal_begin_socializing BOOLEAN DEFAULT FALSE,
    goal_identify_family_options TEXT,
    additional_goals TEXT,
    participant_signature TEXT,
    participant_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Camberwell Assessment of Need (CAN)
CREATE TABLE IF NOT EXISTS camberwell_assessment_need (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    assessment_number VARCHAR(50),
    interviewed VARCHAR(10),
    date_of_assessment DATE,
    assessor_initials VARCHAR(10),
    -- 22 assessment categories with ratings for 4 assessment points
    can_data JSONB,
    total_met_needs INTEGER,
    total_unmet_needs INTEGER,
    total_number_needs INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Preliminary ISP Form
CREATE TABLE IF NOT EXISTS preliminary_isp (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    action_reach_natural_supports BOOLEAN DEFAULT FALSE,
    action_attend_self_help BOOLEAN DEFAULT FALSE,
    action_improve_physical_wellness BOOLEAN DEFAULT FALSE,
    action_improve_mental_health_wellness BOOLEAN DEFAULT FALSE,
    action_meet_cps_crs BOOLEAN DEFAULT FALSE,
    action_meet_cps_crs_name VARCHAR(100),
    action_meet_cps_crs_times_per_week INTEGER,
    additional_action_steps TEXT,
    participant_signature TEXT,
    participant_signature_date DATE,
    cps_crs_signature TEXT,
    cps_crs_signature_date DATE,
    cps_crs_supervisor_signature TEXT,
    cps_crs_supervisor_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Orientation Confirmation
CREATE TABLE IF NOT EXISTS orientation_confirmation (
    id SERIAL PRIMARY KEY,
    handbook_submission_id INTEGER REFERENCES handbook_submissions(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    -- 21 policies with dates and initials
    policy_vital_records_date DATE,
    policy_vital_records_staff_initials VARCHAR(10),
    policy_vital_records_participant_initials VARCHAR(10),
    policy_admission_criteria_date DATE,
    policy_admission_criteria_staff_initials VARCHAR(10),
    policy_admission_criteria_participant_initials VARCHAR(10),
    policy_services_date DATE,
    policy_services_staff_initials VARCHAR(10),
    policy_services_participant_initials VARCHAR(10),
    policy_goals_achieved_date DATE,
    policy_goals_achieved_staff_initials VARCHAR(10),
    policy_goals_achieved_participant_initials VARCHAR(10),
    policy_recovery_values_date DATE,
    policy_recovery_values_staff_initials VARCHAR(10),
    policy_recovery_values_participant_initials VARCHAR(10),
    policy_confidentiality_date DATE,
    policy_confidentiality_staff_initials VARCHAR(10),
    policy_confidentiality_participant_initials VARCHAR(10),
    policy_nondiscrimination_date DATE,
    policy_nondiscrimination_staff_initials VARCHAR(10),
    policy_nondiscrimination_participant_initials VARCHAR(10),
    policy_grievance_procedures_date DATE,
    policy_grievance_procedures_staff_initials VARCHAR(10),
    policy_grievance_procedures_participant_initials VARCHAR(10),
    policy_emergency_phone_numbers_date DATE,
    policy_emergency_phone_numbers_staff_initials VARCHAR(10),
    policy_emergency_phone_numbers_participant_initials VARCHAR(10),
    policy_discharge_termination_date DATE,
    policy_discharge_termination_staff_initials VARCHAR(10),
    policy_discharge_termination_participant_initials VARCHAR(10),
    policy_consent_participate_date DATE,
    policy_consent_participate_staff_initials VARCHAR(10),
    policy_consent_participate_participant_initials VARCHAR(10),
    policy_privacy_practices_date DATE,
    policy_privacy_practices_staff_initials VARCHAR(10),
    policy_privacy_practices_participant_initials VARCHAR(10),
    policy_rights_participants_date DATE,
    policy_rights_participants_staff_initials VARCHAR(10),
    policy_rights_participants_participant_initials VARCHAR(10),
    policy_audio_photo_video_date DATE,
    policy_audio_photo_video_staff_initials VARCHAR(10),
    policy_audio_photo_video_participant_initials VARCHAR(10),
    policy_allergy_covid_medication_date DATE,
    policy_allergy_covid_medication_staff_initials VARCHAR(10),
    policy_allergy_covid_medication_participant_initials VARCHAR(10),
    policy_tobacco_cessation_date DATE,
    policy_tobacco_cessation_staff_initials VARCHAR(10),
    policy_tobacco_cessation_participant_initials VARCHAR(10),
    policy_homicide_suicide_risk_date DATE,
    policy_homicide_suicide_risk_staff_initials VARCHAR(10),
    policy_homicide_suicide_risk_participant_initials VARCHAR(10),
    policy_overdose_risk_date DATE,
    policy_overdose_risk_staff_initials VARCHAR(10),
    policy_overdose_risk_participant_initials VARCHAR(10),
    policy_maud_moud_acknowledgement_date DATE,
    policy_maud_moud_acknowledgement_staff_initials VARCHAR(10),
    policy_maud_moud_acknowledgement_participant_initials VARCHAR(10),
    policy_canfor_date DATE,
    policy_canfor_staff_initials VARCHAR(10),
    policy_canfor_participant_initials VARCHAR(10),
    policy_snap_preliminary_isp_date DATE,
    policy_snap_preliminary_isp_staff_initials VARCHAR(10),
    policy_snap_preliminary_isp_participant_initials VARCHAR(10),
    participant_signature TEXT,
    participant_signature_date DATE,
    staff_signature TEXT,
    staff_signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_handbook_submissions_participant_name ON handbook_submissions(participant_name);
CREATE INDEX IF NOT EXISTS idx_handbook_submissions_created_at ON handbook_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_consent_handbook_id ON consent_to_participate(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_privacy_handbook_id ON privacy_practices_ack(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_recording_handbook_id ON recording_authorization(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_covid19_handbook_id ON covid19_screening(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_rights_handbook_id ON rights_acknowledgment(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_tobacco_handbook_id ON tobacco_cessation(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_suicide_handbook_id ON suicide_risk_screening(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_homicide_handbook_id ON homicide_risk_assessment(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_staff_risk_handbook_id ON staff_risk_assessment(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_overdose_handbook_id ON overdose_risk_screening(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_maud_handbook_id ON maud_moud_education(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_snap_assessment_handbook_id ON snap_assessment(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_snap_outcomes_isp_handbook_id ON snap_outcomes_isp(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_camberwell_outcomes_handbook_id ON camberwell_outcomes(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_camberwell_assessment_handbook_id ON camberwell_assessment_need(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_preliminary_isp_handbook_id ON preliminary_isp(handbook_submission_id);
CREATE INDEX IF NOT EXISTS idx_orientation_confirmation_handbook_id ON orientation_confirmation(handbook_submission_id);

-- Function to update updated_at timestamp (reuse existing function if available)
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
DROP TRIGGER IF EXISTS update_handbook_submissions_updated_at ON handbook_submissions;
CREATE TRIGGER update_handbook_submissions_updated_at BEFORE UPDATE ON handbook_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

