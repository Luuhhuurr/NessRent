const fs = require('fs');
const path = require('path');
const productRepository = require('../repositories/productRepository');
const { sendSuccess } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');
const { ApiError } = require('../middleware/errorHandler');
const { productsDir } = require('../config/multer');

const getProducts = async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { category, search, ownerId } = req.query;

  const { rows, total } = await productRepository.findAll({
    category: category?.trim() || null,
    search: search?.trim() || null,
    ownerId: ownerId ? Number(ownerId) : null,
    limit,
    offset,
  });

  return sendSuccess(res, {
    data: {
      products: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
};

const getProductById = async (req, res) => {
  const productId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(productId)) {
    throw new ApiError('ID produk tidak valid', 400);
  }

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new ApiError('Produk tidak ditemukan', 404);
  }

  return sendSuccess(res, { data: product });
};

const createProduct = async (req, res) => {
  const { product_name, category, condition, price, description } = req.body;
  const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

  const productId = await productRepository.create({
    ownerId: req.user.id,
    productName: product_name.trim(),
    category: category?.trim(),
    condition: condition?.trim(),
    price: Number.parseFloat(price),
    description: description?.trim(),
    imageUrl,
  });

  const product = await productRepository.findById(productId);
  return sendSuccess(res, { message: 'Produk berhasil ditambahkan', data: product, status: 201 });
};

const updateProduct = async (req, res) => {
  const productId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(productId)) {
    throw new ApiError('ID produk tidak valid', 400);
  }

  const existing = await productRepository.findById(productId);
  if (!existing) {
    throw new ApiError('Produk tidak ditemukan', 404);
  }

  // Only the seller who owns the product, or an admin, may edit it.
  if (req.user.role !== 'admin' && existing.owner_id !== req.user.id) {
    throw new ApiError('Anda tidak memiliki izin untuk mengubah produk ini', 403);
  }

  const { product_name, category, condition, price, description } = req.body;
  const fields = {};

  if (product_name !== undefined) fields.product_name = product_name.trim();
  if (category !== undefined) fields.category = category.trim();
  if (condition !== undefined) fields.condition = condition.trim();
  if (price !== undefined) fields.price = Number.parseFloat(price);
  if (description !== undefined) fields.description = description.trim();
  if (req.file) fields.image_url = `/uploads/products/${req.file.filename}`;

  await productRepository.update(productId, fields);

  const product = await productRepository.findById(productId);
  return sendSuccess(res, { message: 'Produk berhasil diperbarui', data: product });
};

const deleteProduct = async (req, res) => {
  const productId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(productId)) {
    throw new ApiError('ID produk tidak valid', 400);
  }

  const existing = await productRepository.findById(productId);
  if (!existing) {
    throw new ApiError('Produk tidak ditemukan', 404);
  }

  // Only the seller who owns the product, or an admin, may delete it.
  if (req.user.role !== 'admin' && existing.owner_id !== req.user.id) {
    throw new ApiError('Anda tidak memiliki izin untuk menghapus produk ini', 403);
  }

  await productRepository.remove(productId);

  // Clean up the image so the uploads folder does not grow without bound.
  if (existing.image_url) {
    const filename = path.basename(existing.image_url);
    const imagePath = path.join(productsDir, filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  return sendSuccess(res, { message: 'Produk berhasil dihapus' });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
