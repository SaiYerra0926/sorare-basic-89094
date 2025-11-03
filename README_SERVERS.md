# How to Start All Required Servers

## Backend Server (REQUIRED)

The backend server MUST be running for the application to work.

### Method 1: Using PowerShell Script
```powershell
.\start-backend-server.ps1
```

### Method 2: Manual Start
1. Open a terminal/command prompt
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   node server.js
   ```

### Verify Server is Running
- Open your browser and go to: http://localhost:3001/health
- You should see: `{"status":"ok","message":"Server is running"}`

## Frontend Server (Optional for Development)

If you want to run the frontend development server:

1. Open a new terminal
2. In the root directory:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:8080 (or the port specified in vite.config.ts)

## Important Notes

- **The backend server MUST be running** for:
  - Submitting referral forms
  - Viewing the dashboard
  - Loading completed referrals
  - All API operations

- **Keep the backend server terminal window open** while using the application

- If you see "Failed to fetch" or "Cannot connect to the server" errors, it means the backend server is not running

## Troubleshooting

### Server won't start
1. Check if port 3001 is already in use
2. Ensure PostgreSQL database is running
3. Check database connection settings in `.env` file (if exists)
4. Look at the server terminal for error messages

### Database Connection Issues
- Make sure PostgreSQL is running
- Verify database credentials in `server/database/config.js`
- Check if the database "Worx" exists

