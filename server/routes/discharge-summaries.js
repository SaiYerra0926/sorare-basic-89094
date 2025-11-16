import express from 'express';
import pool from '../database/config.js';

const router = express.Router();

// Create a new Discharge Summary
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    // Validate required fields
    if (!req.body.participantName) {
      return res.status(400).json({
        success: false,
        message: 'Participant name is required',
        error: 'Missing participant name'
      });
    }
    
    if (!req.body.dateOfReferral) {
      return res.status(400).json({
        success: false,
        message: 'Date of referral is required',
        error: 'Missing date of referral'
      });
    }
    
    if (!req.body.dateOfAdmission) {
      return res.status(400).json({
        success: false,
        message: 'Date of admission is required',
        error: 'Missing date of admission'
      });
    }
    
    if (!req.body.dateOfDischarge) {
      return res.status(400).json({
        success: false,
        message: 'Date of discharge is required',
        error: 'Missing date of discharge'
      });
    }
    
    if (!req.body.dischargeFromServices || !Array.isArray(req.body.dischargeFromServices) || req.body.dischargeFromServices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one service must be selected',
        error: 'Discharge from services array is required and must not be empty'
      });
    }
    
    if (!req.body.natureOfDischargeCriteria || !Array.isArray(req.body.natureOfDischargeCriteria) || req.body.natureOfDischargeCriteria.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one discharge criteria must be selected',
        error: 'Nature of discharge criteria array is required and must not be empty'
      });
    }
    
    if (!req.body.staffSignatureDate) {
      return res.status(400).json({
        success: false,
        message: 'Staff signature date is required',
        error: 'Missing staff signature date'
      });
    }
    
    await client.query('BEGIN');
    
    // Helper function to clean values
    const cleanValue = (val) => (val && val.trim() !== '') ? val.trim() : null;
    
    // Insert main discharge summary record
    const dischargeResult = await client.query(
      `INSERT INTO discharge_summaries (
        participant_name, date_of_referral, primary_diagnosis,
        ma_number, date_of_admission, date_of_discharge,
        cps_crs_program_hours_completed, date_letter_sent,
        reason_for_discharge, referrals, after_care_plan,
        staff_signature, staff_credential, staff_signature_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id`,
      [
        req.body.participantName.trim(),
        req.body.dateOfReferral,
        cleanValue(req.body.primaryDiagnosis),
        cleanValue(req.body.maNumber),
        req.body.dateOfAdmission,
        req.body.dateOfDischarge,
        cleanValue(req.body.cpsCrsProgramHoursCompleted),
        req.body.dateLetterSent || null,
        cleanValue(req.body.reasonForDischarge),
        cleanValue(req.body.referrals),
        cleanValue(req.body.afterCarePlan),
        req.body.staffSignature || null,
        cleanValue(req.body.staffCredential),
        req.body.staffSignatureDate,
      ]
    );
    
    const dischargeId = dischargeResult.rows[0].id;
    
    // Insert discharge from services
    if (req.body.dischargeFromServices && Array.isArray(req.body.dischargeFromServices)) {
      for (const service of req.body.dischargeFromServices) {
        await client.query(
          'INSERT INTO discharge_summary_services (discharge_summary_id, service_value) VALUES ($1, $2)',
          [dischargeId, service]
        );
      }
    }
    
    // Insert nature of discharge criteria
    if (req.body.natureOfDischargeCriteria && Array.isArray(req.body.natureOfDischargeCriteria)) {
      for (const criteria of req.body.natureOfDischargeCriteria) {
        await client.query(
          'INSERT INTO discharge_summary_criteria (discharge_summary_id, criteria_value) VALUES ($1, $2)',
          [dischargeId, criteria]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Discharge Summary submitted successfully',
      data: {
        dischargeId: dischargeId
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating Discharge Summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit Discharge Summary',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get all discharge summaries (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM discharge_summaries');
    const total = parseInt(countResult.rows[0].count);
    
    // Get discharge summaries with pagination
    const result = await pool.query(
      `SELECT * FROM discharge_summaries 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching Discharge Summaries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Discharge Summaries',
      error: error.message
    });
  }
});

// Get a specific discharge summary by ID
router.get('/:id', async (req, res) => {
  try {
    const dischargeId = parseInt(req.params.id);
    
    if (isNaN(dischargeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discharge summary ID',
        error: 'Discharge summary ID must be a number'
      });
    }
    
    // Get discharge summary
    const dischargeResult = await pool.query(
      'SELECT * FROM discharge_summaries WHERE id = $1',
      [dischargeId]
    );
    
    if (dischargeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Discharge summary not found',
        error: `No discharge summary found with ID ${dischargeId}`
      });
    }
    
    // Get all related data
    const [services, criteria] = await Promise.all([
      pool.query('SELECT service_value FROM discharge_summary_services WHERE discharge_summary_id = $1', [dischargeId]),
      pool.query('SELECT criteria_value FROM discharge_summary_criteria WHERE discharge_summary_id = $1', [dischargeId]),
    ]);
    
    const discharge = dischargeResult.rows[0];
    discharge.dischargeFromServices = services.rows.map(r => r.service_value);
    discharge.natureOfDischargeCriteria = criteria.rows.map(r => r.criteria_value);
    
    res.json({
      success: true,
      data: discharge
    });
  } catch (error) {
    console.error('Error fetching Discharge Summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Discharge Summary',
      error: error.message
    });
  }
});

// Get master data for options
router.get('/master-data/services', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT value, label FROM discharge_services_options WHERE is_active = TRUE ORDER BY display_order, label'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching services options:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services options', error: error.message });
  }
});

router.get('/master-data/criteria', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT value, label FROM discharge_criteria_options WHERE is_active = TRUE ORDER BY display_order, label'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching criteria options:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch criteria options', error: error.message });
  }
});

export default router;

