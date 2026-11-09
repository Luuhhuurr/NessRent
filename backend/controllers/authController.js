const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const { sendSuccess } = require('../utils/response');
const { ApiError } = require('../middleware/errorHandler');

const PUBLIC_USER_FIELDS = ['id', 'name', 'email', 'nim', 'faculty', 'role', 'status'];

const toPublicUser = (user) =>
  PUBLIC_USER_FIELDS.reduce((acc, field) => ({ ...acc, [field]: user[field] }), {});

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

const register = async (req, res) => {
  const { name, email, password, nim, faculty, phone } = req.body;

  const existing = await userRepository.findByNimOrEmail({ email, nim });
  if (existing) {
    throw new ApiError('Email atau NIM sudah terdaftar', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userId = await userRepository.create({
    name,
    email,
    passwordHash,
    nim,
    faculty,
    phone,
  });

  const user = { id: userId, name, email, nim, faculty, role: 'user', status: 'verified' };

  return sendSuccess(res, {
    message: 'Registrasi berhasil. Silakan masuk.',
    data: { user, token: generateToken(user) },
    status: 201,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  // The same message for both cases so the endpoint cannot be used to find
  // out which email addresses are registered.
  if (!user) {
    throw new ApiError('Email atau password salah', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new ApiError('Email atau password salah', 401);
  }

  if (user.status === 'blacklist') {
    throw new ApiError('Akun Anda telah diblokir. Hubungi admin untuk informasi lebih lanjut.', 403);
  }

  return sendSuccess(res, {
    message: 'Login berhasil',
    data: { user: toPublicUser(user), token: generateToken(user) },
  });
};

const getProfile = async (req, res) => {
  const user = await userRepository.findById(req.user.id);
  if (!user) {
    throw new ApiError('Pengguna tidak ditemukan', 404);
  }

  return sendSuccess(res, { data: toPublicUser(user) });
};

module.exports = { register, login, getProfile, generateToken };
