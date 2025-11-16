import express from 'express';
import pool from '../database/config.js';

const router = express.Router();

// Submit complete handbook form
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      participantName,
      participantDob,
      consentToParticipate,
      privacyPractices,
      recordingAuthorization,
      covid19Screening,
      rightsAcknowledgment,
      tobaccoCessation,
      suicideRiskScreening,
      homicideRiskAssessment,
      staffRiskAssessment,
      overdoseRiskScreening,
      maudMoudEducation,
      snapAssessment,
      snapOutcomesIsp,
      camberwellOutcomes,
      camberwellAssessmentNeed,
      preliminaryIsp,
      orientationConfirmation
    } = req.body;

    // Create main handbook submission
    const submissionResult = await client.query(
      `INSERT INTO handbook_submissions (participant_name, participant_dob, submission_date)
       VALUES ($1, $2, $3) RETURNING id`,
      [participantName, participantDob, new Date()]
    );
    
    const submissionId = submissionResult.rows[0].id;

    // Insert consent to participate
    if (consentToParticipate) {
      await client.query(
        `INSERT INTO consent_to_participate (
          handbook_submission_id, date, participant_name, staff_name,
          questions_answered, agree_to_participate,
          participant_signature, participant_signature_date,
          staff_signature, staff_signature_date,
          supervisor_signature, supervisor_signature_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          submissionId,
          consentToParticipate.date,
          consentToParticipate.participantName,
          consentToParticipate.staffName,
          consentToParticipate.questionsAnswered,
          consentToParticipate.agreeToParticipate,
          consentToParticipate.participantSignature,
          consentToParticipate.participantSignatureDate,
          consentToParticipate.staffSignature,
          consentToParticipate.staffSignatureDate,
          consentToParticipate.supervisorSignature,
          consentToParticipate.supervisorSignatureDate
        ]
      );
    }

    // Insert privacy practices acknowledgment
    if (privacyPractices) {
      await client.query(
        `INSERT INTO privacy_practices_ack (
          handbook_submission_id, participant_name, program,
          signature, signature_date, print_name, personal_representative_title,
          program_staff_signature, program_staff_date, program_staff_name_title
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          submissionId,
          privacyPractices.participantName,
          privacyPractices.program,
          privacyPractices.signature,
          privacyPractices.signatureDate,
          privacyPractices.printName,
          privacyPractices.personalRepresentativeTitle,
          privacyPractices.programStaffSignature,
          privacyPractices.programStaffDate,
          privacyPractices.programStaffNameTitle
        ]
      );
    }

    // Insert recording authorization
    if (recordingAuthorization) {
      await client.query(
        `INSERT INTO recording_authorization (
          handbook_submission_id, full_name, street_address, city, state, zip_code,
          phone, fax, email, signature, signature_date,
          parent_signature, parent_signature_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          submissionId,
          recordingAuthorization.fullName,
          recordingAuthorization.streetAddress,
          recordingAuthorization.city,
          recordingAuthorization.state,
          recordingAuthorization.zipCode,
          recordingAuthorization.phone,
          recordingAuthorization.fax,
          recordingAuthorization.email,
          recordingAuthorization.signature,
          recordingAuthorization.signatureDate,
          recordingAuthorization.parentSignature,
          recordingAuthorization.parentSignatureDate
        ]
      );
    }

    // Insert COVID-19 screening
    if (covid19Screening) {
      await client.query(
        `INSERT INTO covid19_screening (
          handbook_submission_id, participant_name, staff_participant_visitor,
          date_week_beginning, initial_covid_test_result, initial_covid_test_initials,
          q1_fever_sun, q1_fever_mon, q1_fever_tues, q1_fever_wed, q1_fever_thurs, q1_fever_fri, q1_fever_sat,
          q2_symptoms_sun, q2_symptoms_mon, q2_symptoms_tues, q2_symptoms_wed, q2_symptoms_thurs, q2_symptoms_fri, q2_symptoms_sat,
          q3_positive_test_sun, q3_positive_test_mon, q3_positive_test_tues, q3_positive_test_wed, q3_positive_test_thurs, q3_positive_test_fri, q3_positive_test_sat,
          q4_close_contact_sun, q4_close_contact_mon, q4_close_contact_tues, q4_close_contact_wed, q4_close_contact_thurs, q4_close_contact_fri, q4_close_contact_sat,
          q5_mask_available_sun, q5_mask_available_mon, q5_mask_available_tues, q5_mask_available_wed, q5_mask_available_thurs, q5_mask_available_fri, q5_mask_available_sat,
          participant_signature, participant_signature_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48)`,
        [
          submissionId,
          covid19Screening.participantName,
          covid19Screening.staffParticipantVisitor,
          covid19Screening.dateWeekBeginning,
          covid19Screening.initialCovidTestResult,
          covid19Screening.initialCovidTestInitials,
          ...Object.values(covid19Screening.responses || {}),
          covid19Screening.participantSignature,
          covid19Screening.participantSignatureDate
        ]
      );
    }

    // Insert rights acknowledgment
    if (rightsAcknowledgment) {
      await client.query(
        `INSERT INTO rights_acknowledgment (
          handbook_submission_id, participant_signature, signature_date
        ) VALUES ($1, $2, $3)`,
        [
          submissionId,
          rightsAcknowledgment.participantSignature,
          rightsAcknowledgment.signatureDate
        ]
      );
    }

    // Insert tobacco cessation
    if (tobaccoCessation) {
      await client.query(
        `INSERT INTO tobacco_cessation (
          handbook_submission_id, patient_name, date_of_birth,
          currently_smoke_tobacco, tobacco_products_used, years_smoking,
          cigarettes_per_day, previous_quit_attempts, health_issues,
          understand_health_risks, ready_to_quit, quit_date, support_system,
          signature, signature_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          submissionId,
          tobaccoCessation.patientName,
          tobaccoCessation.dateOfBirth,
          tobaccoCessation.currentlySmokeTobacco,
          tobaccoCessation.tobaccoProductsUsed,
          tobaccoCessation.yearsSmoking,
          tobaccoCessation.cigarettesPerDay,
          tobaccoCessation.previousQuitAttempts,
          tobaccoCessation.healthIssues,
          tobaccoCessation.understandHealthRisks,
          tobaccoCessation.readyToQuit,
          tobaccoCessation.quitDate,
          tobaccoCessation.supportSystem,
          tobaccoCessation.signature,
          tobaccoCessation.signatureDate
        ]
      );
    }

    // Insert suicide risk screening
    if (suicideRiskScreening) {
      await client.query(
        `INSERT INTO suicide_risk_screening (
          handbook_submission_id, participant_name, date_of_birth,
          q1_wished_dead, q2_family_better_off, q3_thoughts_killing_self,
          q4_ever_tried_kill_self, q4_how, q4_when,
          q5_thoughts_killing_now, q5_describe, screening_result,
          participant_signature, signature_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          submissionId,
          suicideRiskScreening.participantName,
          suicideRiskScreening.dateOfBirth,
          suicideRiskScreening.q1WishedDead,
          suicideRiskScreening.q2FamilyBetterOff,
          suicideRiskScreening.q3ThoughtsKillingSelf,
          suicideRiskScreening.q4EverTriedKillSelf,
          suicideRiskScreening.q4How,
          suicideRiskScreening.q4When,
          suicideRiskScreening.q5ThoughtsKillingNow,
          suicideRiskScreening.q5Describe,
          suicideRiskScreening.screeningResult,
          suicideRiskScreening.participantSignature,
          suicideRiskScreening.signatureDate
        ]
      );
    }

    // Insert homicide risk assessment
    if (homicideRiskAssessment) {
      await client.query(
        `INSERT INTO homicide_risk_assessment (
          handbook_submission_id, participant_name, date_of_birth,
          thoughts_harming_others, time_thinking_harm, who, when_harm, where_harm,
          plan_to_harm, access_means, history_violence,
          environmental_risk_factors, protective_factors,
          assessment_risk, resource_guide_provided,
          participant_signature, signature_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          submissionId,
          homicideRiskAssessment.participantName,
          homicideRiskAssessment.dateOfBirth,
          homicideRiskAssessment.thoughtsHarmingOthers,
          homicideRiskAssessment.timeThinkingHarm,
          homicideRiskAssessment.who,
          homicideRiskAssessment.whenHarm,
          homicideRiskAssessment.whereHarm,
          homicideRiskAssessment.planToHarm,
          homicideRiskAssessment.accessMeans,
          homicideRiskAssessment.historyViolence,
          homicideRiskAssessment.environmentalRiskFactors || [],
          homicideRiskAssessment.protectiveFactors || [],
          homicideRiskAssessment.assessmentRisk,
          homicideRiskAssessment.resourceGuideProvided,
          homicideRiskAssessment.participantSignature,
          homicideRiskAssessment.signatureDate
        ]
      );
    }

    // Insert staff risk assessment
    if (staffRiskAssessment) {
      await client.query(
        `INSERT INTO staff_risk_assessment (
          handbook_submission_id, participant_name, date_of_birth,
          risk_level, risk_protective_factors, suicidality_homicidality,
          possible_interventions, low_risk_actions, moderate_high_risk_actions,
          additional_comments, staff_signature, staff_signature_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          submissionId,
          staffRiskAssessment.participantName,
          staffRiskAssessment.dateOfBirth,
          staffRiskAssessment.riskLevel,
          staffRiskAssessment.riskProtectiveFactors,
          staffRiskAssessment.suicidalityHomicidality,
          staffRiskAssessment.possibleInterventions,
          staffRiskAssessment.lowRiskActions || [],
          staffRiskAssessment.moderateHighRiskActions || [],
          staffRiskAssessment.additionalComments,
          staffRiskAssessment.staffSignature,
          staffRiskAssessment.staffSignatureDate
        ]
      );
    }

    // Insert overdose risk screening
    if (overdoseRiskScreening) {
      await client.query(
        `INSERT INTO overdose_risk_screening (
          handbook_submission_id, participant_name, date_of_birth,
          current_heroin_user, current_injector, started_injecting_six_months,
          current_methadone_prescribed, current_methadone_street, not_supervised_consumption,
          also_drinks_alcohol, uses_benzodiazepines, dual_use_heroin_crack,
          prison_hospital_treatment_month, ever_overdosed, overdosed_once_past_year,
          overdosed_twice_past_year, using_more_five_years, using_large_amounts,
          harder_get_buzz, enjoys_big_gouch, prone_low_mood, tends_use_alone,
          has_health_problems, erratic_patterns_use, total_score, risk_level,
          staff_signature, staff_credentials, participant_signature, signature_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)`,
        [
          submissionId,
          overdoseRiskScreening.participantName,
          overdoseRiskScreening.dateOfBirth,
          overdoseRiskScreening.currentHeroinUser,
          overdoseRiskScreening.currentInjector,
          overdoseRiskScreening.startedInjectingSixMonths,
          overdoseRiskScreening.currentMethadonePrescribed,
          overdoseRiskScreening.currentMethadoneStreet,
          overdoseRiskScreening.notSupervisedConsumption,
          overdoseRiskScreening.alsoDrinksAlcohol,
          overdoseRiskScreening.usesBenzodiazepines,
          overdoseRiskScreening.dualUseHeroinCrack,
          overdoseRiskScreening.prisonHospitalTreatmentMonth,
          overdoseRiskScreening.everOverdosed,
          overdoseRiskScreening.overdosedOncePastYear,
          overdoseRiskScreening.overdosedTwicePastYear,
          overdoseRiskScreening.usingMoreFiveYears,
          overdoseRiskScreening.usingLargeAmounts,
          overdoseRiskScreening.harderGetBuzz,
          overdoseRiskScreening.enjoysBigGouch,
          overdoseRiskScreening.proneLowMood,
          overdoseRiskScreening.tendsUseAlone,
          overdoseRiskScreening.hasHealthProblems,
          overdoseRiskScreening.erraticPatternsUse,
          overdoseRiskScreening.totalScore,
          overdoseRiskScreening.riskLevel,
          overdoseRiskScreening.staffSignature,
          overdoseRiskScreening.staffCredentials,
          overdoseRiskScreening.participantSignature,
          overdoseRiskScreening.signatureDate
        ]
      );
    }

    // Insert MAUD/MOUD education (expanded)
    if (maudMoudEducation) {
      await client.query(
        `INSERT INTO maud_moud_education (
          handbook_submission_id,
          education_provided_intake, education_provided_intake_participant_initials, education_provided_intake_staff_initials,
          thorough_education_benefits_risks, thorough_education_benefits_risks_participant_initials, thorough_education_benefits_risks_staff_initials,
          educated_overdose_risks, educated_overdose_risks_participant_initials, educated_overdose_risks_staff_initials,
          educated_naloxone_overview, educated_naloxone_overview_participant_initials, educated_naloxone_overview_staff_initials,
          educated_prescription_pharmacies, educated_prescription_pharmacies_participant_initials, educated_prescription_pharmacies_staff_initials,
          educated_instructions_pir_family, educated_instructions_pir_family_participant_initials, educated_instructions_pir_family_staff_initials,
          educated_naloxone_provided, educated_naloxone_provided_participant_initials, educated_naloxone_provided_staff_initials,
          educated_pharmacies_stock_naloxone, educated_pharmacies_stock_naloxone_participant_initials, educated_pharmacies_stock_naloxone_staff_initials,
          educated_relapse_risk, educated_relapse_risk_participant_initials, educated_relapse_risk_staff_initials,
          educated_relapse_prevention, educated_relapse_prevention_participant_initials, educated_relapse_prevention_staff_initials,
          educated_community_care_website, educated_community_care_website_participant_initials, educated_community_care_website_staff_initials,
          educated_triggers_cravings, educated_triggers_cravings_participant_initials, educated_triggers_cravings_staff_initials,
          educated_rights_freedom_choice, educated_rights_freedom_choice_participant_initials, educated_rights_freedom_choice_staff_initials,
          educated_medication_access_instructions, educated_medication_access_instructions_participant_initials, educated_medication_access_instructions_staff_initials,
          participant_signature, participant_signature_date, staff_signature, staff_signature_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52)`,
        [
          submissionId,
          maudMoudEducation.educationProvidedIntake || false,
          maudMoudEducation.educationProvidedIntakeParticipantInitials,
          maudMoudEducation.educationProvidedIntakeStaffInitials,
          maudMoudEducation.thoroughEducationBenefitsRisks || false,
          maudMoudEducation.thoroughEducationBenefitsRisksParticipantInitials,
          maudMoudEducation.thoroughEducationBenefitsRisksStaffInitials,
          maudMoudEducation.educatedOverdoseRisks || false,
          maudMoudEducation.educatedOverdoseRisksParticipantInitials,
          maudMoudEducation.educatedOverdoseRisksStaffInitials,
          maudMoudEducation.educatedNaloxoneOverview || false,
          maudMoudEducation.educatedNaloxoneOverviewParticipantInitials,
          maudMoudEducation.educatedNaloxoneOverviewStaffInitials,
          maudMoudEducation.educatedPrescriptionPharmacies || false,
          maudMoudEducation.educatedPrescriptionPharmaciesParticipantInitials,
          maudMoudEducation.educatedPrescriptionPharmaciesStaffInitials,
          maudMoudEducation.educatedInstructionsPirFamily || false,
          maudMoudEducation.educatedInstructionsPirFamilyParticipantInitials,
          maudMoudEducation.educatedInstructionsPirFamilyStaffInitials,
          maudMoudEducation.educatedNaloxoneProvided || false,
          maudMoudEducation.educatedNaloxoneProvidedParticipantInitials,
          maudMoudEducation.educatedNaloxoneProvidedStaffInitials,
          maudMoudEducation.educatedPharmaciesStockNaloxone || false,
          maudMoudEducation.educatedPharmaciesStockNaloxoneParticipantInitials,
          maudMoudEducation.educatedPharmaciesStockNaloxoneStaffInitials,
          maudMoudEducation.educatedRelapseRisk || false,
          maudMoudEducation.educatedRelapseRiskParticipantInitials,
          maudMoudEducation.educatedRelapseRiskStaffInitials,
          maudMoudEducation.educatedRelapsePrevention || false,
          maudMoudEducation.educatedRelapsePreventionParticipantInitials,
          maudMoudEducation.educatedRelapsePreventionStaffInitials,
          maudMoudEducation.educatedCommunityCareWebsite || false,
          maudMoudEducation.educatedCommunityCareWebsiteParticipantInitials,
          maudMoudEducation.educatedCommunityCareWebsiteStaffInitials,
          maudMoudEducation.educatedTriggersCravings || false,
          maudMoudEducation.educatedTriggersCravingsParticipantInitials,
          maudMoudEducation.educatedTriggersCravingsStaffInitials,
          maudMoudEducation.educatedRightsFreedomChoice || false,
          maudMoudEducation.educatedRightsFreedomChoiceParticipantInitials,
          maudMoudEducation.educatedRightsFreedomChoiceStaffInitials,
          maudMoudEducation.educatedMedicationAccessInstructions || false,
          maudMoudEducation.educatedMedicationAccessInstructionsParticipantInitials,
          maudMoudEducation.educatedMedicationAccessInstructionsStaffInitials,
          maudMoudEducation.participantSignature,
          maudMoudEducation.participantSignatureDate,
          maudMoudEducation.staffSignature,
          maudMoudEducation.staffSignatureDate
        ]
      );
    }

    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Handbook submission saved successfully',
      data: { submissionId }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error submitting handbook:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit handbook form'
    });
  } finally {
    client.release();
  }
});

// Get all handbook submissions
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM handbook_submissions';
    let countQuery = 'SELECT COUNT(*) FROM handbook_submissions';
    const params = [];
    
    if (search) {
      query += ' WHERE participant_name ILIKE $1';
      countQuery += ' WHERE participant_name ILIKE $1';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const [results, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, search ? [params[0]] : [])
    ]);
    
    res.json({
      success: true,
      data: results.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching handbook submissions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch handbook submissions'
    });
  }
});

// Get handbook submission by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const submission = await pool.query(
      'SELECT * FROM handbook_submissions WHERE id = $1',
      [id]
    );
    
    if (submission.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Handbook submission not found'
      });
    }
    
    // Fetch all related form data
    const [
      consent,
      privacy,
      recording,
      covid19,
      rights,
      tobacco,
      suicide,
      homicide,
      staffRisk,
      overdose,
      maud
    ] = await Promise.all([
      pool.query('SELECT * FROM consent_to_participate WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM privacy_practices_ack WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM recording_authorization WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM covid19_screening WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM rights_acknowledgment WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM tobacco_cessation WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM suicide_risk_screening WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM homicide_risk_assessment WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM staff_risk_assessment WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM overdose_risk_screening WHERE handbook_submission_id = $1', [id]),
      pool.query('SELECT * FROM maud_moud_education WHERE handbook_submission_id = $1', [id])
    ]);
    
    res.json({
      success: true,
      data: {
        ...submission.rows[0],
        consentToParticipate: consent.rows[0] || null,
        privacyPractices: privacy.rows[0] || null,
        recordingAuthorization: recording.rows[0] || null,
        covid19Screening: covid19.rows[0] || null,
        rightsAcknowledgment: rights.rows[0] || null,
        tobaccoCessation: tobacco.rows[0] || null,
        suicideRiskScreening: suicide.rows[0] || null,
        homicideRiskAssessment: homicide.rows[0] || null,
        staffRiskAssessment: staffRisk.rows[0] || null,
        overdoseRiskScreening: overdose.rows[0] || null,
        maudMoudEducation: maud.rows[0] || null
      }
    });
  } catch (error) {
    console.error('Error fetching handbook submission:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch handbook submission'
    });
  }
});

export default router;

