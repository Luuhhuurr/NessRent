const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = require('express').Router();

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getUserBookings);
router.get('/all', authMiddleware, adminMiddleware, getAllBookings);
router.get('/:id', authMiddleware, getBookingById);
router.patch('/:id/cancel', authMiddleware, cancelBooking);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateBookingStatus);

module.exports = router;
