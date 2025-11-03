import express from 'express';
import pool from '../database/config.js';

const router = express.Router();

// Create a new referral
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    // Validate required fields
    if (!req.body.referralDate) {
      return res.status(400).json({
        success: false,
        message: 'Referral date is required',
        error: 'Missing referral date'
      });
    }
    
    if (!req.body.services || !Array.isArray(req.body.services) || req.body.services.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one service must be selected',
        error: 'Services array is required and must not be empty'
      });
    }
    
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
        error: 'Missing name'
      });
    }
    
    if (!req.body.birthDate) {
      return res.status(400).json({
        success: false,
        message: 'Birth date is required',
        error: 'Missing birth date'
      });
    }
    
    if (!req.body.gender) {
      return res.status(400).json({
        success: false,
        message: 'Gender is required',
        error: 'Missing gender'
      });
    }
    
    if (!req.body.race) {
      return res.status(400).json({
        success: false,
        message: 'Race is required',
        error: 'Missing race'
      });
    }
    
    if (!req.body.referredByName) {
      return res.status(400).json({
        success: false,
        message: 'Referrer name is required',
        error: 'Missing referrer name'
      });
    }
    
    await client.query('BEGIN');
    
    // Insert main referral record - ensure services is an array
    const servicesArray = Array.isArray(req.body.services) ? req.body.services : [req.body.services].filter(Boolean);
    
    const referralResult = await client.query(
      `INSERT INTO referrals (referral_date, services) 
       VALUES ($1, $2) 
       RETURNING id`,
      [req.body.referralDate, servicesArray]
    );
    
    const referralId = referralResult.rows[0].id;
    
    // Insert personal information
    // Handle empty strings as null
    const cleanValue = (val) => (val && val.trim() !== '') ? val.trim() : null;
    
    await client.query(
      `INSERT INTO personal_info (
        referral_id, name, pronouns, legal_name, birth_date, is_homeless,
        address, city_state_zip, home_phone, cell_phone, ssn, email,
        medical_assistance_id, medical_assistance_provider, gender, gender_other, race, race_other
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        referralId,
        req.body.name.trim(),
        cleanValue(req.body.pronouns),
        cleanValue(req.body.legalName),
        req.body.birthDate,
        req.body.isHomeless || false,
        cleanValue(req.body.address),
        cleanValue(req.body.cityStateZip),
        cleanValue(req.body.homePhone),
        cleanValue(req.body.cellPhone),
        cleanValue(req.body.ssn),
        cleanValue(req.body.email),
        cleanValue(req.body.medicalAssistanceId),
        cleanValue(req.body.medicalAssistanceProvider),
        req.body.gender,
        cleanValue(req.body.genderOther),
        req.body.race,
        cleanValue(req.body.raceOther),
      ]
    );
    
    // Insert screening information
    await client.query(
      `INSERT INTO screening_info (
        referral_id, is_pregnant, drug_of_choice, last_date_of_use,
        mental_health_conditions, diagnosis, medical_conditions, allergies,
        physical_limitations, medications, tobacco_user, criminal_offenses, probation_parole
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        referralId,
        cleanValue(req.body.isPregnant),
        cleanValue(req.body.drugOfChoice),
        cleanValue(req.body.lastDateOfUse),
        cleanValue(req.body.mentalHealthConditions),
        cleanValue(req.body.diagnosis),
        cleanValue(req.body.medicalConditions),
        cleanValue(req.body.allergies),
        cleanValue(req.body.physicalLimitations),
        cleanValue(req.body.medications),
        cleanValue(req.body.tobaccoUser),
        cleanValue(req.body.criminalOffenses),
        cleanValue(req.body.probationParole),
      ]
    );
    
    // Insert priority populations
    if (req.body.priorityPopulations && req.body.priorityPopulations.length > 0) {
      for (const pop of req.body.priorityPopulations) {
        await client.query(
          `INSERT INTO referral_priority_populations (referral_id, priority_population) 
           VALUES ($1, $2)`,
          [referralId, pop]
        );
      }
    }
    
    // Insert emergency contact
    await client.query(
      `INSERT INTO emergency_contacts (
        referral_id, name, relationship, phone, address, city_state_zip, cell_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        referralId,
        cleanValue(req.body.emergencyContactName),
        cleanValue(req.body.emergencyContactRelationship),
        cleanValue(req.body.emergencyContactPhone),
        cleanValue(req.body.emergencyContactAddress),
        cleanValue(req.body.emergencyContactCityStateZip),
        cleanValue(req.body.emergencyContactCellPhone),
      ]
    );
    
    // Insert referrer information
    await client.query(
      `INSERT INTO referrers (
        referral_id, name, title, agency, phone, email, signature
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        referralId,
        req.body.referredByName.trim(),
        cleanValue(req.body.referredByTitle),
        cleanValue(req.body.referredByAgency),
        cleanValue(req.body.referredByPhone),
        cleanValue(req.body.referredByEmail),
        cleanValue(req.body.referredBySignature),
      ]
    );
    
    // Insert applicant signature
    const applicantSig = cleanValue(req.body.applicantSignature);
    const applicantSigDate = cleanValue(req.body.applicantSignatureDate);
    
    if (applicantSig || applicantSigDate) {
      await client.query(
        `INSERT INTO applicant_signatures (
          referral_id, signature, signature_date
        ) VALUES ($1, $2, $3)`,
        [
          referralId,
          applicantSig,
          applicantSigDate,
        ]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Referral submitted successfully',
      data: {
        referralId: referralId
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating referral:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    res.status(500).json({
      success: false,
      message: 'Failed to submit referral',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    client.release();
  }
});

// Get count of completed referrals (referrals with applicant signatures)
// MUST come before /:id to avoid route conflicts
router.get('/count/completed', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(DISTINCT r.id) as count
       FROM referrals r
       INNER JOIN applicant_signatures aps ON r.id = aps.referral_id
       WHERE aps.signature IS NOT NULL AND aps.signature != ''`
    );
    
    res.json({
      success: true,
      data: {
        count: parseInt(result.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching completed referrals count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completed referrals count',
      error: error.message
    });
  }
});

// Get completed referrals with search and filter
// MUST come before /:id to avoid route conflicts
router.get('/completed', async (req, res) => {
  try {
    // Parse and validate query parameters with defaults - ensure no NaN
    const search = String(req.query.search || '').trim();
    const startDate = String(req.query.startDate || '').trim();
    const endDate = String(req.query.endDate || '').trim();
    
    // Safely parse page and limit, ensuring they're valid numbers
    const pageParam = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limitParam = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;
    
    // Validate page and limit are positive numbers, default if invalid or NaN
    const validPage = (pageParam > 0 && !isNaN(pageParam) && isFinite(pageParam)) ? pageParam : 1;
    const validLimit = (limitParam > 0 && !isNaN(limitParam) && isFinite(limitParam)) ? limitParam : 50;
    const offset = Math.max(0, (validPage - 1) * validLimit);
    
    let query = `
      SELECT r.id, r.referral_date, r.created_at,
             pi.name, 
             pi.address, 
             pi.cell_phone as phone, 
             pi.email, 
             pi.medical_assistance_provider,
             pi.gender,
             ref.name as referrer_name, ref.agency as referrer_agency,
             aps.signature_date as completed_date
      FROM referrals r
      INNER JOIN applicant_signatures aps ON r.id = aps.referral_id
      LEFT JOIN personal_info pi ON r.id = pi.referral_id
      LEFT JOIN referrers ref ON r.id = ref.referral_id
      WHERE aps.signature IS NOT NULL AND aps.signature != ''
    `;
    
    const params = [];
    let paramCount = 1;
    
    // Search filter
    if (search && search.trim() !== '') {
      query += ` AND (
        pi.name ILIKE $${paramCount} OR 
        pi.email ILIKE $${paramCount} OR 
        pi.cell_phone ILIKE $${paramCount} OR
        ref.name ILIKE $${paramCount} OR
        ref.agency ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
      paramCount++;
    }
    
    // Date range filter
    if (startDate && startDate.trim() !== '') {
      query += ` AND r.referral_date >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }
    
    if (endDate && endDate.trim() !== '') {
      query += ` AND r.referral_date <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }
    
    // Ensure LIMIT and OFFSET are valid integers
    const limitValue = Number.isInteger(validLimit) ? validLimit : 50;
    const offsetValue = Number.isInteger(offset) && offset >= 0 ? offset : 0;
    
    query += ` ORDER BY r.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limitValue, offsetValue);
    
    console.log('Executing query:', query);
    console.log('Query params:', params);
    console.log('validPage:', validPage, 'limitValue:', limitValue, 'offsetValue:', offsetValue);
    console.log('All params are numbers?', params.every(p => typeof p === 'number' && !isNaN(p)));
    
    const result = await pool.query(query, params);
    
    console.log('Query result:', result.rows.length, 'rows');
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT r.id) as total
      FROM referrals r
      INNER JOIN applicant_signatures aps ON r.id = aps.referral_id
      LEFT JOIN personal_info pi ON r.id = pi.referral_id
      LEFT JOIN referrers ref ON r.id = ref.referral_id
      WHERE aps.signature IS NOT NULL AND aps.signature != ''
    `;
    
    const countParams = [];
    let countParamCount = 1;
    
    if (search && search.trim() !== '') {
      countQuery += ` AND (
        pi.name ILIKE $${countParamCount} OR 
        pi.email ILIKE $${countParamCount} OR 
        pi.cell_phone ILIKE $${countParamCount} OR
        ref.name ILIKE $${countParamCount} OR
        ref.agency ILIKE $${countParamCount}
      )`;
      countParams.push(`%${search}%`);
      countParamCount++;
    }
    
    if (startDate && startDate.trim() !== '') {
      countQuery += ` AND r.referral_date >= $${countParamCount}`;
      countParams.push(startDate);
      countParamCount++;
    }
    
    if (endDate && endDate.trim() !== '') {
      countQuery += ` AND r.referral_date <= $${countParamCount}`;
      countParams.push(endDate);
      countParamCount++;
    }
    
    const countResult = await pool.query(countQuery, countParams);
    
    const totalCount = parseInt(countResult.rows[0]?.total || '0') || 0;
    
    // Ensure all IDs are proper integers (PostgreSQL may return BigInt)
    const referrals = (result.rows || []).map(row => ({
      ...row,
      id: typeof row.id === 'bigint' ? Number(row.id) : (typeof row.id === 'string' ? parseInt(row.id, 10) : row.id)
    }));
    
    console.log('Returning referrals:', referrals.length);
    if (referrals.length > 0) {
      console.log('First referral ID:', referrals[0].id, 'Type:', typeof referrals[0].id);
    }
    
    res.json({
      success: true,
      data: referrals,
      pagination: {
        total: totalCount,
        page: validPage,
        limit: validLimit,
        totalPages: validLimit > 0 ? Math.ceil(totalCount / validLimit) : 1
      }
    });
  } catch (error) {
    console.error('Error fetching completed referrals:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completed referrals',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get all referrals
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, 
              pi.name, pi.email, pi.cell_phone,
              ref.name as referrer_name
       FROM referrals r
       LEFT JOIN personal_info pi ON r.id = pi.referral_id
       LEFT JOIN referrers ref ON r.id = ref.referral_id
       ORDER BY r.created_at DESC
       LIMIT 100`
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referrals',
      error: error.message
    });
  }
});

// Get a specific referral by ID
// MUST come last to avoid route conflicts with /count/completed and /completed
router.get('/:id', async (req, res) => {
  try {
    // Validate and parse the ID parameter
    const idParam = req.params.id;
    console.log('Received ID parameter:', idParam, 'Type:', typeof idParam);
    
    // Check if ID parameter is missing or empty
    if (!idParam || (typeof idParam === 'string' && idParam.trim() === '')) {
      console.error('Invalid ID parameter: empty or missing');
      return res.status(400).json({
        success: false,
        message: 'Invalid referral ID',
        error: 'Referral ID is required'
      });
    }
    
    // Parse the ID - handle both string and number inputs
    let referralId;
    if (typeof idParam === 'number') {
      referralId = idParam;
    } else if (typeof idParam === 'string') {
      // Remove any whitespace and try to parse
      const cleanedId = idParam.trim();
      referralId = parseInt(cleanedId, 10);
    } else {
      console.error('Invalid ID parameter type:', typeof idParam);
      return res.status(400).json({
        success: false,
        message: 'Invalid referral ID',
        error: 'Referral ID must be a number or numeric string'
      });
    }
    
    console.log('Parsed referral ID:', referralId);
    
    // Validate that the ID is a valid positive integer
    if (isNaN(referralId) || !isFinite(referralId) || referralId <= 0 || !Number.isInteger(referralId)) {
      console.error('Invalid referral ID after parsing:', referralId);
      return res.status(400).json({
        success: false,
        message: 'Invalid referral ID',
        error: `Referral ID must be a positive integer. Received: ${idParam} (parsed as: ${referralId})`
      });
    }
    
    const referralResult = await pool.query(
      'SELECT * FROM referrals WHERE id = $1',
      [referralId]
    );
    
    if (referralResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Referral not found'
      });
    }
    
    const personalInfo = await pool.query(
      'SELECT * FROM personal_info WHERE referral_id = $1',
      [referralId]
    );
    
    const screeningInfo = await pool.query(
      'SELECT * FROM screening_info WHERE referral_id = $1',
      [referralId]
    );
    
    const priorityPopulations = await pool.query(
      'SELECT priority_population FROM referral_priority_populations WHERE referral_id = $1',
      [referralId]
    );
    
    const emergencyContact = await pool.query(
      'SELECT * FROM emergency_contacts WHERE referral_id = $1',
      [referralId]
    );
    
    const referrer = await pool.query(
      'SELECT * FROM referrers WHERE referral_id = $1',
      [referralId]
    );
    
    const applicantSignature = await pool.query(
      'SELECT * FROM applicant_signatures WHERE referral_id = $1',
      [referralId]
    );
    
    res.json({
      success: true,
      data: {
        referral: referralResult.rows[0],
        personalInfo: personalInfo.rows[0] || null,
        screeningInfo: screeningInfo.rows[0] || null,
        priorityPopulations: priorityPopulations.rows.map(r => r.priority_population),
        emergencyContact: emergencyContact.rows[0] || null,
        referrer: referrer.rows[0] || null,
        applicantSignature: applicantSignature.rows[0] || null,
      }
    });
  } catch (error) {
    console.error('Error fetching referral:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referral',
      error: error.message
    });
  }
});

export default router;

