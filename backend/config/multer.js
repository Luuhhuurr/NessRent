const path = require('path');
const fs = require('fs');
const multer = require('multer');
const env = require('./env');
const { ApiError } = require('../middleware/errorHandler');

const uploadRoot = env.upload.dir;

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const buildStorage = (subFolder) => {
  const destination = ensureDir(path.join(uploadRoot, subFolder));
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, destination),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
    },
  });
};

/**
 * Multer filters on the declared mime type only. The declared type comes
 * from the client, so the extension is checked as well and the file is
 * renamed on disk — an uploaded file is never served under its original name.
 */
const buildFilter = (allowedExtensions, allowedMimeTypes, message) => (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(extension) && allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new ApiError(message, 400));
};

const productImageUpload = multer({
  storage: buildStorage('products'),
  limits: { fileSize: env.upload.maxFileSizeBytes, files: 1 },
  fileFilter: buildFilter(
    ['.jpg', '.jpeg', '.png', '.webp'],
    ['image/jpeg', 'image/png', 'image/webp'],
    'Hanya file gambar (JPG, PNG, WEBP) yang diizinkan'
  ),
});

const productImagesUpload = multer({
  storage: buildStorage('products'),
  limits: { fileSize: env.upload.maxFileSizeBytes, files: 5 },
  fileFilter: buildFilter(
    ['.jpg', '.jpeg', '.png', '.webp'],
    ['image/jpeg', 'image/png', 'image/webp'],
    'Hanya file gambar (JPG, PNG, WEBP) yang diizinkan'
  ),
});

// Identity documents are never served statically — they live outside the
// public mount and are only reachable through the authenticated admin route.
const identityUpload = multer({
  storage: buildStorage('identities'),
  limits: { fileSize: env.upload.maxFileSizeBytes, files: 1 },
  fileFilter: buildFilter(
    ['.jpg', '.jpeg', '.png', '.pdf'],
    ['image/jpeg', 'image/png', 'application/pdf'],
    'Hanya file gambar (JPG, PNG) atau PDF yang diizinkan untuk dokumen identitas'
  ),
});

module.exports = {
  productImageUpload,
  productImagesUpload,
  identityUpload,
  uploadRoot,
  productsDir: path.join(uploadRoot, 'products'),
  identitiesDir: path.join(uploadRoot, 'identities'),
};
