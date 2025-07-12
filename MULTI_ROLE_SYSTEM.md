# Multi-Role User System

This document explains the comprehensive multi-role user system where users can have multiple roles (Local, Admin, Super_Admin) stored in separate tables with advanced authorization controls.

## 🏗️ Database Structure

### **Main Tables:**

1. **`users`** - Base user information (authentication, profile)
2. **`local_users`** - Local user specific data and permissions
3. **`admin_users`** - Admin user specific data and permissions  
4. **`super_admin_users`** - Super admin specific data and permissions

### **Relationships:**
- Each role table has a `userId` foreign key referencing the main `users` table
- Cascade delete ensures role records are removed when a user is deleted
- Users can exist in multiple role tables simultaneously
- Role-specific data is isolated in separate tables for better organization

## 📊 Table Schemas

### **users** (Main User Table)
```sql
- id (UUID, Primary Key)
- email (Unique)
- password (Hashed with bcrypt)
- firstName
- lastName
- isActive (Default: true)
- lastLogin (Nullable)
- createdAt (Auto-generated)
- updatedAt (Auto-updated)
```

### **local_users** (Local User Table)
```sql
- id (UUID, Primary Key)
- userId (Foreign Key to users.id)
- localSettings (JSON settings for user preferences)
- permissions (Basic access permissions)
- isActive (Default: true)
- createdAt (Auto-generated)
- updatedAt (Auto-updated)
```

### **admin_users** (Admin User Table)
```sql
- id (UUID, Primary Key)
- userId (Foreign Key to users.id)
- adminLevel (junior, senior, lead)
- department (Admin department or area)
- permissions (Admin-specific permissions)
- isActive (Default: true)
- createdAt (Auto-generated)
- updatedAt (Auto-updated)
```

### **super_admin_users** (Super Admin Table)
```sql
- id (UUID, Primary Key)
- userId (Foreign Key to users.id)
- accessLevel (full_access)
- systemPermissions (All system permissions)
- emergencyContact (Emergency contact information)
- isActive (Default: true)
- createdAt (Auto-generated)
- updatedAt (Auto-updated)
```

## 👥 User Role Examples

### **Example 1: John Doe (Local + Admin)**
- **Email**: `john.doe@example.com`
- **Password**: `Admin@123`
- **Roles**: Local User + Admin User
- **Permissions**: 
  - Local: Basic access, profile management
  - Admin: User management, content moderation

### **Example 2: Jane Smith (Local Only)**
- **Email**: `jane.smith@example.com`
- **Password**: `Admin@123`
- **Roles**: Local User only
- **Permissions**: Basic access only, own profile management

### **Example 3: Super Admin (All Roles)**
- **Email**: `superadmin@telegramautomation.com`
- **Password**: `SuperAdmin@123`
- **Roles**: Local + Admin + Super_Admin
- **Permissions**: Full system access, emergency access

## 🔧 Setup Instructions

### **Step 1: Environment Configuration**
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

### **Step 2: Run the SQL Script**
1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your database: `MYHPPC\SQLEXPRESS`
3. Open the file: `create-multi-role-tables.sql`
4. Execute the script

### **Step 3: Verify the Setup**
The script will create:
- ✅ All required tables with proper relationships
- ✅ Sample users with multiple roles
- ✅ Foreign key constraints with cascade deletes
- ✅ Verification queries to confirm setup

## 🎯 Benefits of Multi-Role System

### **Flexibility:**
- Users can have multiple roles simultaneously
- Each role has its own specific data and permissions
- Easy to add/remove roles without affecting others
- Role-specific settings and configurations

### **Scalability:**
- Separate tables for different role types
- Role-specific data doesn't clutter main user table
- Easy to extend with new role types
- Efficient querying and data management

### **Security:**
- Granular permission control per role
- Role-specific settings and configurations
- Clear separation of concerns
- Advanced authorization with role filtering

## 🔐 Permission Matrix

| Feature | Local User | Admin User | Super Admin |
|---------|------------|------------|-------------|
| Basic Access | ✅ | ✅ | ✅ |
| Profile Management | ✅ Own only | ✅ Own only | ✅ Own only |
| User Management | ❌ | ✅ (Local + Admin users) | ✅ (All users) |
| Content Moderation | ❌ | ✅ | ✅ |
| System Administration | ❌ | ❌ | ✅ |
| Emergency Access | ❌ | ❌ | ✅ |
| Password Recovery | ✅ Own only | ✅ Any user | ✅ Any user |

## 📝 API Endpoints

### **Public Endpoints:**
- `POST /auth/register` - Register new user with optional roles
- `POST /auth/login` - Login and receive JWT token with roles
- `GET /` - Health check endpoint

### **Authenticated Endpoints:**
- `GET /auth/profile` - Get current user profile with roles
- `PUT /auth/users/:id` - Update user (own profile or admin/super_admin)
- `GET /auth/users` - Get users list (admin/super_admin with role filtering)

### **Authorization Rules:**
- **Local users**: Can only access their own profile
- **Admin users**: Can see local and admin users (excludes super_admin)
- **Super admin users**: Can see and manage all users

## 🧪 Testing the System

### **Test Multi-Role Login:**
```bash
# Test John Doe (Local + Admin)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Admin@123"
  }'
```

### **Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["local", "admin"]
  }
}
```

### **Test Role-Based Access:**
```bash
# Admin user gets users list (should exclude super_admin users)
GET /auth/users
Authorization: Bearer <admin-token>

# Super admin user gets all users
GET /auth/users
Authorization: Bearer <super-admin-token>
```

## 🔄 Migration from Single Role

If you have existing users with single roles:

1. **Backup your current data**
2. **Run the migration script** (to be created)
3. **Update existing users** to have appropriate roles
4. **Test the new system**

## 📊 Sample Data

After running the setup script, you'll have:

| User | Email | Password | Roles | Permissions |
|------|-------|----------|-------|-------------|
| John Doe | john.doe@example.com | Admin@123 | Local + Admin | Basic + User Management |
| Jane Smith | jane.smith@example.com | Admin@123 | Local Only | Basic Access |
| Super Admin | superadmin@telegramautomation.com | SuperAdmin@123 | All Roles | Full System Access |

## 🚀 Next Steps

1. **Start the application**: `npm run dev`
2. **Access Swagger documentation**: `http://localhost:3000/api`
3. **Test all endpoints** with different user roles
4. **Verify role-based filtering** works correctly
5. **Implement additional features** as needed

## 🔧 Advanced Features

### **Role Filtering Logic:**
- **Admin users** can only see local and admin users
- **Super admin users** can see all users
- **Multi-role users** are handled correctly
- **Security is maintained** at all levels

### **Password Recovery:**
- All authenticated users can update their own profile
- Admin and super admin can update any user
- Secure password hashing with bcrypt

### **JWT Token Security:**
- Tokens expire after 1 day
- Include user roles in token payload
- Secure validation and verification

## 📞 Support

For issues or questions:
1. Check the SQL script execution logs
2. Verify foreign key relationships
3. Test with the provided sample users
4. Review the database schema
5. Check the application logs for errors

---

**🎉 Your multi-role system is ready! Users can now have Local, Admin, and Super_Admin roles simultaneously with advanced authorization controls.** 