const express = require('express');
const cors = require('cors');
const { pool, initializeDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
initializeDatabase();

// ==================== API ROUTES ====================

// GET - Fetch all dishes for home page
app.get('/api/dishes', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const query = `
      SELECT id, title, description, stars, ratings, price, image_url 
      FROM dishes 
      ORDER BY created_at DESC
    `;
    
    const [dishes] = await connection.execute(query);
    connection.release();
    
    res.status(200).json({
      success: true,
      message: 'Dishes fetched successfully',
      data: dishes,
      count: dishes.length
    });
  } catch (error) {
    console.error('Error fetching dishes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching dishes',
      error: error.message
    });
  }
});

// GET - Fetch dishes with filters
app.get('/api/dishes/filter', async (req, res) => {
  try {
    const { minPrice, maxPrice, minRating, sortBy } = req.query;
    
    let query = 'SELECT id, title, description, stars, ratings, price, image_url FROM dishes WHERE 1=1';
    
    // Add price filter
    if (minPrice) {
      query += ` AND price >= ${parseFloat(minPrice)}`;
    }
    if (maxPrice) {
      query += ` AND price <= ${parseFloat(maxPrice)}`;
    }
    
    // Add rating filter
    if (minRating) {
      query += ` AND stars >= ${parseFloat(minRating)}`;
    }
    
    // Add sorting
    if (sortBy === 'price-low') {
      query += ' ORDER BY price ASC';
    } else if (sortBy === 'price-high') {
      query += ' ORDER BY price DESC';
    } else if (sortBy === 'rating') {
      query += ' ORDER BY stars DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    const connection = await pool.getConnection();
    const [dishes] = await connection.execute(query);
    connection.release();
    
    res.status(200).json({
      success: true,
      message: 'Filtered dishes fetched successfully',
      data: dishes,
      count: dishes.length
    });
  } catch (error) {
    console.error('Error fetching filtered dishes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching dishes',
      error: error.message
    });
  }
});

// GET - Fetch single dish by ID
app.get('/api/dishes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const query = `
      SELECT id, title, description, stars, ratings, price, image_url 
      FROM dishes 
      WHERE id = ?
    `;
    
    const [dishes] = await connection.execute(query, [id]);
    connection.release();
    
    if (dishes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Dish fetched successfully',
      data: dishes[0]
    });
  } catch (error) {
    console.error('Error fetching dish:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching dish',
      error: error.message
    });
  }
});

// POST - Add new dish (for admin panel)
app.post('/api/dishes', async (req, res) => {
  try {
    const { title, description, stars, ratings, price, image_url } = req.body;
    
    // Validation
    if (!title || !description || !price || !image_url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, price, image_url'
      });
    }
    
    const connection = await pool.getConnection();
    
    const query = `
      INSERT INTO dishes (title, description, stars, ratings, price, image_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await connection.execute(query, [
      title,
      description,
      stars || 0,
      ratings || 0,
      parseFloat(price),
      image_url
    ]);
    
    connection.release();
    
    res.status(201).json({
      success: true,
      message: 'Dish added successfully',
      data: {
        id: result.insertId,
        title,
        description,
        stars: stars || 0,
        ratings: ratings || 0,
        price: parseFloat(price),
        image_url
      }
    });
  } catch (error) {
    console.error('Error adding dish:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error adding dish',
      error: error.message
    });
  }
});

// PUT - Update dish
app.put('/api/dishes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, stars, ratings, price, image_url } = req.body;
    
    const connection = await pool.getConnection();
    
    const query = `
      UPDATE dishes 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          stars = COALESCE(?, stars),
          ratings = COALESCE(?, ratings),
          price = COALESCE(?, price),
          image_url = COALESCE(?, image_url)
      WHERE id = ?
    `;
    
    const [result] = await connection.execute(query, [
      title || null,
      description || null,
      stars || null,
      ratings || null,
      price ? parseFloat(price) : null,
      image_url || null,
      id
    ]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Dish updated successfully'
    });
  } catch (error) {
    console.error('Error updating dish:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating dish',
      error: error.message
    });
  }
});

// DELETE - Delete dish
app.delete('/api/dishes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const query = 'DELETE FROM dishes WHERE id = ?';
    
    const [result] = await connection.execute(query, [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting dish:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting dish',
      error: error.message
    });
  }
});

// ==================== CATEGORIES API ====================

// GET - Fetch all categories
app.get('/api/categories', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const query = `
      SELECT id, title, icon_url, created_at 
      FROM categories 
      ORDER BY created_at ASC
    `;
    
    const [categories] = await connection.execute(query);
    connection.release();
    
    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// GET - Fetch single category
app.get('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const query = `
      SELECT id, title, icon_url, created_at 
      FROM categories 
      WHERE id = ?
    `;
    
    const [categories] = await connection.execute(query, [id]);
    connection.release();
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: categories[0]
    });
  } catch (error) {
    console.error('Error fetching category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
});

// POST - Add new category
app.post('/api/categories', async (req, res) => {
  try {
    const { title, icon_url } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title'
      });
    }
    
    const connection = await pool.getConnection();
    
    const query = `
      INSERT INTO categories (title, icon_url) 
      VALUES (?, ?)
    `;
    
    const [result] = await connection.execute(query, [title, icon_url || null]);
    connection.release();
    
    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      data: {
        id: result.insertId,
        title,
        icon_url: icon_url || null
      }
    });
  } catch (error) {
    console.error('Error adding category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error adding category',
      error: error.message
    });
  }
});

// PUT - Update category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, icon_url } = req.body;
    
    const connection = await pool.getConnection();
    
    const query = `
      UPDATE categories 
      SET title = COALESCE(?, title),
          icon_url = COALESCE(?, icon_url)
      WHERE id = ?
    `;
    
    const [result] = await connection.execute(query, [
      title || null,
      icon_url || null,
      id
    ]);
    
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

// DELETE - Delete category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const query = 'DELETE FROM categories WHERE id = ?';
    
    const [result] = await connection.execute(query, [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`\n✓ FoodHub API Server running on http://localhost:${PORT}`);
  console.log(`\n Available Routes:`);
  console.log(`  GET  /api/dishes              - Get all dishes`);
  console.log(`  GET  /api/dishes/filter       - Get filtered dishes`);
  console.log(`  GET  /api/dishes/:id          - Get single dish`);
  console.log(`  POST /api/dishes              - Add new dish`);
  console.log(`  PUT  /api/dishes/:id          - Update dish`);
  console.log(`  DELETE /api/dishes/:id        - Delete dish`);
  console.log(`  GET  /api/categories          - Get all categories`);
  console.log(`  GET  /api/categories/:id      - Get single category`);
  console.log(`  POST /api/categories          - Add new category`);
  console.log(`  PUT  /api/categories/:id      - Update category`);
  console.log(`  DELETE /api/categories/:id    - Delete category\n`);
});
