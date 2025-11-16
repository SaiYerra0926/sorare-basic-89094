import express from 'express';
import pool from '../database/config.js';

const router = express.Router();

// Create a new WRAP Plan
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Helper function to clean values
    const cleanValue = (val) => (val && val.trim() !== '') ? val.trim() : null;
    
    // Insert main WRAP plan record
    const wrapPlanResult = await client.query(
      `INSERT INTO wrap_plans (
        daily_maintenance_plan,
        triggers_action_plan,
        early_warning_signs_action_plan,
        breaking_down_action_plan,
        crisis_plan,
        post_crisis_plan
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [
        cleanValue(req.body.dailyMaintenancePlan),
        cleanValue(req.body.triggersActionPlan),
        cleanValue(req.body.earlyWarningSignsActionPlan),
        cleanValue(req.body.breakingDownActionPlan),
        cleanValue(req.body.crisisPlan),
        cleanValue(req.body.postCrisisPlan),
      ]
    );
    
    const wrapPlanId = wrapPlanResult.rows[0].id;
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'WRAP Plan submitted successfully',
      data: {
        wrapPlanId: wrapPlanId
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating WRAP Plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit WRAP Plan',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get all WRAP plans (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM wrap_plans');
    const total = parseInt(countResult.rows[0].count);
    
    // Get WRAP plans with pagination
    const result = await pool.query(
      `SELECT * FROM wrap_plans 
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
    console.error('Error fetching WRAP Plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch WRAP Plans',
      error: error.message
    });
  }
});

// Get a specific WRAP plan by ID
router.get('/:id', async (req, res) => {
  try {
    const wrapPlanId = parseInt(req.params.id);
    
    if (isNaN(wrapPlanId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid WRAP plan ID',
        error: 'WRAP plan ID must be a number'
      });
    }
    
    // Get WRAP plan
    const wrapPlanResult = await pool.query(
      'SELECT * FROM wrap_plans WHERE id = $1',
      [wrapPlanId]
    );
    
    if (wrapPlanResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'WRAP plan not found',
        error: `No WRAP plan found with ID ${wrapPlanId}`
      });
    }
    
    res.json({
      success: true,
      data: wrapPlanResult.rows[0]
    });
  } catch (error) {
    console.error('Error fetching WRAP Plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch WRAP Plan',
      error: error.message
    });
  }
});

export default router;

