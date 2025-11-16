import express from 'express';
import pool from '../database/config.js';

const router = express.Router();

// Create a new SNAP Assessment
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
    
    if (!req.body.todaysDate) {
      return res.status(400).json({
        success: false,
        message: 'Today\'s date is required',
        error: 'Missing today\'s date'
      });
    }
    
    await client.query('BEGIN');
    
    // Helper function to clean values
    const cleanValue = (val) => (val && val.trim() !== '') ? val.trim() : null;
    
    // Insert main assessment record
    const assessmentResult = await client.query(
      `INSERT INTO snap_assessments (
        participant_name, todays_date,
        strengths_other, needs_other, abilities_other,
        preferences_learn_better, preferences_living_situation, preferences_living_situation_other,
        preferences_interested_in_other,
        participant_signature, participant_signature_date,
        staff_signature, staff_title, staff_signature_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id`,
      [
        req.body.participantName.trim(),
        req.body.todaysDate,
        cleanValue(req.body.strengthsOther),
        cleanValue(req.body.needsOther),
        cleanValue(req.body.abilitiesOther),
        cleanValue(req.body.preferencesLearnBetter),
        cleanValue(req.body.preferencesLivingSituation),
        cleanValue(req.body.preferencesLivingSituationOther),
        cleanValue(req.body.preferencesInterestedInOther),
        req.body.participantSignature || null,
        req.body.participantSignatureDate || null,
        req.body.staffSignature || null,
        cleanValue(req.body.staffTitle),
        req.body.staffSignatureDate || null,
      ]
    );
    
    const assessmentId = assessmentResult.rows[0].id;
    
    // Insert strengths
    if (req.body.strengths && Array.isArray(req.body.strengths)) {
      for (const strength of req.body.strengths) {
        await client.query(
          'INSERT INTO snap_assessment_strengths (assessment_id, strength_value) VALUES ($1, $2)',
          [assessmentId, strength]
        );
      }
    }
    
    // Insert needs
    if (req.body.needs && Array.isArray(req.body.needs)) {
      for (const need of req.body.needs) {
        await client.query(
          'INSERT INTO snap_assessment_needs (assessment_id, need_value) VALUES ($1, $2)',
          [assessmentId, need]
        );
      }
    }
    
    // Insert abilities
    if (req.body.abilities && Array.isArray(req.body.abilities)) {
      for (const ability of req.body.abilities) {
        await client.query(
          'INSERT INTO snap_assessment_abilities (assessment_id, ability_value) VALUES ($1, $2)',
          [assessmentId, ability]
        );
      }
    }
    
    // Insert preferences
    if (req.body.preferences && Array.isArray(req.body.preferences)) {
      for (const preference of req.body.preferences) {
        await client.query(
          'INSERT INTO snap_assessment_preferences (assessment_id, preference_value) VALUES ($1, $2)',
          [assessmentId, preference]
        );
      }
    }
    
    // Insert preferences interested in
    if (req.body.preferencesInterestedIn && Array.isArray(req.body.preferencesInterestedIn)) {
      for (const interestedIn of req.body.preferencesInterestedIn) {
        await client.query(
          'INSERT INTO snap_assessment_preferences_interested_in (assessment_id, interested_in_value) VALUES ($1, $2)',
          [assessmentId, interestedIn]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'SNAP Assessment submitted successfully',
      data: {
        assessmentId: assessmentId
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating SNAP Assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit SNAP Assessment',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get all assessments (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM snap_assessments');
    const total = parseInt(countResult.rows[0].count);
    
    // Get assessments with pagination
    const result = await pool.query(
      `SELECT * FROM snap_assessments 
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
    console.error('Error fetching SNAP Assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SNAP Assessments',
      error: error.message
    });
  }
});

// Get a specific assessment by ID
router.get('/:id', async (req, res) => {
  try {
    const assessmentId = parseInt(req.params.id);
    
    if (isNaN(assessmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assessment ID',
        error: 'Assessment ID must be a number'
      });
    }
    
    // Get assessment
    const assessmentResult = await pool.query(
      'SELECT * FROM snap_assessments WHERE id = $1',
      [assessmentId]
    );
    
    if (assessmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
        error: `No assessment found with ID ${assessmentId}`
      });
    }
    
    // Get all related data
    const [strengths, needs, abilities, preferences, interestedIn] = await Promise.all([
      pool.query('SELECT strength_value FROM snap_assessment_strengths WHERE assessment_id = $1', [assessmentId]),
      pool.query('SELECT need_value FROM snap_assessment_needs WHERE assessment_id = $1', [assessmentId]),
      pool.query('SELECT ability_value FROM snap_assessment_abilities WHERE assessment_id = $1', [assessmentId]),
      pool.query('SELECT preference_value FROM snap_assessment_preferences WHERE assessment_id = $1', [assessmentId]),
      pool.query('SELECT interested_in_value FROM snap_assessment_preferences_interested_in WHERE assessment_id = $1', [assessmentId]),
    ]);
    
    const assessment = assessmentResult.rows[0];
    assessment.strengths = strengths.rows.map(r => r.strength_value);
    assessment.needs = needs.rows.map(r => r.need_value);
    assessment.abilities = abilities.rows.map(r => r.ability_value);
    assessment.preferences = preferences.rows.map(r => r.preference_value);
    assessment.preferencesInterestedIn = interestedIn.rows.map(r => r.interested_in_value);
    
    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Error fetching SNAP Assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SNAP Assessment',
      error: error.message
    });
  }
});

// Get master data for options
router.get('/master-data/strengths', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT value, label FROM snap_strengths_options WHERE is_active = TRUE ORDER BY display_order, label'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching strengths options:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch strengths options', error: error.message });
  }
});

router.get('/master-data/needs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT value, label FROM snap_needs_options WHERE is_active = TRUE ORDER BY display_order, label'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching needs options:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch needs options', error: error.message });
  }
});

router.get('/master-data/abilities', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT value, label FROM snap_abilities_options WHERE is_active = TRUE ORDER BY display_order, label'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching abilities options:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch abilities options', error: error.message });
  }
});

export default router;

