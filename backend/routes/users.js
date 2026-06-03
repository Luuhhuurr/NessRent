const {
  getAllUsers,
  getUserById,
  verifyUser,
  rejectUser,
  blacklistUser,
  removeFromBlacklist,
  getBlacklistedUsers,
} = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = require('express').Router();

router.get('/', adminMiddleware, getAllUsers);
router.get('/blacklist', adminMiddleware, getBlacklistedUsers);
router.get('/:id', authMiddleware, getUserById);
router.patch('/:id/verify', adminMiddleware, verifyUser);
router.patch('/:id/reject', adminMiddleware, rejectUser);
router.post('/:id/blacklist', adminMiddleware, blacklistUser);
router.delete('/:id/blacklist', adminMiddleware, removeFromBlacklist);

module.exports = router;
