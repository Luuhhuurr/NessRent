const router = require('express').Router();
const {
  uploadSingleImage,
  uploadMultipleImages,
  uploadIdentity,
  downloadIdentity,
} = require('../controllers/uploadController');
const { authenticate, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');
const {
  productImageUpload,
  productImagesUpload,
  identityUpload,
} = require('../config/multer');

router.use(authenticate);

router.post('/', productImageUpload.single('image'), asyncHandler(uploadSingleImage));
router.post('/multiple', productImagesUpload.array('images', 5), asyncHandler(uploadMultipleImages));
router.post('/identity', identityUpload.single('identity'), asyncHandler(uploadIdentity));

// Identity documents are not served statically, so an admin retrieves them
// through this authenticated route.
router.get(
  '/identity/:filename',
  requireRole('admin'),
  asyncHandler(downloadIdentity)
);

module.exports = router;
