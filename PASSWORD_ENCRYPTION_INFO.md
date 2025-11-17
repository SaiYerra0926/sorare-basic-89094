# Password Encryption Information

## Encryption Type Used

The application uses **bcrypt** for password hashing, implemented via the `bcryptjs` library.

## Technical Details

- **Library**: `bcryptjs` (JavaScript implementation of bcrypt)
- **Algorithm**: Blowfish-based adaptive hashing
- **Salt Rounds**: 10 (configurable, currently set to 10)
- **Hash Format**: `$2b$10$...` (bcrypt variant 2b)
- **Storage**: Passwords are stored in the `password_hash` column of the `users` table

## Hash Format Breakdown

A bcrypt hash looks like this:
```
$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUV
```

- `$2b$` - bcrypt variant identifier (2b is the most common)
- `10` - Cost factor (salt rounds = 2^10 = 1024 iterations)
- `abcdefghijklmnopqrstuv` - 22 character salt (base64 encoded)
- `wxyz1234567890ABCDEFGHIJKLMNOPQRSTUV` - 31 character hash (base64 encoded)

## Security Features

1. **Salt**: Each password gets a unique random salt, preventing rainbow table attacks
2. **Adaptive**: The cost factor can be increased as computing power increases
3. **One-way**: bcrypt is a one-way hash function - passwords cannot be decrypted
4. **Slow by design**: Intentionally slow to prevent brute force attacks

## Current Admin Password

- **Username**: `admin`
- **Password**: `worx@123`
- **Status**: ✅ Updated in database

## How to Update Passwords

To update a user's password, use the script:
```bash
cd server
node database/update-admin-password.js
```

Or manually hash a password and update the database:
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 10);
// Then update the password_hash column in the users table
```

## Verification

The login system verifies passwords using `bcrypt.compare()`:
- Takes the plain text password from the user
- Compares it with the stored hash
- Returns true if they match, false otherwise

