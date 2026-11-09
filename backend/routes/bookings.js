const router = require('express').Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getOwnerDeliveries,
} = require('../controllers/bookingController');
const { authenticate, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validate, required, integer, date, oneOf } = require('../middleware/validate');
const { ALL_STATUSES } = require('../constants/bookingStatus');

// The admin interface may send either the database value or its Indonesian
// label; both are accepted here and translated by the controller.
const ACCEPTED_STATUSES = [
  ...ALL_STATUSES,
  'disetujui',
  'ditolak',
  'selesai',
  'dibatalkan',
  'menunggu',
  'dikonfirmasi',
];

router.use(authenticate);

router.post(
  '/',
  validate({
    body: {
      product_id: [required('Produk wajib dipilih'), integer('ID produk tidak valid')],
      booking_date: [required('Tanggal mulai wajib diisi'), date()],
      end_date: [date()],
    },
  }),
  asyncHandler(createBooking)
);

router.get('/', asyncHandler(getUserBookings));
router.get('/all', requireRole('admin'), asyncHandler(getAllBookings));
router.get('/penyerahan', asyncHandler(getOwnerDeliveries));

router.get(
  '/:id',
  validate({ params: { id: [integer('ID pesanan tidak valid')] } }),
  asyncHandler(getBookingById)
);

router.patch(
  '/:id/cancel',
  validate({ params: { id: [integer('ID pesanan tidak valid')] } }),
  asyncHandler(cancelBooking)
);

router.patch(
  '/:id/status',
  requireRole('admin'),
  validate({
    params: { id: [integer('ID pesanan tidak valid')] },
    body: { status: [required('Status wajib diisi'), oneOf(ACCEPTED_STATUSES, 'Status pesanan tidak valid')] },
  }),
  asyncHandler(updateBookingStatus)
);

router.delete(
  '/:id',
  validate({ params: { id: [integer('ID pesanan tidak valid')] } }),
  asyncHandler(deleteBooking)
);

module.exports = router;
