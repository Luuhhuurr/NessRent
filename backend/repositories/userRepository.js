const { pool } = require('../config/database');

const USER_COLUMNS = 'id, name, email, nim, faculty, phone, role, status, created_at';

const findById = async (id) => {
  const [rows] = await pool.query(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

const findByNimOrEmail = async ({ email, nim }) => {
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ? OR nim = ?', [email, nim]);
  return rows[0] || null;
};

const findAll = async ({ status, role, search, limit, offset }) => {
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (role) {
    conditions.push('role = ?');
    params.push(role);
  }

  if (search) {
    conditions.push('(name LIKE ? OR nim LIKE ? OR email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT ${USER_COLUMNS} FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM users ${where}`, params);

  return { rows, total };
};

const create = async ({ name, email, passwordHash, nim, faculty, phone, status = 'verified' }) => {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, nim, faculty, phone, role, status)
     VALUES (?, ?, ?, ?, ?, ?, 'user', ?)`,
    [name, email, passwordHash, nim, faculty || null, phone || null, status]
  );
  return result.insertId;
};

const updateStatus = async (id, status) => {
  const [result] = await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows > 0;
};

const updateIdentityDocument = async (id, fileUrl) => {
  const [result] = await pool.query('UPDATE users SET identity_document = ? WHERE id = ?', [fileUrl, id]);
  return result.affectedRows > 0;
};

const addToBlacklist = async ({ userId, reason, addedBy }) => {
  await pool.query(
    'INSERT INTO blacklist (user_id, reason, added_by, created_at) VALUES (?, ?, ?, NOW())',
    [userId, reason || 'Tidak ada alasan yang diberikan', addedBy]
  );
};

const removeFromBlacklist = async (userId) => {
  await pool.query('DELETE FROM blacklist WHERE user_id = ?', [userId]);
};

const findBlacklisted = async () => {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.nim, u.faculty, u.status, u.created_at,
            b.reason, b.created_at as blacklisted_at, au.name as added_by_name
     FROM users u
     JOIN blacklist b ON u.id = b.user_id
     LEFT JOIN users au ON b.added_by = au.id
     WHERE u.status = 'blacklist'
     ORDER BY b.created_at DESC`
  );
  return rows;
};

module.exports = {
  findById,
  findByEmail,
  findByNimOrEmail,
  findAll,
  create,
  updateStatus,
  updateIdentityDocument,
  addToBlacklist,
  removeFromBlacklist,
  findBlacklisted,
};
