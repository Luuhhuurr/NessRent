const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { uploadSingleImage, uploadMultipleImages, uploadIdentity } = require('../controllers/uploadController');

const router = express.Router();

// Configure multer storage
const createStorage = (subFolder) => {
  const uploadPath = path.join(__dirname, `../uploads/${subFolder}`);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
};

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpg, png, gif, webp) and PDF are allowed'));
};

// Multer instances for different upload types
const productStorage = createStorage('products');
const identityStorage = createStorage('identities');

const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

const uploadIdentityDoc = multer({
  storage: identityStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpg, png) and PDF are allowed for identity'));
  },
});

// Upload routes
router.post('/', authMiddleware, uploadProduct.single('image'), uploadSingleImage);
router.post('/multiple', authMiddleware, uploadProduct.array('images', 5), uploadMultipleImages);
router.post('/identity', authMiddleware, uploadIdentityDoc.single('identity'), uploadIdentity);

module.exports = router;