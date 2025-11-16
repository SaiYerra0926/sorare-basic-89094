// Quick test to verify server can start and routes are accessible
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Try to import auth router
let authRouter;
try {
  console.log('Testing auth router import...');
  const authModule = await import('./routes/auth.js');
  authRouter = authModule.default;
  console.log('✅ Auth router imported successfully');
  app.use('/api/auth', authRouter);
  console.log('✅ Auth routes registered');
} catch (error) {
  console.error('❌ Error importing auth router:', error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`\n✅ Test server running on http://localhost:${PORT}`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/test`);
  console.log(`✅ Auth login: http://localhost:${PORT}/api/auth/login`);
  console.log('\nIf you see this, the server can start successfully!');
  console.log('Press Ctrl+C to stop\n');
});

