const { pool } = require('../config/database');

const BOOKING_COLUMNS = `
  b.id, b.user_id, b.product_id, b.owner_id, b.booking_date, b.end_date,
  b.total_price, b.notes, b.status, b.created_at,
  p.product_name, p.price, p.image_url, p.description
`;

/**
 * Every booking leaves the API in the same shape. Previously the list and
 * the detail endpoint exposed different field names for the same data
 * (start_date vs booking_date, notes vs pickup_location), which forced the
 * frontend to special-case each response.
 */
const mapBooking = (row) => ({
  id: row.id,
  user_id: row.user_id,
  product_id: row.product_id,
  owner_id: row.owner_id,
  product_name: row.product_name,
  description: row.description,
  image_url: row.image_url,
  price: row.price,
  booking_date: row.booking_date,
  end_date: row.end_date,
  total_price: row.total_price,
  notes: row.notes,
  pickup_location: row.notes,
  status: row.status,
  created_at: row.created_at,
});

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${BOOKING_COLUMNS}
     FROM bookings b
     JOIN products p ON b.product_id = p.id
     WHERE b.id = ?`,
    [id]
  );
  return rows[0] ? mapBooking(rows[0]) : null;
};

const findByRenter = async ({ userId, status }) => {
  const conditions = ['b.user_id = ?'];
  const params = [userId];

  if (status) {
    conditions.push('b.status = ?');
    params.push(status);
  }

  const [rows] = await pool.query(
    `SELECT ${BOOKING_COLUMNS}
     FROM bookings b
     JOIN products p ON b.product_id = p.id
     WHERE ${conditions.join(' AND ')}
     ORDER BY b.created_at DESC`,
    params
  );

  return rows.map(mapBooking);
};

const findAll = async ({ status, limit, offset }) => {
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('b.status = ?');
    params.push(status);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT ${BOOKING_COLUMNS}, u.name as customer_name, u.nim as customer_nim
     FROM bookings b
     JOIN products p ON b.product_id = p.id
     JOIN users u ON b.user_id = u.id
     ${where}
     ORDER BY b.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM bookings b ${where}`,
    params
  );

  return {
    rows: rows.map((row) => ({ ...mapBooking(row), customer_name: row.customer_name, customer_nim: row.customer_nim })),
    total,
  };
};

const findByOwner = async ({ ownerId }) => {
  const [rows] = await pool.query(
    `SELECT ${BOOKING_COLUMNS}, u.name as tenant_name, u.nim as tenant_nim
     FROM bookings b
     JOIN products p ON b.product_id = p.id
     JOIN users u ON b.user_id = u.id
     WHERE b.owner_id = ? AND b.status = 'approved'
     ORDER BY b.created_at DESC`,
    [ownerId]
  );

  return rows.map((row) => ({
    ...mapBooking(row),
    tenant_name: row.tenant_name,
    tenant_nim: row.tenant_nim,
  }));
};

const hasActiveBooking = async ({ productId, userId }) => {
  const [rows] = await pool.query(
    `SELECT id FROM bookings
     WHERE product_id = ? AND user_id = ? AND status IN ('pending', 'approved', 'confirmed')
     LIMIT 1`,
    [productId, userId]
  );
  return rows.length > 0;
};

const create = async ({ userId, productId, ownerId, bookingDate, endDate, totalPrice, notes }) => {
  const [result] = await pool.query(
    `INSERT INTO bookings (user_id, product_id, owner_id, booking_date, end_date, total_price, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [userId, productId, ownerId, bookingDate, endDate, totalPrice, notes || null]
  );
  return result.insertId;
};

const updateStatus = async (id, status) => {
  const [result] = await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows > 0;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

const countAll = async () => {
  const [[row]] = await pool.query('SELECT COUNT(*) as count FROM bookings');
  return row.count;
};

const findRecent = async (limit = 10) => {
  const [rows] = await pool.query(
    `SELECT b.id, b.booking_date, b.end_date, b.status, b.total_price,
            u.name as customer_name, p.product_name
     FROM bookings b
     LEFT JOIN users u ON b.user_id = u.id
     LEFT JOIN products p ON b.product_id = p.id
     ORDER BY b.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

module.exports = {
  findById,
  findByRenter,
  findAll,
  findByOwner,
  hasActiveBooking,
  create,
  updateStatus,
  remove,
  countAll,
  findRecent,
};
