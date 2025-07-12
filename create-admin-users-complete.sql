-- Complete SQL Script to create Admin and Super_Admin users
-- Run this script in your SQL Server database (MYHPPC\SQLEXPRESS)

-- First, ensure the users table exists (if not already created by TypeORM)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        id NVARCHAR(36) PRIMARY KEY,
        email NVARCHAR(255) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        firstName NVARCHAR(255) NOT NULL,
        lastName NVARCHAR(255) NOT NULL,
        role NVARCHAR(50) DEFAULT 'local',
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

-- Check if admin users already exist
IF NOT EXISTS (SELECT * FROM users WHERE email = 'admin@telegramautomation.com')
BEGIN
    -- Insert Admin user
    INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        'admin@telegramautomation.com',
        '$2b$10$mcJCjt0G3LHCQAlpkasEgOPjFxU1MdyhLUXmfVM89HksxU5aOeuwO',
        'Admin',
        'User',
        'admin',
        1,
        GETDATE(),
        GETDATE()
    );
    PRINT 'Admin user created successfully.';
END
ELSE
BEGIN
    PRINT 'Admin user already exists.';
END

-- Check if super admin user already exists
IF NOT EXISTS (SELECT * FROM users WHERE email = 'superadmin@telegramautomation.com')
BEGIN
    -- Insert Super Admin user
    INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
    VALUES (
        NEWID(),
        'superadmin@telegramautomation.com',
        '$2b$10$mC9s01dtfTjaLAptoW3i/e.VIVLweuiCQzRbuOJNEkHd0nyeVbSjS',
        'Super',
        'Admin',
        'super_admin',
        1,
        GETDATE(),
        GETDATE()
    );
    PRINT 'Super Admin user created successfully.';
END
ELSE
BEGIN
    PRINT 'Super Admin user already exists.';
END

-- Verify the users were created
PRINT '=== Admin Users in Database ===';
SELECT 
    id, 
    email, 
    firstName, 
    lastName, 
    role, 
    isActive, 
    createdAt 
FROM users 
WHERE role IN ('admin', 'super_admin')
ORDER BY role;

PRINT '=== Login Credentials ===';
PRINT 'Admin Login:';
PRINT '  Email: admin@telegramautomation.com';
PRINT '  Password: Admin@123';
PRINT '';
PRINT 'Super Admin Login:';
PRINT '  Email: superadmin@telegramautomation.com';
PRINT '  Password: SuperAdmin@123'; 