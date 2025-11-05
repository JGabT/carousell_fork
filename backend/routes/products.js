import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT p.*, u.username as seller_name, u.profile_picture_url as seller_picture FROM products p LEFT JOIN users u ON p.seller_id = u.id ORDER BY p.created_at DESC'
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get user's own products (protected)
router.get('/my-listings', authenticateToken, async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT p.*, u.username as seller_name, u.profile_picture_url as seller_picture FROM products p LEFT JOIN users u ON p.seller_id = u.id WHERE p.seller_id = ? ORDER BY p.created_at DESC',
      [req.user.id]
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Error fetching your products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT p.*, u.username as seller_name, u.profile_picture_url as seller_picture FROM products p LEFT JOIN users u ON p.seller_id = u.id WHERE p.id = ?',
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create product (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category, condition, location, latitude, longitude, image_url } = req.body;
    
    if (!title || !price) {
      return res.status(400).json({ message: 'Title and price are required' });
    }

    const [result] = await db.query(
      'INSERT INTO products (title, description, price, category, `condition`, location, latitude, longitude, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, category, condition, location, latitude, longitude, image_url, req.user.id]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: { id: result.insertId, title, description, price, category, condition, location, image_url }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category, condition, location, latitude, longitude, image_url } = req.body;
    
    // Check if product exists and belongs to user
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ? AND seller_id = ?',
      [req.params.id, req.user.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await db.query(
      'UPDATE products SET title = ?, description = ?, price = ?, category = ?, `condition` = ?, location = ?, latitude = ?, longitude = ?, image_url = ? WHERE id = ?',
      [title, description, price, category, condition, location, latitude, longitude, image_url, req.params.id]
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ? AND seller_id = ?',
      [req.params.id, req.user.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router;
