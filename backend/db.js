const mysql = require('mysql2/promise');

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Update with your MySQL password if any
  database: 'foodHub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database and create table if not exists
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create categories table
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL UNIQUE,
        icon_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createCategoriesTable);
    console.log('✓ Categories table initialized successfully');
    
    // Create dishes table
    const createDishesTable = `
      CREATE TABLE IF NOT EXISTS dishes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        stars DECIMAL(3, 2) DEFAULT 0,
        ratings INT DEFAULT 0,
        price DECIMAL(8, 2) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createDishesTable);
    console.log('✓ Dishes table initialized successfully');
    
    connection.release();
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
}

module.exports = {
  pool,
  initializeDatabase
};
