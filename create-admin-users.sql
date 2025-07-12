-- SQL Script to create Admin and Super_Admin users
-- Run this script in your SQL Server database

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
END

-- Insert Admin user
-- Password: Admin@123 (bcrypt hash with salt rounds 10)
INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
VALUES (
    NEWID(), -- Generate new UUID
    'admin@telegramautomation.com',
    '$2b$10$YourHashedPasswordHere', -- This will be replaced with actual hash
    'Admin',
    'User',
    'admin',
    1,
    GETDATE(),
    GETDATE()
);

-- Insert Super Admin user
-- Password: SuperAdmin@123 (bcrypt hash with salt rounds 10)
INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
VALUES (
    NEWID(), -- Generate new UUID
    'superadmin@telegramautomation.com',
    '$2b$10$YourHashedPasswordHere', -- This will be replaced with actual hash
    'Super',
    'Admin',
    'super_admin',
    1,
    GETDATE(),
    GETDATE()
);

-- Verify the users were created
SELECT id, email, firstName, lastName, role, isActive, createdAt 
FROM users 
WHERE role IN ('admin', 'super_admin'); 