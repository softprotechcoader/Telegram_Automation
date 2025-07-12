# Multi-Role User System

This document explains the new multi-role user system where users can have multiple roles (Local, Admin, Super_Admin) stored in separate tables.

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

## 📊 Table Schemas

### **users** (Main User Table)
```sql
- id (UUID, Primary Key)
- email (Unique)
- password (Hashed)
- firstName
- lastName
- isActive
- lastLogin
- createdAt
- updatedAt
```

### **local_users** (Local User Table)
```sql
- id (UUID, Primary Key)
- userId (Foreign Key to users.id)
- localSettings (JSON settings)
- permissions (Basic access permissions)
- isActive
- createdAt
- updatedAt
```

### **admin_users** (Admin User Table)
```sql
- id (UUID, Primary Key)
- userId (Foreign Key to users.id)
- adminLevel (junior, senior, lead)
- department (Admin department)
- permissions (Admin permissions)
- isActive
- createdAt
- updatedAt
```

### **super_admin_users** (Super Admin Table)
```sql
- id (UUID, Primary Key)
- userId (Foreign Key to users.id)
- accessLevel (full_access)
- systemPermissions (All system permissions)
- emergencyContact
- isActive
- createdAt
- updatedAt
```

## 👥 User Role Examples

### **Example 1: John Doe (Local + Admin)**
- **Email**: `john.doe@example.com`
- **Password**: `Admin@123`
- **Roles**: Local User + Admin User
- **Permissions**: 
  - Local: Basic access
  - Admin: User management, content moderation

### **Example 2: Jane Smith (Local Only)**
- **Email**: `jane.smith@example.com`
- **Password**: `Admin@123`
- **Roles**: Local User only
- **Permissions**: Basic access only

### **Example 3: Super Admin (All Roles)**
- **Email**: `superadmin@telegramautomation.com`
- **Password**: `SuperAdmin@123`
- **Roles**: Local + Admin + Super_Admin
- **Permissions**: Full system access

## 🔧 Setup Instructions

### **Step 1: Run the SQL Script**
1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your database: `MYHPPC\SQLEXPRESS`
3. Open the file: `create-multi-role-tables.sql`
4. Execute the script

### **Step 2: Verify the Setup**
The script will create:
- ✅ All required tables
- ✅ Sample users with multiple roles
- ✅ Foreign key relationships
- ✅ Verification queries

## 🎯 Benefits of Multi-Role System

### **Flexibility:**
- Users can have multiple roles simultaneously
- Each role has its own specific data and permissions
- Easy to add/remove roles without affecting others

### **Scalability:**
- Separate tables for different role types
- Role-specific data doesn't clutter main user table
- Easy to extend with new role types

### **Security:**
- Granular permission control per role
- Role-specific settings and configurations
- Clear separation of concerns

## 🔐 Permission Matrix

| Feature | Local User | Admin User | Super Admin |
|---------|------------|------------|-------------|
| Basic Access | ✅ | ✅ | ✅ |
| User Management | ❌ | ✅ | ✅ |
| Content Moderation | ❌ | ✅ | ✅ |
| System Administration | ❌ | ❌ | ✅ |
| Emergency Access | ❌ | ❌ | ✅ |

## 📝 API Endpoints

### **User Management:**
- `POST /auth/register` - Register with multiple roles
- `POST /auth/login` - Login (returns all user roles)
- `GET /auth/profile` - Get profile with all roles
- `PUT /auth/users/:id` - Update user (Admin/Super_Admin only)

### **Role Management:**
- `POST /auth/roles/assign` - Assign role to user
- `DELETE /auth/roles/:userId/:role` - Remove role from user
- `GET /auth/roles/:userId` - Get user's roles

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
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["local", "admin"]
  }
}
```

## 🔄 Migration from Single Role

If you have existing users with single roles:

1. **Backup your current data**
2. **Run the migration script** (to be created)
3. **Update existing users** to have appropriate roles
4. **Test the new system**

## 📊 Sample Data

After running the setup script, you'll have:

| User | Email | Roles | Permissions |
|------|-------|-------|-------------|
| John Doe | john.doe@example.com | Local + Admin | Basic + User Management |
| Jane Smith | jane.smith@example.com | Local Only | Basic Access |
| Super Admin | superadmin@telegramautomation.com | All Roles | Full System Access |

## 🚀 Next Steps

1. **Update your application code** to work with the new multi-role system
2. **Implement role checking logic** in your services
3. **Update your guards** to handle multiple roles
4. **Test all scenarios** with different role combinations

## 📞 Support

For issues or questions:
1. Check the SQL script execution logs
2. Verify foreign key relationships
3. Test with the provided sample users
4. Review the database schema

---

**🎉 Your multi-role system is ready! Users can now have Local, Admin, and Super_Admin roles simultaneously.** 