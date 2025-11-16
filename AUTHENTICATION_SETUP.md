# Authentication System Setup Guide

## Overview

This application now includes a complete authentication and authorization system with:
- Beautiful login page
- Admin dashboard for user management
- Role-based access control (Admin/User)
- Permission-based route protection
- User management (Create, Update, Delete users)
- Permission management

## Database Setup

### 1. Initialize Users Database

Run the following command to create the users and permissions tables:

```bash
cd server
npm run init-users-db
```

This will:
- Create `users` and `permissions` tables
- Insert default admin user (username: `admin`, password: `admin123`)
- Insert default regular user (username: `user`, password: `user123`)

⚠️ **Important**: Change these default passwords in production!

### 2. Install Dependencies

Make sure to install the new dependencies:

```bash
cd server
npm install
```

This will install:
- `bcryptjs` - For password hashing
- `jsonwebtoken` - For JWT token generation

## Default Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Permissions**: Full access to everything including billing and user management

### Regular User Account
- **Username**: `user`
- **Password**: `user123`
- **Permissions**: Access to all pages except billing

## Features

### Admin Features
- ✅ Access to entire website including billing
- ✅ User Management Dashboard (`/admin`)
- ✅ Create new users
- ✅ Edit user details and permissions
- ✅ Delete users
- ✅ Change user passwords
- ✅ Manage user permissions

### User Features
- ✅ Access to all pages except billing
- ✅ View and use all forms
- ✅ Access dashboard
- ❌ Cannot access billing page
- ❌ Cannot manage users

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `GET /api/auth/verify` - Verify JWT token

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/change-password` - Change user password

## Route Protection

All routes are protected by default. The following routes have special requirements:

- `/login` - Public (no authentication required)
- `/admin` - Requires admin role
- `/billing` - Requires `can_access_billing` permission
- `/dashboard` - Requires `can_access_dashboard` permission
- All other routes - Require authentication

## Navigation

The navigation bar automatically:
- Shows/hides billing link based on user permissions
- Shows admin link for admin users
- Displays user info with dropdown menu
- Provides logout functionality

## User Management

### Creating a User (Admin Only)

1. Navigate to `/admin`
2. Click "Create User" button
3. Fill in the form:
   - Username (required)
   - Email (required)
   - Password (required for new users)
   - Full Name (optional)
   - Role (Admin or User)
   - Active status
   - Permissions (checkboxes)

### Editing a User

1. Navigate to `/admin`
2. Click the edit icon next to the user
3. Modify the fields
4. Click "Update"

### Deleting a User

1. Navigate to `/admin`
2. Click the delete icon next to the user
3. Confirm deletion

⚠️ **Note**: You cannot delete your own account.

## Permissions

Each user has the following permissions:
- `can_access_billing` - Access to billing page
- `can_access_dashboard` - Access to dashboard
- `can_access_forms` - Access to forms
- `can_access_reports` - Access to reports
- `can_manage_users` - Manage other users (admin only)

Admins automatically have all permissions enabled.

## Security Notes

1. **JWT Tokens**: Tokens are stored in localStorage and expire after 7 days
2. **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
3. **Route Protection**: All routes check authentication and permissions
4. **API Security**: All user management APIs require admin authentication

## Troubleshooting

### Cannot Login
- Check if the server is running on port 3001
- Verify database is initialized
- Check browser console for errors
- Ensure API_BASE_URL is correct

### Permission Denied
- Verify user has the required permission
- Check user role (admin has all permissions)
- Verify token is valid

### Database Errors
- Ensure PostgreSQL is running
- Check database connection in `.env`
- Verify tables exist (run `init-users-db`)

## Environment Variables

Make sure your `.env` file includes:

```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=Worx
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

## Next Steps

1. Change default passwords
2. Set a strong JWT_SECRET in production
3. Configure proper CORS settings for production
4. Add password reset functionality (optional)
5. Add email verification (optional)

