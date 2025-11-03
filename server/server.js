import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import referralsRouter from './routes/referrals.js';
import pool from './database/config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Add startup logging
console.log('🚀 Starting server...');
console.log(`📦 Port: ${PORT}`);

// Middleware - CORS configuration to allow all origins
app.use(cors({
  origin: true, // Allow all origins (dynamic based on request origin)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Set to false when using origin: true or '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ 
        status: 'error', 
        message: 'Server is running but database configuration not loaded',
        database: 'not configured'
      });
    }
    
    // Test database connection
    await pool.query('SELECT 1');
    
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'Server is running but database connection failed',
      error: error.message,
      database: 'disconnected'
    });
  }
});

// API routes
app.use('/api/referrals', referralsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server - listen on all network interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`✅ Server is also accessible on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints: http://localhost:${PORT}/api/referrals`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ ERROR: Port ${PORT} is already in use!`);
    console.error(`Please stop the process using port ${PORT} or change the PORT in .env file`);
  } else {
    console.error('❌ ERROR starting server:', err);
  }
  process.exit(1);
});

