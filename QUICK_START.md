# Quick Start Guide - Running the Servers

## ⚠️ IMPORTANT: Backend Server MUST Be Running

The backend server is required for all functionality:
- Submitting referral forms
- Viewing dashboard data
- Loading completed referrals

## 🚀 How to Start Backend Server

### Option 1: Double-click the script (Easiest)
1. Navigate to the project root folder
2. Double-click `start-backend-server.ps1`
3. A PowerShell window will open showing the server logs
4. Keep this window open while using the application

### Option 2: Manual start via Terminal
1. Open PowerShell or Command Prompt
2. Navigate to the project:
   ```powershell
   cd C:\Worx_Project\sorare-basic-89094\server
   ```
3. Start the server:
   ```powershell
   node server.js
   ```
   or for auto-restart on changes:
   ```powershell
   npm run dev
   ```

### Verify Server is Running

Open your browser and visit:
- **Health Check:** http://localhost:3001/health

You should see:
```json
{"status":"ok","message":"Server is running"}
```

## 🔍 Troubleshooting

### "Cannot connect to the server" Error
- **Solution:** The backend server is not running
- Start the server using one of the methods above
- Keep the server terminal window open

### "Failed to fetch" Error  
- **Solution:** Backend server is not running or not accessible
- Check if server is running on port 3001
- Verify no firewall is blocking the connection

### Server Won't Start
1. Check if port 3001 is already in use
2. Ensure PostgreSQL database is running
3. Check the server terminal for error messages
4. Verify Node.js is installed: `node --version`

### Database Connection Errors
- Ensure PostgreSQL is installed and running
- Default database settings:
  - Host: localhost
  - Port: 5433
  - Database: Worx
  - User: postgres
  - Password: postgres

## ✅ Success Indicators

When everything is working correctly:
- ✅ Backend server shows: "Server is running on http://localhost:3001"
- ✅ Health check returns: `{"status":"ok","message":"Server is running"}`
- ✅ Dashboard loads without errors
- ✅ Referral forms can be submitted successfully

