# How to Start the Backend Server

## Quick Start

1. Open a terminal/command prompt
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```

3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   node server.js
   ```

5. You should see:
   ```
   Server is running on http://localhost:3001
   ```

## Important Notes

- **The backend server MUST be running** for the referral form to work
- The server runs on port **3001** by default
- Keep this terminal window open while using the application
- If you see "Failed to fetch" errors, it means the server is not running

## Database Setup

Before starting the server, make sure:
1. PostgreSQL is running
2. The database "Worx" exists
3. The tables are created (run `npm run init-db` in the server directory)

