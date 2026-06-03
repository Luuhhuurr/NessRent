const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const { pool } = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');

const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError('No file uploaded', 400);
    }

    const folder = req.body.folder || 'products';
    const fileUrl = `/uploads/${folder}/${req.file.filename}`;

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError('No files uploaded', 400);
    }

    const folder = req.body.folder || 'products';
    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${folder}/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    next(error);
  }
};

const uploadIdentity = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError('No identity document uploaded', 400);
    }

    const userId = req.body.userId;
    const fileUrl = `/uploads/identities/${req.file.filename}`;

    // Update user's identity document if userId provided
    if (userId) {
      await pool.query(
        'UPDATE users SET identity_document = ? WHERE id = ?',
        [fileUrl, userId]
      );
    }

    res.json({
      success: true,
      message: 'Identity document uploaded successfully',
      data: {
        filename: req.file.filename,
        url: fileUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadIdentity,
};