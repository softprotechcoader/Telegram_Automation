# Admin User Setup Guide

This guide explains how to set up Admin and Super_Admin users in your Telegram Automation Web application with comprehensive multi-role support.

## 📋 What's Generated

### ✅ Completed Files:
1. **`generate-admin-passwords.js`** - Generates bcrypt password hashes
2. **`create-admin-users-complete.sql`** - Complete SQL script with actual hashes
3. **`test-admin-login.js`** - Tests admin login functionality
4. **`ADMIN_SETUP.md`** - This documentation file
5. **`create-multi-role-tables.sql`** - Complete multi-role table setup

### ✅ Generated Admin Users:
- **Admin User**: `admin@telegramautomation.com` / `Admin@123`
- **Super Admin User**: `superadmin@telegramautomation.com` / `SuperAdmin@123`
- **Sample Users**: John Doe (Local + Admin), Jane Smith (Local only)

## 🚀 How to Set Up Admin Users

### Step 1: Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_TYPE=mssql
DB_HOST=MYHPPC\SQLEXPRESS
DB_PORT=1433
DB_NAME=telegram_automation
DB_AUTH_TYPE=ntlm

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Application Configuration
PORT=3000
NODE_ENV=development
```

### Step 2: Run the SQL Script
1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your database: `MYHPPC\SQLEXPRESS`
3. Open the file: `create-multi-role-tables.sql`
4. Execute the script

### Step 3: Verify the Setup
The SQL script will:
- ✅ Create all required tables with proper relationships
- ✅ Insert Admin user with proper password hash
- ✅ Insert Super Admin user with proper password hash
- ✅ Create sample users with multiple roles
- ✅ Show verification results

## 🔐 Admin Login Credentials

### Admin User
- **Email**: `admin@telegramautomation.com`
- **Password**: `Admin@123`
- **Role**: `admin`
- **Permissions**: User management, profile updates, view local and admin users

### Super Admin User
- **Email**: `superadmin@telegramautomation.com`
- **Password**: `SuperAdmin@123`
- **Role**: `super_admin`
- **Permissions**: Full system access, all admin functions, view all users

### Sample Users (for testing)
- **John Doe**: `john.doe@example.com` / `Admin@123` (Local + Admin roles)
- **Jane Smith**: `jane.smith@example.com` / `Admin@123` (Local only)

## 🧪 Testing the Setup

### Option 1: Use the Test Script
```bash
node test-admin-login.js
```

### Option 2: Test via API
1. Start your application: `npm run dev`
2. Open Swagger UI: `http://localhost:3000/api`
3. Try the login endpoint with admin credentials

### Option 3: Test via Swagger
1. Go to `http://localhost:3000/api`
2. Find the `POST /auth/login` endpoint
3. Click "Try it out"
4. Use admin credentials:
   ```json
   {
     "email": "admin@telegramautomation.com",
     "password": "Admin@123"
   }
   ```

## 🔑 API Endpoints for Admins

### Public Endpoints (No Auth Required)
- `POST /auth/register` - Register new users with optional roles
- `POST /auth/login` - Login users and receive JWT token
- `GET /` - Health check endpoint

### Protected Endpoints (Auth Required)
- `GET /auth/profile` - Get current user profile with roles
- `PUT /auth/users/:id` - Update user (own profile or admin/super_admin)
- `GET /auth/users` - Get users list (admin/super_admin with role filtering)

### Authorization Rules:
- **Local users**: Can only access their own profile
- **Admin users**: Can see local and admin users (excludes super_admin)
- **Super admin users**: Can see and manage all users

## 🛡️ Role-Based Access Control

### User Roles:
- **LOCAL**: Basic user with limited access
- **ADMIN**: Can manage users and access admin functions
- **SUPER_ADMIN**: Full system access and control

### Updated Permission Matrix:
| Endpoint | LOCAL | ADMIN | SUPER_ADMIN |
|----------|-------|-------|-------------|
| `/auth/register` | ✅ | ✅ | ✅ |
| `/auth/login` | ✅ | ✅ | ✅ |
| `/auth/profile` | ✅ Own only | ✅ Own only | ✅ Own only |
| `PUT /auth/users/:id` | ✅ Own only | ✅ Any user | ✅ Any user |
| `GET /auth/users` | ❌ | ✅ Local + Admin users | ✅ All users |

### Data Access Rules:
- **Admin users** can only see local and admin users (excludes super_admin)
- **Super admin users** can see all users (local, admin, and super_admin)
- **Multi-role users** are handled correctly with proper filtering

## 🔧 Troubleshooting

### Common Issues:

1. **"User not found" error**
   - Ensure the SQL script ran successfully
   - Check database connection in your `.env` file
   - Verify the database exists: `telegram_automation`

2. **"Invalid credentials" error**
   - Verify you're using the correct email/password
   - Check that the password hashes were generated correctly
   - Ensure bcrypt is working properly

3. **"Unauthorized" error**
   - Make sure you're including the JWT token in the Authorization header
   - Format: `Bearer <your-jwt-token>`
   - Check if the token has expired (1 day validity)

4. **"Forbidden" error**
   - Verify you have the required roles for the endpoint
   - Check if you're trying to access data outside your permission level
   - Ensure role-based filtering is working correctly

### Database Connection Issues:
- Verify SQL Server is running
- Check your `.env` configuration
- Ensure the database exists: `telegram_automation`
- Test connection with: `node test-mssql-connection.js`

### Role-Based Access Issues:
- **Admin users** should not see super_admin users in `/auth/users`
- **Super admin users** should see all users
- **Multi-role users** should be handled correctly
- Check the role filtering logic in the service

## 📝 Security Notes

- ✅ Passwords are hashed using bcrypt with salt rounds of 10
- ✅ JWT tokens expire after 1 day
- ✅ Passwords are never returned in API responses
- ✅ Role-based access control is enforced
- ✅ Input validation is applied to all endpoints
- ✅ Role filtering prevents unauthorized data access
- ✅ Multi-role support with proper authorization

## 🎯 Advanced Features

### Role Filtering Logic:
- **Admin users** can only see local and admin users
- **Super admin users** can see all users
- **Multi-role users** are handled correctly
- **Security is maintained** at all levels

### Password Recovery:
- All authenticated users can update their own profile
- Admin and super admin can update any user
- Secure password hashing with bcrypt

### JWT Token Security:
- Tokens expire after 1 day
- Include user roles in token payload
- Secure validation and verification

## 🧪 Testing Scenarios

### Test Admin User Access:
```bash
# Login as admin
POST /auth/login
{
  "email": "admin@telegramautomation.com",
  "password": "Admin@123"
}

# Get users list (should exclude super_admin users)
GET /auth/users
Authorization: Bearer <admin-token>
```

### Test Super Admin User Access:
```bash
# Login as super admin
POST /auth/login
{
  "email": "superadmin@telegramautomation.com",
  "password": "SuperAdmin@123"
}

# Get users list (should include all users)
GET /auth/users
Authorization: Bearer <super-admin-token>
```

### Test Multi-Role User:
```bash
# Login as John Doe (Local + Admin)
POST /auth/login
{
  "email": "john.doe@example.com",
  "password": "Admin@123"
}

# Should return both local and admin roles
```

## 🎯 Next Steps

1. **Test the admin login** using the provided credentials
2. **Explore the API** via Swagger UI
3. **Create additional users** through the registration endpoint
4. **Test role-based access** with different user types
5. **Verify role filtering** works correctly
6. **Implement additional features** as needed

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify database connectivity
3. Test with the provided test scripts
4. Review the authentication flow in the code comments
5. Check the role filtering logic
6. Verify JWT token validity

---

**🎉 Your admin users are ready to use with comprehensive multi-role support and advanced authorization controls!** 