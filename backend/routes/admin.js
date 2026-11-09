const router = require('express').Router();
const {
  getDashboardStats,
  getCategoryStats,
  getRecentBookings,
} = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

// Every route in this router requires a signed-in admin.
router.use(authenticate, requireRole('admin'));

router.get('/stats', asyncHandler(getDashboardStats));
router.get('/categories', asyncHandler(getCategoryStats));
router.get('/recent-bookings', asyncHandler(getRecentBookings));

module.exports = router;
