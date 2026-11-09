const productRepository = require('../repositories/productRepository');
const bookingRepository = require('../repositories/bookingRepository');
const { sendSuccess } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');
const { ApiError } = require('../middleware/errorHandler');
const { BOOKING_STATUS, normalizeStatus } = require('../constants/bookingStatus');
const { calculateDays } = require('../utils/helpers');

const createBooking = async (req, res) => {
  const { product_id, booking_date, end_date, notes } = req.body;
  const renterId = req.user.id;

  const product = await productRepository.findById(product_id);
  if (!product) {
    throw new ApiError('Produk tidak ditemukan', 404);
  }

  if (product.status && product.status !== 'available') {
    throw new ApiError('Produk sedang tidak tersedia untuk disewa', 400);
  }

  if (product.owner_id === renterId) {
    throw new ApiError('Anda tidak dapat menyewa barang milik Anda sendiri', 400);
  }

  if (await bookingRepository.hasActiveBooking({ productId: product_id, userId: renterId })) {
    throw new ApiError('Anda sudah memesan produk ini', 409);
  }

  const endDate = end_date || booking_date;
  const days = calculateDays(booking_date, endDate);
  // The total is calculated from the stored price, never taken from the
  // request body — otherwise a client could set its own price.
  const totalPrice = Number(product.price) * days;

  const bookingId = await bookingRepository.create({
    userId: renterId,
    productId: product_id,
    ownerId: product.owner_id,
    bookingDate: booking_date,
    endDate,
    totalPrice,
    notes: notes?.trim(),
  });

  const booking = await bookingRepository.findById(bookingId);
  return sendSuccess(res, { message: 'Pesanan berhasil dibuat', data: booking, status: 201 });
};

const getUserBookings = async (req, res) => {
  const status = req.query.status ? normalizeStatus(req.query.status) : null;
  const bookings = await bookingRepository.findByRenter({ userId: req.user.id, status });

  return sendSuccess(res, { data: { bookings } });
};

const getBookingById = async (req, res) => {
  const bookingId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(bookingId)) {
    throw new ApiError('ID pesanan tidak valid', 400);
  }

  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new ApiError('Pesanan tidak ditemukan', 404);
  }

  // A booking is visible to the renter (user_id), the seller of the rented
  // item (owner_id), or an admin. Anyone else must not read it.
  const isParticipant =
    booking.user_id === req.user.id ||
    booking.owner_id === req.user.id ||
    req.user.role === 'admin';

  if (!isParticipant) {
    throw new ApiError('Anda tidak memiliki izin untuk melihat pesanan ini', 403);
  }

  return sendSuccess(res, { data: booking });
};

const cancelBooking = async (req, res) => {
  const bookingId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(bookingId)) {
    throw new ApiError('ID pesanan tidak valid', 400);
  }

  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new ApiError('Pesanan tidak ditemukan', 404);
  }

  // Only the renter can cancel, and only while the booking is still pending.
  if (booking.user_id !== req.user.id) {
    throw new ApiError('Anda tidak memiliki izin untuk membatalkan pesanan ini', 403);
  }

  if (booking.status !== BOOKING_STATUS.PENDING) {
    throw new ApiError('Hanya pesanan yang masih menunggu yang dapat dibatalkan', 400);
  }

  await bookingRepository.updateStatus(bookingId, BOOKING_STATUS.CANCELLED);
  return sendSuccess(res, { message: 'Pesanan berhasil dibatalkan' });
};

const getAllBookings = async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const status = req.query.status ? normalizeStatus(req.query.status) : null;

  const { rows, total } = await bookingRepository.findAll({ status, limit, offset });

  return sendSuccess(res, {
    data: {
      bookings: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
};

const updateBookingStatus = async (req, res) => {
  const bookingId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(bookingId)) {
    throw new ApiError('ID pesanan tidak valid', 400);
  }

  const status = normalizeStatus(req.body.status);
  if (!status) {
    throw new ApiError('Status pesanan tidak valid', 400);
  }

  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new ApiError('Pesanan tidak ditemukan', 404);
  }

  await bookingRepository.updateStatus(bookingId, status);
  return sendSuccess(res, { message: `Status pesanan diubah menjadi ${status}`, data: { id: bookingId, status } });
};

const deleteBooking = async (req, res) => {
  const bookingId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(bookingId)) {
    throw new ApiError('ID pesanan tidak valid', 400);
  }

  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new ApiError('Pesanan tidak ditemukan', 404);
  }

  // The seller of the rented item, or an admin, may remove the record.
  if (booking.owner_id !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError('Anda tidak memiliki izin untuk menghapus pesanan ini', 403);
  }

  await bookingRepository.remove(bookingId);
  return sendSuccess(res, { message: 'Pesanan berhasil dihapus' });
};

const getOwnerDeliveries = async (req, res) => {
  const deliveries = await bookingRepository.findByOwner({ ownerId: req.user.id });
  return sendSuccess(res, { data: { deliveries } });
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getOwnerDeliveries,
};
