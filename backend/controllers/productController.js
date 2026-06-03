const { pool } = require('../config/database');

const getAllProducts = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      `SELECT id, product_name, description, price, image_url, created_at FROM products`
    );
    res.json({
      success: true,
      data: {
        products,
        pagination: { page: 1, limit: 10, total: products.length, totalPages: 1 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      `SELECT id, product_name, description, price, image_url, created_at FROM products WHERE id = ?`,
      [req.params.id]
    );
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: products[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { product_name, description, price, image_url } = req.body;
    const [result] = await pool.query(
      `INSERT INTO products (product_name, description, price, image_url, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [product_name, description || '', price || 0, image_url || null]
    );
    const [products] = await pool.query(
      `SELECT id, product_name, description, price, image_url, created_at FROM products WHERE id = ?`,
      [result.insertId]
    );
    res.status(201).json({ success: true, data: products[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { product_name, description, price, image_url } = req.body;
    await pool.query(
      `UPDATE products SET product_name = COALESCE(?, product_name), description = COALESCE(?, description), price = COALESCE(?, price), image_url = COALESCE(?, image_url) WHERE id = ?`,
      [product_name, description, price, image_url, req.params.id]
    );
    const [products] = await pool.query(
      `SELECT id, product_name, description, price, image_url, created_at FROM products WHERE id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: products[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query('SELECT DISTINCT product_name AS category FROM products');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories };