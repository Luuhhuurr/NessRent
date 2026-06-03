const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, nim, faculty, phone } = req.body;

    if (!name || !email || !password || !nim) {
      throw new ApiError('Please provide all required fields', 400);
    }

    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ? OR nim = ?', [email, nim]);
    if (existingUsers.length > 0) {
      throw new ApiError('User with this email or NIM already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, nim, faculty, phone, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, nim, faculty || null, phone || null, 'user', 'verified']
    );

    const user = {
      id: result.insertId,
      name,
      email,
      nim,
      role: 'user',
      status: 'verified',
    };

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now login.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // TEMPORARY ADMIN BACKDOOR - Generate real JWT for admin login
    if (email === 'admin@nesrent.com' && password === 'admin123') {
      const token = jwt.sign(
        { id: 9999, email: 'admin@nesrent.com', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: 9999,
            name: 'Super Admin',
            email: 'admin@nesrent.com',
            role: 'admin',
            status: 'verified',
          },
          token,
        },
      });
    }

    if (!email || !password) {
      throw new ApiError('Please provide email and password', 400);
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    // REMOVED: All status checks - users can login immediately after registration

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          nim: user.nim,
          faculty: user.faculty,
          role: user.role,
          status: user.status,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, nim, faculty, phone, role, status, created_at FROM users WHERE id = ?',
      [req.user.id]
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

module.exports = { register, login, getProfile, generateToken };
