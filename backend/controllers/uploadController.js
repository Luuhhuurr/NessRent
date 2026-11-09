const fs = require('fs');
const path = require('path');
const userRepository = require('../repositories/userRepository');
const { sendSuccess } = require('../utils/response');
const { ApiError } = require('../middleware/errorHandler');
const { identitiesDir } = require('../config/multer');

const uploadSingleImage = async (req, res) => {
  if (!req.file) {
    throw new ApiError('Tidak ada file yang diunggah', 400);
  }

  return sendSuccess(res, {
    message: 'File berhasil diunggah',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/products/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
};

const uploadMultipleImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError('Tidak ada file yang diunggah', 400);
  }

  const files = req.files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    url: `/uploads/products/${file.filename}`,
    size: file.size,
    mimetype: file.mimetype,
  }));

  return sendSuccess(res, {
    message: `${files.length} file berhasil diunggah`,
    data: { files },
  });
};

const uploadIdentity = async (req, res) => {
  if (!req.file) {
    throw new ApiError('Tidak ada dokumen identitas yang diunggah', 400);
  }

  // The document always belongs to the authenticated user — never to a user
  // id supplied by the client, which would let anyone overwrite somebody
  // else's identity file.
  const fileUrl = `/uploads/identities/${req.file.filename}`;
  await userRepository.updateIdentityDocument(req.user.id, fileUrl);

  return sendSuccess(res, {
    message: 'Dokumen identitas berhasil diunggah',
    data: { filename: req.file.filename, url: fileUrl },
  });
};

/**
 * Identity documents are deliberately not served from the static uploads
 * mount. Admins fetch them through this authenticated route instead.
 */
const downloadIdentity = async (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(identitiesDir, filename);

  if (!fs.existsSync(filePath)) {
    throw new ApiError('Dokumen identitas tidak ditemukan', 404);
  }

  return res.sendFile(filePath);
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadIdentity,
  downloadIdentity,
};
