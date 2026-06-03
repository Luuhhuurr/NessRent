const { pool } = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');

const getAllUsers = async (req, res, next) => {
  try {
    const { status, role, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, email, nim, faculty, phone, role, status, created_at FROM users WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      query += ' AND (name LIKE ? OR nim LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(
      query.replace('SELECT id, name, email, nim, faculty, phone, role, status, created_at', 'SELECT COUNT(*) as total'),
      params
    );
    const total = countResult[0].total;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      'SELECT id, name, email, nim, faculty, phone, role, status, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      throw new ApiError('User not found', 404);
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      throw new ApiError('User not found', 404);
    }

    if (users[0].status !== 'pending') {
      throw new ApiError('User is not in pending status', 400);
    }

    await pool.query('UPDATE users SET status = ? WHERE id = ?', ['verified', id]);

    res.json({
      success: true,
      message: 'User verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

const rejectUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      throw new ApiError('User not found', 404);
    }

    await pool.query('UPDATE users SET status = ? WHERE id = ?', ['rejected', id]);

    res.json({
      success: true,
      message: 'User rejected',
    });
  } catch (error) {
    next(error);
  }
};

const blacklistUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      throw new ApiError('User not found', 404);
    }

    await pool.query('UPDATE users SET status = ? WHERE id = ?', ['blacklist', id]);

    await pool.query(
      'INSERT INTO blacklist (user_id, reason, added_by, created_at) VALUES (?, ?, ?, NOW())',
      [id, reason || 'No reason provided', req.user.id]
    );

    res.json({
      success: true,
      message: 'User blacklisted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const removeFromBlacklist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      throw new ApiError('User not found', 404);
    }

    await pool.query('UPDATE users SET status = ? WHERE id = ?', ['verified', id]);
    await pool.query('DELETE FROM blacklist WHERE user_id = ?', [id]);

    res.json({
      success: true,
      message: 'User removed from blacklist',
    });
  } catch (error) {
    next(error);
  }
};

const getBlacklistedUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      `SELECT u.*, b.reason, b.created_at as blacklisted_at, au.name as added_by_name
       FROM users u
       JOIN blacklist b ON u.id = b.user_id
       LEFT JOIN users au ON b.added_by = au.id
       WHERE u.status = 'blacklist'
       ORDER BY b.created_at DESC`
    );

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  verifyUser,
  rejectUser,
  blacklistUser,
  removeFromBlacklist,
  getBlacklistedUsers,
};
