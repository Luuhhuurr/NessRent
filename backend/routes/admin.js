const { getDashboardStats, getCategoryStats, getRecentBookings } = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = require('express').Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', getDashboardStats);
router.get('/categories', getCategoryStats);
router.get('/recent-bookings', getRecentBookings);

module.exports = router;
