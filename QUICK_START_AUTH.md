# Quick Start - Authentication System

## Step 1: Install Server Dependencies

```bash
cd server
npm install
```

This will install:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- Other required dependencies

## Step 2: Initialize Users Database

```bash
cd server
npm run init-users-db
```

**Expected Output:**
```
Initializing users and permissions database...
✅ Users and permissions database initialized successfully!
Default credentials:
  Admin: username=admin, password=admin123
  User: username=user, password=user123
⚠️  Please change these passwords in production!
```

## Step 3: Start the Server

```bash
cd server
npm start
```

**Expected Output:**
```
🚀 Starting server...
📦 Port: 3001
✅ Server is running on http://localhost:3001
✅ Server is also accessible on http://0.0.0.0:3001
Environment: development
Health check: http://localhost:3001/health
API endpoints: http://localhost:3001/api/auth
API endpoints: http://localhost:3001/api/users
...
```

## Step 4: Verify Server is Running

Open your browser and go to:
```
http://localhost:3001/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected"
}
```

## Step 5: Test Login

1. Start your frontend (if not already running):
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/login` (or your frontend URL)

3. Use these credentials:
   - **Admin**: `admin` / `admin123`
   - **User**: `user` / `user123`

## Troubleshooting

### Error: "Cannot find module 'bcryptjs'"
**Solution**: Run `npm install` in the server directory

### Error: "Port 3001 is already in use"
**Solution**: 
- Stop the process using port 3001, OR
- Change PORT in `server/.env` file

### Error: "Database connection failed"
**Solution**:
- Make sure PostgreSQL is running
- Check database credentials in `server/.env`
- Verify database "Worx" exists

### Error: "API endpoint not found"
**Solution**:
- Make sure server is running (check Step 3)
- Verify you see the "API endpoints" messages in server console
- Check that `/api/auth` is listed in the startup messages

### Error: "Users table does not exist"
**Solution**: Run `npm run init-users-db` (Step 2)

## Quick Test Commands

### Test Health Endpoint
```bash
curl http://localhost:3001/health
```

### Test Login Endpoint
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

## Default Credentials

⚠️ **Change these in production!**

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`
  - Access: Full (including billing and user management)

- **User**: 
  - Username: `user`
  - Password: `user123`
  - Access: All pages except billing

## Next Steps

1. ✅ Server running on port 3001
2. ✅ Database initialized
3. ✅ Can access `/health` endpoint
4. ✅ Can login with default credentials
5. ⚠️ Change default passwords
6. ⚠️ Set strong JWT_SECRET in production

