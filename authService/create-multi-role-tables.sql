-- Multi-Role User Tables Setup Script
-- This script creates separate tables for different user types
-- Users can have multiple roles (Local, Admin, Super_Admin)

-- =============================================
-- 1. MAIN USERS TABLE (Base user information)
-- =============================================

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        id NVARCHAR(36) PRIMARY KEY,
        email NVARCHAR(255) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        firstName NVARCHAR(255) NOT NULL,
        lastName NVARCHAR(255) NOT NULL,
        isActive BIT DEFAULT 1,
        lastLogin DATETIME2 NULL,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
    );
    PRINT 'Users table created successfully.';
END
ELSE
BEGIN
    PRINT 'Users table already exists.';
END

-- =============================================
-- 2. LOCAL USERS TABLE
-- =============================================

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='local_users' AND xtype='U')
BEGIN
    CREATE TABLE local_users (
        id NVARCHAR(36) PRIMARY KEY,
        userId NVARCHAR(36) NOT NULL,
        localSettings NVARCHAR(MAX) NULL,
        permissions NVARCHAR(255) DEFAULT 'basic_access',
        isActive BIT DEFAULT 1,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    PRINT 'Local users table created successfully.';
END
ELSE
BEGIN
    PRINT 'Local users table already exists.';
END

-- =============================================
-- 3. ADMIN USERS TABLE
-- =============================================

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='admin_users' AND xtype='U')
BEGIN
    CREATE TABLE admin_users (
        id NVARCHAR(36) PRIMARY KEY,
        userId NVARCHAR(36) NOT NULL,
        adminLevel NVARCHAR(50) DEFAULT 'junior',
        department NVARCHAR(255) NULL,
        permissions NVARCHAR(500) DEFAULT 'user_management',
        isActive BIT DEFAULT 1,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    PRINT 'Admin users table created successfully.';
END
ELSE
BEGIN
    PRINT 'Admin users table already exists.';
END

-- =============================================
-- 4. SUPER ADMIN USERS TABLE
-- =============================================

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='super_admin_users' AND xtype='U')
BEGIN
    CREATE TABLE super_admin_users (
        id NVARCHAR(36) PRIMARY KEY,
        userId NVARCHAR(36) NOT NULL,
        accessLevel NVARCHAR(50) DEFAULT 'full_access',
        systemPermissions NVARCHAR(500) DEFAULT 'all_permissions',
        emergencyContact NVARCHAR(255) NULL,
        isActive BIT DEFAULT 1,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    PRINT 'Super admin users table created successfully.';
END
ELSE
BEGIN
    PRINT 'Super admin users table already exists.';
END

-- =============================================
-- 5. INSERT SAMPLE USERS WITH MULTIPLE ROLES
-- =============================================

-- Sample User 1: Local + Admin
IF NOT EXISTS (SELECT * FROM users WHERE email = 'john.doe@example.com')
BEGIN
    -- Insert main user
    INSERT INTO users (id, email, password, firstName, lastName, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        'john.doe@example.com',
        '$2b$10$mcJCjt0G3LHCQAlpkasEgOPjFxU1MdyhLUXmfVM89HksxU5aOeuwO', -- Password: Admin@123
        'John',
        'Doe',
        1,
        GETDATE(),
        GETDATE()
    );
    
    DECLARE @johnUserId NVARCHAR(36) = (SELECT id FROM users WHERE email = 'john.doe@example.com');
    
    -- Make John a Local User
    INSERT INTO local_users (id, userId, localSettings, permissions, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        @johnUserId,
        '{"theme": "dark", "language": "en"}',
        'basic_access',
        1,
        GETDATE(),
        GETDATE()
    );
    
    -- Make John an Admin User
    INSERT INTO admin_users (id, userId, adminLevel, department, permissions, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        @johnUserId,
        'senior',
        'user_management',
        'user_management,content_moderation',
        1,
        GETDATE(),
        GETDATE()
    );
    
    PRINT 'John Doe created with Local + Admin roles.';
END

-- Sample User 2: Local Only
IF NOT EXISTS (SELECT * FROM users WHERE email = 'jane.smith@example.com')
BEGIN
    -- Insert main user
    INSERT INTO users (id, email, password, firstName, lastName, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        'jane.smith@example.com',
        '$2b$10$mcJCjt0G3LHCQAlpkasEgOPjFxU1MdyhLUXmfVM89HksxU5aOeuwO', -- Password: Admin@123
        'Jane',
        'Smith',
        1,
        GETDATE(),
        GETDATE()
    );
    
    DECLARE @janeUserId NVARCHAR(36) = (SELECT id FROM users WHERE email = 'jane.smith@example.com');
    
    -- Make Jane a Local User only
    INSERT INTO local_users (id, userId, localSettings, permissions, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        @janeUserId,
        '{"theme": "light", "language": "en"}',
        'basic_access',
        1,
        GETDATE(),
        GETDATE()
    );
    
    PRINT 'Jane Smith created with Local role only.';
END

-- Sample User 3: Super Admin
IF NOT EXISTS (SELECT * FROM users WHERE email = 'superadmin@telegramautomation.com')
BEGIN
    -- Insert main user
    INSERT INTO users (id, email, password, firstName, lastName, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        'superadmin@telegramautomation.com',
        '$2b$10$mC9s01dtfTjaLAptoW3i/e.VIVLweuiCQzRbuOJNEkHd0nyeVbSjS', -- Password: SuperAdmin@123
        'Super',
        'Admin',
        1,
        GETDATE(),
        GETDATE()
    );
    
    DECLARE @superAdminUserId NVARCHAR(36) = (SELECT id FROM users WHERE email = 'superadmin@telegramautomation.com');
    
    -- Make Super Admin have all roles
    INSERT INTO local_users (id, userId, localSettings, permissions, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        @superAdminUserId,
        '{"theme": "dark", "language": "en", "super_admin": true}',
        'all_access',
        1,
        GETDATE(),
        GETDATE()
    );
    
    INSERT INTO admin_users (id, userId, adminLevel, department, permissions, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        @superAdminUserId,
        'lead',
        'system_administration',
        'all_permissions',
        1,
        GETDATE(),
        GETDATE()
    );
    
    INSERT INTO super_admin_users (id, userId, accessLevel, systemPermissions, emergencyContact, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        @superAdminUserId,
        'full_access',
        'all_permissions',
        'emergency@telegramautomation.com',
        1,
        GETDATE(),
        GETDATE()
    );
    
    PRINT 'Super Admin created with all roles (Local + Admin + Super_Admin).';
END

-- =============================================
-- 6. VERIFICATION QUERIES
-- =============================================

PRINT '=== VERIFICATION RESULTS ===';

-- Show all users with their roles
PRINT 'All Users with Their Roles:';
SELECT 
    u.id,
    u.email,
    u.firstName,
    u.lastName,
    CASE 
        WHEN lu.id IS NOT NULL THEN 'Local '
        ELSE ''
    END +
    CASE 
        WHEN au.id IS NOT NULL THEN 'Admin '
        ELSE ''
    END +
    CASE 
        WHEN sau.id IS NOT NULL THEN 'Super_Admin'
        ELSE ''
    END as Roles
FROM users u
LEFT JOIN local_users lu ON u.id = lu.userId AND lu.isActive = 1
LEFT JOIN admin_users au ON u.id = au.userId AND au.isActive = 1
LEFT JOIN super_admin_users sau ON u.id = sau.userId AND sau.isActive = 1
ORDER BY u.email;

-- Show users with multiple roles
PRINT '';
PRINT 'Users with Multiple Roles:';
SELECT 
    u.email,
    u.firstName + ' ' + u.lastName as FullName,
    COUNT(*) as RoleCount
FROM users u
LEFT JOIN (
    SELECT userId FROM local_users WHERE isActive = 1
    UNION ALL
    SELECT userId FROM admin_users WHERE isActive = 1
    UNION ALL
    SELECT userId FROM super_admin_users WHERE isActive = 1
) roles ON u.id = roles.userId
GROUP BY u.id, u.email, u.firstName, u.lastName
HAVING COUNT(*) > 1
ORDER BY RoleCount DESC;

PRINT '';
PRINT '=== LOGIN CREDENTIALS ===';
PRINT 'John Doe (Local + Admin): john.doe@example.com / Admin@123';
PRINT 'Jane Smith (Local Only): jane.smith@example.com / Admin@123';
PRINT 'Super Admin (All Roles): superadmin@telegramautomation.com / SuperAdmin@123'; 