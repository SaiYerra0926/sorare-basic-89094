import express from 'express';
import pool from '../database/config.js';

const router = express.Router();

// Create a new encounter
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
    
    if (!req.body.typeOfContact) {
      return res.status(400).json({
        success: false,
        message: 'Type of contact is required',
        error: 'Missing type of contact'
      });
    }
    
    if (!req.body.recoveryInterventions) {
      return res.status(400).json({
        success: false,
        message: 'Recovery interventions is required',
        error: 'Missing recovery interventions'
      });
    }
    
    if (!req.body.locationOfService) {
      return res.status(400).json({
        success: false,
        message: 'Location of service is required',
        error: 'Missing location of service'
      });
    }
    
    if (!req.body.serviceLog || !Array.isArray(req.body.serviceLog) || req.body.serviceLog.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one service log entry is required',
        error: 'Service log array is required and must not be empty'
      });
    }
    
    await client.query('BEGIN');
    
    // Helper function to clean values
    const cleanValue = (val) => (val && val.trim() !== '') ? val.trim() : null;
    
    // Insert main encounter record
    const encounterResult = await client.query(
      `INSERT INTO encounters (
        participant_name, ma_id, chart_number, dsm5,
        type_of_contact, type_of_contact_other,
        recovery_interventions, location_of_service, location_of_service_details,
        goal, objective, service_description, peer_comments, plan_for_next_session
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id`,
      [
        req.body.participantName.trim(),
        cleanValue(req.body.maId),
        cleanValue(req.body.chartNumber),
        cleanValue(req.body.dsm5),
        req.body.typeOfContact,
        cleanValue(req.body.typeOfContactOther),
        req.body.recoveryInterventions,
        req.body.locationOfService,
        cleanValue(req.body.locationOfServiceDetails),
        cleanValue(req.body.goal),
        cleanValue(req.body.objective),
        cleanValue(req.body.serviceDescription),
        cleanValue(req.body.peerComments),
        cleanValue(req.body.planForNextSession),
      ]
    );
    
    const encounterId = encounterResult.rows[0].id;
    
    // Insert service log entries
    for (const logEntry of req.body.serviceLog) {
      if (!logEntry.date || !logEntry.startTime || !logEntry.endTime || !logEntry.units) {
        throw new Error('Service log entry is missing required fields (date, startTime, endTime, or units)');
      }
      
      await client.query(
        `INSERT INTO encounter_service_logs (
          encounter_id, date, start_time, end_time, units,
          participant_signature, staff_signature
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          encounterId,
          logEntry.date,
          logEntry.startTime,
          logEntry.endTime,
          logEntry.units.trim(),
          logEntry.participantSignature || null,
          logEntry.staffSignature || null,
        ]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Encounter form submitted successfully',
      data: {
        encounterId: encounterId
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating encounter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit encounter form',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get all encounters (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM encounters');
    const total = parseInt(countResult.rows[0].count);
    
    // Get encounters with pagination
    const result = await pool.query(
      `SELECT * FROM encounters 
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
    console.error('Error fetching encounters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch encounters',
      error: error.message
    });
  }
});

// Get a specific encounter by ID
router.get('/:id', async (req, res) => {
  try {
    const encounterId = parseInt(req.params.id);
    
    if (isNaN(encounterId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid encounter ID',
        error: 'Encounter ID must be a number'
      });
    }
    
    // Get encounter
    const encounterResult = await pool.query(
      'SELECT * FROM encounters WHERE id = $1',
      [encounterId]
    );
    
    if (encounterResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Encounter not found',
        error: `No encounter found with ID ${encounterId}`
      });
    }
    
    // Get service logs for this encounter
    const serviceLogsResult = await pool.query(
      'SELECT * FROM encounter_service_logs WHERE encounter_id = $1 ORDER BY date, start_time',
      [encounterId]
    );
    
    const encounter = encounterResult.rows[0];
    encounter.serviceLogs = serviceLogsResult.rows;
    
    res.json({
      success: true,
      data: encounter
    });
  } catch (error) {
    console.error('Error fetching encounter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch encounter',
      error: error.message
    });
  }
});

// Get master data for dropdowns
router.get('/master-data/type-of-contact', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT value, label FROM encounter_type_of_contact WHERE is_active = TRUE ORDER BY display_order, label'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching type of contact options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch type of contact options',
      error: error.message
    });
  }
});

router.get('/master-data/recovery-interventions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT value, label FROM encounter_recovery_interventions WHERE is_active = TRUE ORDER BY display_order, label'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching recovery interventions options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recovery interventions options',
      error: error.message
    });
  }
});

router.get('/master-data/location-of-service', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT value, label FROM encounter_location_of_service WHERE is_active = TRUE ORDER BY display_order, label'
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching location of service options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location of service options',
      error: error.message
    });
  }
});

export default router;

