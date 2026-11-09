const router = require('express').Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validate, required, string, positiveNumber, integer } = require('../middleware/validate');
const { productImageUpload } = require('../config/multer');

// The catalogue is public.
router.get('/', asyncHandler(getProducts));
router.get(
  '/:id',
  validate({ params: { id: [integer('ID produk tidak valid')] } }),
  asyncHandler(getProductById)
);

// Adding and editing requires a signed-in user. The controllers check
// ownership, so a seller can only change their own products.
router.post(
  '/',
  authenticate,
  productImageUpload.single('image'),
  validate({
    body: {
      product_name: [required('Nama produk wajib diisi'), string({ min: 3, max: 255, label: 'Nama produk' })],
      price: [required('Harga wajib diisi'), positiveNumber('Harga harus lebih besar dari nol')],
    },
  }),
  asyncHandler(createProduct)
);

router.put(
  '/:id',
  authenticate,
  productImageUpload.single('image'),
  validate({ params: { id: [integer('ID produk tidak valid')] } }),
  asyncHandler(updateProduct)
);

router.delete(
  '/:id',
  authenticate,
  validate({ params: { id: [integer('ID produk tidak valid')] } }),
  asyncHandler(deleteProduct)
);

module.exports = router;
