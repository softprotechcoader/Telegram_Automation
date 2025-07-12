# Admin User Setup Guide

This guide explains how to set up Admin and Super_Admin users in your Telegram Automation Web application.

## 📋 What's Generated

### ✅ Completed Files:
1. **`generate-admin-passwords.js`** - Generates bcrypt password hashes
2. **`create-admin-users-complete.sql`** - Complete SQL script with actual hashes
3. **`test-admin-login.js`** - Tests admin login functionality
4. **`ADMIN_SETUP.md`** - This documentation file

### ✅ Generated Admin Users:
- **Admin User**: `admin@telegramautomation.com` / `Admin@123`
- **Super Admin User**: `superadmin@telegramautomation.com` / `SuperAdmin@123`

## 🚀 How to Set Up Admin Users

### Step 1: Run the SQL Script
1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your database: `MYHPPC\SQLEXPRESS`
3. Open the file: `create-admin-users-complete.sql`
4. Execute the script

### Step 2: Verify the Setup
The SQL script will:
- ✅ Create the `users` table (if it doesn't exist)
- ✅ Insert Admin user with proper password hash
- ✅ Insert Super Admin user with proper password hash
- ✅ Show verification results

## 🔐 Admin Login Credentials

### Admin User
- **Email**: `admin@telegramautomation.com`
- **Password**: `Admin@123`
- **Role**: `admin`
- **Permissions**: User management, profile updates

### Super Admin User
- **Email**: `superadmin@telegramautomation.com`
- **Password**: `SuperAdmin@123`
- **Role**: `super_admin`
- **Permissions**: Full system access, all admin functions

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
- `POST /auth/register` - Register new users
- `POST /auth/login` - Login users

### Protected Endpoints (Auth Required)
- `GET /auth/profile` - Get current user profile
- `PUT /auth/users/:id` - Update user (Admin/Super_Admin only)
- `GET /auth/users` - Get all users (Admin/Super_Admin only)

## 🛡️ Role-Based Access Control

### User Roles:
- **LOCAL**: Basic user with limited access
- **ADMIN**: Can manage users and access admin functions
- **SUPER_ADMIN**: Full system access and control

### Permission Matrix:
| Endpoint | LOCAL | ADMIN | SUPER_ADMIN |
|----------|-------|-------|-------------|
| `/auth/register` | ✅ | ✅ | ✅ |
| `/auth/login` | ✅ | ✅ | ✅ |
| `/auth/profile` | ✅ | ✅ | ✅ |
| `/auth/users/:id` (PUT) | ❌ | ✅ | ✅ |
| `/auth/users` (GET) | ❌ | ✅ | ✅ |

## 🔧 Troubleshooting

### Common Issues:

1. **"User not found" error**
   - Ensure the SQL script ran successfully
   - Check database connection in your `.env` file

2. **"Invalid credentials" error**
   - Verify you're using the correct email/password
   - Check that the password hashes were generated correctly

3. **"Unauthorized" error**
   - Make sure you're including the JWT token in the Authorization header
   - Format: `Bearer <your-jwt-token>`

### Database Connection Issues:
- Verify SQL Server is running
- Check your `.env` configuration
- Ensure the database exists: `telegram_automation`

## 📝 Security Notes

- ✅ Passwords are hashed using bcrypt with salt rounds of 10
- ✅ JWT tokens expire after 1 day
- ✅ Passwords are never returned in API responses
- ✅ Role-based access control is enforced
- ✅ Input validation is applied to all endpoints

## 🎯 Next Steps

1. **Test the admin login** using the provided credentials
2. **Explore the API** via Swagger UI
3. **Create additional users** through the registration endpoint
4. **Test role-based access** with different user types

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify database connectivity
3. Test with the provided test scripts
4. Review the authentication flow in the code comments

---

**🎉 Your admin users are ready to use!** 