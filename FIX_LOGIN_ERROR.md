# Fix "API endpoint not found" Error

## The Problem
You're seeing: **"API endpoint not found. Please check if the server is running and the endpoint is correct."**

This means the frontend cannot reach the backend server at `http://localhost:3001/api/auth/login`.

## Solution Steps

### Step 1: Verify Server is Running

Open a terminal and run:
```bash
cd server
npm start
```

**You MUST see this output:**
```
🚀 Starting server...
📦 Port: 3001
✅ Server is running on http://localhost:3001
✅ Server is also accessible on http://0.0.0.0:3001
API endpoints: http://localhost:3001/api/auth
```

**If you see errors instead**, the server failed to start. Common errors:

#### Error: "Cannot find module 'bcryptjs'"
**Fix:**
```bash
cd server
npm install
```

#### Error: "Port 3001 is already in use"
**Fix:** Stop the process using port 3001 or change the port in `.env`

#### Error: "Database connection failed"
**Fix:** 
1. Make sure PostgreSQL is running
2. Check `server/.env` file has correct database credentials
3. Run: `npm run init-users-db`

### Step 2: Test Server Manually

Open your browser and go to:
```
http://localhost:3001/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected"
}
```

**If you get "This site can't be reached"** → Server is NOT running. Go back to Step 1.

### Step 3: Test Login Endpoint

Once server is running, test the login endpoint directly:

**Using curl (PowerShell):**
```powershell
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{\"username\":\"admin\",\"password\":\"admin123\"}'
```

**Or use browser DevTools:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login from the frontend
4. Look for the request to `/api/auth/login`
5. Check the response

### Step 4: Check Frontend API URL

Make sure your frontend is pointing to the correct server URL.

Check `src/lib/api.ts` - it should be:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
```

### Step 5: Quick Test Script

Run this to test if server can start:
```bash
cd server
node test-server.js
```

If this works, the issue is with dependencies or database. If it fails, there's a code error.

## Common Issues & Fixes

### Issue 1: Server Not Starting
**Symptoms:** No "Server is running" message
**Fix:** 
- Check for errors in terminal
- Install dependencies: `npm install`
- Check database connection

### Issue 2: 404 on /api/auth/login
**Symptoms:** Server running but endpoint returns 404
**Fix:**
- Verify route is registered in `server/server.js`
- Check `app.use('/api/auth', authRouter)` exists
- Restart server

### Issue 3: CORS Errors
**Symptoms:** Browser console shows CORS error
**Fix:**
- Check CORS is enabled in `server/server.js`
- Verify `origin: true` is set

### Issue 4: Database Errors
**Symptoms:** Server starts but login fails with database error
**Fix:**
```bash
cd server
npm run init-users-db
```

## Complete Setup Checklist

- [ ] PostgreSQL is running
- [ ] Database "Worx" exists
- [ ] `cd server && npm install` completed
- [ ] `cd server && npm run init-users-db` completed successfully
- [ ] `cd server && npm start` shows "Server is running"
- [ ] `http://localhost:3001/health` returns JSON
- [ ] Frontend API URL is `http://localhost:3001/api`
- [ ] No errors in server terminal
- [ ] No errors in browser console

## Still Not Working?

1. **Check server terminal** - Look for any error messages
2. **Check browser console** (F12) - Look for network errors
3. **Check browser Network tab** - See actual HTTP requests/responses
4. **Verify port** - Make sure nothing else is using port 3001
5. **Restart everything** - Stop server, restart, try again

## Quick Command Reference

```bash
# Install dependencies
cd server
npm install

# Initialize database
npm run init-users-db

# Check setup
npm run check-setup

# Start server
npm start

# Test server (alternative)
node test-server.js
```

