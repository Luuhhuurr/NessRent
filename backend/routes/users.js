const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  verifyUser,
  rejectUser,
  blacklistUser,
  removeFromBlacklist,
  getBlacklistedUsers,
} = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validate, integer } = require('../middleware/validate');

router.get('/', authenticate, requireRole('admin'), asyncHandler(getAllUsers));
router.get('/blacklist', authenticate, requireRole('admin'), asyncHandler(getBlacklistedUsers));

router.get(
  '/:id',
  authenticate,
  validate({ params: { id: [integer('ID pengguna tidak valid')] } }),
  asyncHandler(getUserById)
);

router.patch(
  '/:id/verify',
  authenticate,
  requireRole('admin'),
  validate({ params: { id: [integer('ID pengguna tidak valid')] } }),
  asyncHandler(verifyUser)
);

router.patch(
  '/:id/reject',
  authenticate,
  requireRole('admin'),
  validate({ params: { id: [integer('ID pengguna tidak valid')] } }),
  asyncHandler(rejectUser)
);

router.post(
  '/:id/blacklist',
  authenticate,
  requireRole('admin'),
  validate({ params: { id: [integer('ID pengguna tidak valid')] } }),
  asyncHandler(blacklistUser)
);

router.delete(
  '/:id/blacklist',
  authenticate,
  requireRole('admin'),
  validate({ params: { id: [integer('ID pengguna tidak valid')] } }),
  asyncHandler(removeFromBlacklist)
);

module.exports = router;
