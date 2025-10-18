#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Run this to verify your MySQL connection before starting the app
 * 
 * Usage: node test-db-connection.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '9709303105',
  database: process.env.DB_NAME || 'travel_bucket_list'
};

async function testConnection() {
  console.log('🔍 Testing MySQL Connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}`);
  console.log('  Password: ' + (config.password ? '***' : 'NOT SET'));
  console.log('');

  let connection;

  try {
    // Test connection
    console.log('⏳ Connecting to MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!\n');

    // Test database exists
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [config.database]);
    if (databases.length === 0) {
      console.log('❌ Database does not exist!');
      console.log(`\n💡 Create it by running: mysql -u ${config.user} -p < init.sql\n`);
      return false;
    }
    console.log(`✅ Database '${config.database}' exists\n`);

    // Test tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📊 Found ${tables.length} tables:`);
    
    const expectedTables = [
      'User', 'TripPackage', 'Hotel', 'Transport', 
      'Booking', 'Payment', 'Review', 'Admin', 'Destination'
    ];

    const tableNames = tables.map(t => Object.values(t)[0]);
    
    expectedTables.forEach(tableName => {
      const exists = tableNames.includes(tableName);
      console.log(`  ${exists ? '✅' : '❌'} ${tableName}`);
    });

    const missingTables = expectedTables.filter(t => !tableNames.includes(t));
    if (missingTables.length > 0) {
      console.log(`\n❌ Missing tables: ${missingTables.join(', ')}`);
      console.log(`\n💡 Run: mysql -u ${config.user} -p ${config.database} < init.sql\n`);
      return false;
    }

    console.log('\n📈 Sample data check:');
    
    // Check for sample data
    const checks = [
      { table: 'TripPackage', name: 'Packages' },
      { table: 'Hotel', name: 'Hotels' },
      { table: 'Destination', name: 'Destinations' },
      { table: 'User', name: 'Users' },
      { table: 'Booking', name: 'Bookings' }
    ];

    for (const check of checks) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${check.table}`);
      const count = rows[0].count;
      console.log(`  ${count > 0 ? '✅' : '⚠️ '} ${check.name}: ${count} records`);
    }

    if (checks.some(async (check) => {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${check.table}`);
      return rows[0].count === 0;
    })) {
      console.log('\n💡 To load sample data: mysql -u ' + config.user + ' -p < init.sql\n');
    }

    console.log('\n✨ Database is ready! You can now run: yarn dev\n');
    return true;

  } catch (error) {
    console.error('\n❌ Connection failed!\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('MySQL server is not running.');
      console.log('\n🔧 Start MySQL:');
      console.log('  macOS:   brew services start mysql');
      console.log('  Linux:   sudo service mysql start');
      console.log('  Windows: Start MySQL service from Services\n');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('Access denied. Check your credentials in .env.local');
      console.log('\n🔧 Update .env.local with correct:');
      console.log('  DB_USER=your_username');
      console.log('  DB_PASSWORD=your_password\n');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log(`Database '${config.database}' does not exist.`);
      console.log('\n🔧 Create database:');
      console.log(`  mysql -u ${config.user} -p < init.sql\n`);
    } else {
      console.log('Error:', error.message);
      console.log('Code:', error.code);
    }
    
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
