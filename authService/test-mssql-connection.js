// Simple script to test MSSQL connection using Windows Authentication
require('dotenv').config();
const sql = require('mssql');

const config = {
  server: 'MYHPPC\\SQLEXPRESS', // Use double backslash for instance name
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || 'telegram_automation',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    // instanceName is not needed when using server as 'MYHPPC\\SQLEXPRESS'
  },
};

if (process.env.DB_AUTH_TYPE === 'ntlm') {
  config.authentication = {
    type: 'ntlm',
    options: {
      domain: process.env.DB_DOMAIN || '',
      userName: '', // Windows Authentication
      password: '',
    },
  };
} else {
  config.user = process.env.DB_USERNAME || 'sa';
  config.password = process.env.DB_PASSWORD || '';
}

console.log('Testing MSSQL connection with config:', config);

sql.connect(config)
  .then(pool => {
    console.log('✅ Connected to SQL Server!');
    return pool.close();
  })
  .catch(err => {
    console.error('❌ Connection failed:', err);
  }); 