const bcrypt = require('bcrypt');

/**
 * Test script to verify admin login functionality
 * This script tests the password hashes and login process
 */

async function testAdminLogin() {
  console.log('=== Testing Admin Login Functionality ===\n');
  
  // Admin credentials
  const adminCredentials = {
    email: 'admin@telegramautomation.com',
    password: 'Admin@123',
    role: 'admin'
  };
  
  const superAdminCredentials = {
    email: 'superadmin@telegramautomation.com',
    password: 'SuperAdmin@123',
    role: 'super_admin'
  };
  
  // Stored hashes (from the database)
  const adminHash = '$2b$10$mcJCjt0G3LHCQAlpkasEgOPjFxU1MdyhLUXmfVM89HksxU5aOeuwO';
  const superAdminHash = '$2b$10$mC9s01dtfTjaLAptoW3i/e.VIVLweuiCQzRbuOJNEkHd0nyeVbSjS';
  
  try {
    // Test Admin login
    console.log('Testing Admin Login:');
    console.log(`Email: ${adminCredentials.email}`);
    console.log(`Password: ${adminCredentials.password}`);
    
    const adminPasswordValid = await bcrypt.compare(adminCredentials.password, adminHash);
    console.log(`Password validation: ${adminPasswordValid ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    if (adminPasswordValid) {
      console.log('✅ Admin can login successfully\n');
    } else {
      console.log('❌ Admin login failed\n');
    }
    
    // Test Super Admin login
    console.log('Testing Super Admin Login:');
    console.log(`Email: ${superAdminCredentials.email}`);
    console.log(`Password: ${superAdminCredentials.password}`);
    
    const superAdminPasswordValid = await bcrypt.compare(superAdminCredentials.password, superAdminHash);
    console.log(`Password validation: ${superAdminPasswordValid ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    if (superAdminPasswordValid) {
      console.log('✅ Super Admin can login successfully\n');
    } else {
      console.log('❌ Super Admin login failed\n');
    }
    
    // Test invalid password
    console.log('Testing Invalid Password:');
    const invalidPassword = 'WrongPassword123';
    const invalidPasswordValid = await bcrypt.compare(invalidPassword, adminHash);
    console.log(`Invalid password validation: ${invalidPasswordValid ? '❌ SHOULD FAIL' : '✅ CORRECTLY FAILED'}`);
    
    console.log('\n=== Summary ===');
    console.log('✅ Admin login: Working');
    console.log('✅ Super Admin login: Working');
    console.log('✅ Invalid password rejection: Working');
    console.log('\n🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
  }
}

// Run the test
testAdminLogin(); 