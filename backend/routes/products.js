const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');
const { authMiddleware, adminMiddleware, optionalAuth } = require('../middleware/auth');
const router = require('express').Router();

router.get('/', optionalAuth, getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', optionalAuth, getProductById);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
