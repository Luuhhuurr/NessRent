const { pool } = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');

const createBooking = async (req, res, next) => {
  try {
    const { product_id, booking_date, notes } = req.body;
    const userId = req.user.id;

    if (!product_id || !booking_date) {
      throw new ApiError('Please provide required fields', 400);
    }

    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      throw new ApiError('Product not found', 404);
    }

    const [existing] = await pool.query('SELECT * FROM bookings WHERE product_id = ? AND user_id = ? AND status IN ("pending", "approved")', [product_id, userId]);
    if (existing.length > 0) {
      throw new ApiError('Product already booked', 400);
    }

    const [result] = await pool.query(
      'INSERT INTO bookings (user_id, product_id, booking_date) VALUES (?, ?, ?)',
      [userId, product_id, booking_date]
    );

    const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: bookings[0] });
  } catch (error) {
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = `
      SELECT b.id, b.user_id, b.product_id, b.booking_date, b.status, b.created_at,
             p.product_name, p.price, p.image_url, p.description
      FROM bookings b
      JOIN products p ON b.product_id = p.id
      WHERE b.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    query += ' ORDER BY b.created_at DESC';
    const [bookings] = await pool.query(query, params);

    // Map booking_date to start_date for frontend compatibility
    // Calculate total_price from product price (stored as numeric, display as *1000)
    const formattedBookings = bookings.map(b => ({
      id: b.id,
      user_id: b.user_id,
      product_id: b.product_id,
      booking_date: b.booking_date,
      start_date: b.booking_date,
      end_date: b.booking_date,
      status: b.status,
      created_at: b.created_at,
      product_name: b.product_name,
      price: b.price,
      image_url: b.image_url,
      description: b.description,
      total_price: b.price, // Use product price as total (frontend multiplies by 1000)
    }));

    res.json({ success: true, data: formattedBookings });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [bookings] = await pool.query(
      `SELECT b.*, p.product_name, p.image_url
       FROM bookings b
       JOIN products p ON b.product_id = p.id
       WHERE b.id = ?`,
      [id]
    );

    if (bookings.length === 0) {
      throw new ApiError('Booking not found', 404);
    }

    res.json({ success: true, data: bookings[0] });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (bookings.length === 0) {
      throw new ApiError('Booking not found', 404);
    }

    if (bookings[0].user_id !== userId) {
      throw new ApiError('Not authorized', 403);
    }

    if (bookings[0].status !== 'pending') {
      throw new ApiError('Can only cancel pending bookings', 400);
    }

    await pool.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [id]);
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    console.log('[getAllBookings] ==================');
    console.log('[getAllBookings] req.query:', req.query);

    // DEBUG: Check raw bookings table structure
    const [columnDetails] = await pool.query("SHOW COLUMNS FROM bookings LIKE 'status'");
    console.log('[getAllBookings] 🚨 TYPE ENUM DATABASE YANG SEBENARNYA:', columnDetails[0]);

    // DEBUG: Check raw bookings table
    const [rawBookings] = await pool.query("SELECT * FROM bookings LIMIT 5");
    console.log('[getAllBookings] RAW BOOKINGS SAMPLE:', JSON.stringify(rawBookings, null, 2));

    // Normalize status parameter - DB uses ENUM: pending, confirmed, cancelled
    let cleanStatus = req.query.status ? req.query.status.toLowerCase().trim() : null;

    // Map frontend status to actual DB ENUM values
    if (cleanStatus === 'approved' || cleanStatus === 'disetujui') {
      cleanStatus = 'confirmed';
    } else if (cleanStatus === 'rejected' || cleanStatus === 'ditolak') {
      cleanStatus = 'cancelled';
    } else if (cleanStatus === 'completed' || cleanStatus === 'selesai') {
      cleanStatus = 'cancelled';  // completed maps to cancelled
    }

    // Build query with LEFT JOINs to get user and product details
    let query = `
      SELECT
        b.*,
        p.product_name,
        p.price,
        p.image_url,
        u.name AS customer_name,
        u.nim AS customer_nim
      FROM bookings b
      LEFT JOIN products p ON b.product_id = p.id
      LEFT JOIN users u ON b.user_id = u.id
    `;

    // Execute query with appropriate filter - DB ENUM: pending, confirmed, cancelled
    let result;

    if (cleanStatus === 'confirmed') {
      console.log('[getAllBookings] Filtering for Confirmed (approved)');
      query += " WHERE LOWER(b.status) = 'confirmed' ORDER BY b.created_at DESC LIMIT 50";
      result = await pool.query(query);
    } else if (cleanStatus === 'pending') {
      console.log('[getAllBookings] Filtering for Pending');
      query += " WHERE LOWER(b.status) = 'pending' ORDER BY b.created_at DESC LIMIT 50";
      result = await pool.query(query);
    } else if (cleanStatus === 'cancelled') {
      console.log('[getAllBookings] Filtering for Cancelled (rejected/completed)');
      query += " WHERE LOWER(b.status) = 'cancelled' ORDER BY b.created_at DESC LIMIT 50";
      result = await pool.query(query);
    } else {
      console.log('[getAllBookings] No status filter - fetching all');
      query += " ORDER BY b.created_at DESC LIMIT 50";
      result = await pool.query(query);
    }

    const [rows] = result;

    console.log('[getAllBookings] FINAL QUERY:', query);

    console.log('[getAllBookings] Row count:', rows.length);
    if (rows.length > 0) {
      console.log('[getAllBookings] Statuses:', rows.map(r => r.status));
    }

    res.status(200).json({
      success: true,
      data: {
        bookings: rows
      }
    });
  } catch (err) {
    console.log('[getAllBookings] ❌ ACTUAL SQL ERROR OBJECT:', err);
    console.log('[getAllBookings] ❌ ERROR NAME:', err.name);
    console.log('[getAllBookings] ❌ ERROR MESSAGE:', err.message);
    console.log('[getAllBookings] ❌ ERROR CODE:', err.code);
    return res.status(500).json({ success: false, message: 'Server error: ' + (err.message || 'Unknown error') });
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    // Parse ID as integer
    const id = parseInt(req.params.id, 10);

    // Parse status with defensive fallback
    let status = req.body.status || req.body.newStatus || '';

    console.log('[updateBookingStatus] ==================');
    console.log('[updateBookingStatus] Request body:', req.body);
    console.log('[updateBookingStatus] Raw status value:', status, '| Type:', typeof status);
    console.log('[updateBookingStatus] ID:', id);

    // VALIDATION
    if (!id || isNaN(id)) {
      console.log('[updateBookingStatus] ❌ ERROR: Invalid booking ID!');
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    // DEFENSIVE: If status is empty, use 'confirmed' as default (matches DB ENUM)
    if (!status || typeof status !== 'string') {
      console.log('[updateBookingStatus] ⚠️ Status is empty/invalid, defaulting to "confirmed"');
      status = 'confirmed';
    }

    // NORMALIZE STATUS to DB ENUM values: pending, confirmed, cancelled
    status = status.toLowerCase().trim();
    if (status === 'approved' || status === 'disetujui' || status === 'confirmed') {
      status = 'confirmed';
    } else if (status === 'rejected' || status === 'ditolak' || status === 'cancelled') {
      status = 'cancelled';
    } else if (status === 'completed' || status === 'selesai') {
      status = 'cancelled';  // completed maps to cancelled
    }

    console.log('[updateBookingStatus] FINAL status to save (DB ENUM):', status);

    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      console.log('[updateBookingStatus] ❌ ERROR: Invalid status:', status);
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // VERIFY BOOKING EXISTS
    const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (bookings.length === 0) {
      console.log('[updateBookingStatus] ❌ ERROR - Booking not found!');
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    console.log('[updateBookingStatus] Current status in DB:', bookings[0].status);
    console.log('[updateBookingStatus] About to UPDATE id:', id, '-> status:', status);

    // EXECUTE UPDATE
    const [result] = await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    console.log('[updateBookingStatus] Update result:', result);

    // VERIFY THE UPDATE
    const [updatedBookings] = await pool.query('SELECT id, status FROM bookings WHERE id = ?', [id]);
    console.log('[updateBookingStatus] Verification - New status:', updatedBookings[0]?.status);
    console.log('[updateBookingStatus] ==================');

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: { id, status }
    });
  } catch (error) {
    console.error('[updateBookingStatus] ❌ CRITICAL ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
};
