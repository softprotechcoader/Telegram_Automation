const bcrypt = require('bcrypt');

/**
 * Generate bcrypt hashes for admin passwords
 * This script creates properly hashed passwords for Admin and Super_Admin users
 */

async function generateHashes() {
  const adminPassword = 'Admin@123';
  const superAdminPassword = 'SuperAdmin@123';
  
  try {
    // Generate bcrypt hashes with salt rounds of 10
    const adminHash = await bcrypt.hash(adminPassword, 10);
    const superAdminHash = await bcrypt.hash(superAdminPassword, 10);
    
    console.log('=== Generated Password Hashes ===');
    console.log('Admin Password:', adminPassword);
    console.log('Admin Hash:', adminHash);
    console.log('\nSuper Admin Password:', superAdminPassword);
    console.log('Super Admin Hash:', superAdminHash);
    
    console.log('\n=== Complete SQL Insert Statements ===');
    console.log('-- Run these in your SQL Server database:');
    console.log('');
    
    // Generate complete SQL statements
    const sqlStatements = `
-- Insert Admin user
INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
VALUES (
    NEWID(),
    'admin@telegramautomation.com',
    '${adminHash}',
    'Admin',
    'User',
    'admin',
    1,
    GETDATE(),
    GETDATE()
);

-- Insert Super Admin user
INSERT INTO users (id, email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
VALUES (
    NEWID(),
    'superadmin@telegramautomation.com',
    '${superAdminHash}',
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
`;
    
    console.log(sqlStatements);
    
    console.log('\n=== Login Credentials ===');
    console.log('Admin Login:');
    console.log('  Email: admin@telegramautomation.com');
    console.log('  Password: Admin@123');
    console.log('\nSuper Admin Login:');
    console.log('  Email: superadmin@telegramautomation.com');
    console.log('  Password: SuperAdmin@123');
    
  } catch (error) {
    console.error('Error generating hashes:', error);
  }
}

// Run the hash generation
generateHashes(); 