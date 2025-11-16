# Login Troubleshooting Guide

If you're seeing "Server returned an invalid response" error, follow these steps:

## Quick Checklist

### 1. Check if Server is Running
```bash
cd server
npm start
```

You should see:
```
✅ Server is running on http://localhost:3001
✅ Server is also accessible on http://0.0.0.0:3001
```

### 2. Check Database Connection
Make sure PostgreSQL is running and accessible:
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# Mac/Linux: sudo systemctl status postgresql
```

### 3. Initialize Users Database
If you haven't initialized the users database yet:
```bash
cd server
npm run init-users-db
```

You should see:
```
✅ Users and permissions database initialized successfully!
Default credentials:
  Admin: username=admin, password=admin123
  User: username=user, password=user123
```

### 4. Check Server Port
Make sure the server is running on port 3001 (default). Check `server/.env`:
```env
PORT=3001
```

### 5. Check API URL
The frontend expects the API at `http://localhost:3001/api`. 
Check `src/lib/api.ts` - it should be:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
```

### 6. Check Browser Console
Open browser DevTools (F12) and check:
- Network tab: Is the request being sent?
- Console tab: Any CORS errors?
- What's the actual response from the server?

### 7. Test API Endpoint Directly
Try accessing the health endpoint:
```
http://localhost:3001/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected"
}
```

### 8. Test Login Endpoint
Try with curl or Postman:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Common Issues

### Issue: "Cannot connect to the server"
**Solution**: 
- Make sure the server is running
- Check if port 3001 is available
- Check firewall settings

### Issue: "API endpoint not found"
**Solution**:
- Verify the route is registered in `server/server.js`
- Check if `/api/auth/login` route exists
- Restart the server

### Issue: "Invalid credentials"
**Solution**:
- Make sure database is initialized
- Try default credentials: admin/admin123 or user/user123
- Check if user exists in database

### Issue: CORS errors
**Solution**:
- Check CORS configuration in `server/server.js`
- Make sure `origin: true` is set
- Check browser console for specific CORS error

### Issue: Database connection error
**Solution**:
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Check if database "Worx" exists
- Run `npm run init-users-db` to initialize tables

## Step-by-Step Setup

1. **Start PostgreSQL**
   ```bash
   # Make sure PostgreSQL is running
   ```

2. **Initialize Database**
   ```bash
   cd server
   npm install
   npm run init-users-db
   ```

3. **Start Server**
   ```bash
   npm start
   ```

4. **Start Frontend**
   ```bash
   # In root directory
   npm run dev
   ```

5. **Test Login**
   - Go to http://localhost:5173/login (or your frontend URL)
   - Use credentials: admin / admin123

## Still Having Issues?

1. Check server logs for errors
2. Check browser console for detailed errors
3. Verify all environment variables are set
4. Make sure all dependencies are installed (`npm install` in both root and server directories)

