const userRepository = require('../repositories/userRepository');
const { sendSuccess } = require('../utils/response');
const { parsePagination } = require('../utils/pagination');
const { ApiError } = require('../middleware/errorHandler');

const USER_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  BLACKLIST: 'blacklist',
};

const getAllUsers = async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { status, role, search } = req.query;

  const { rows, total } = await userRepository.findAll({
    status: status?.trim() || null,
    role: role?.trim() || null,
    search: search?.trim() || null,
    limit,
    offset,
  });

  return sendSuccess(res, {
    data: {
      users: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
};

const getUserById = async (req, res) => {
  const userId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(userId)) {
    throw new ApiError('ID pengguna tidak valid', 400);
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError('Pengguna tidak ditemukan', 404);
  }

  // A user may always read their own record; reading anyone else's is
  // reserved for admins.
  if (req.user.role !== 'admin' && req.user.id !== userId) {
    throw new ApiError('Anda tidak memiliki izin untuk melihat data pengguna ini', 403);
  }

  return sendSuccess(res, { data: user });
};

const verifyUser = async (req, res) => {
  const userId = Number.parseInt(req.params.id, 10);
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError('Pengguna tidak ditemukan', 404);
  }

  if (user.status !== USER_STATUS.PENDING) {
    throw new ApiError('Pengguna ini tidak dalam status menunggu verifikasi', 400);
  }

  await userRepository.updateStatus(userId, USER_STATUS.VERIFIED);
  return sendSuccess(res, { message: 'Pengguna berhasil diverifikasi' });
};

const rejectUser = async (req, res) => {
  const userId = Number.parseInt(req.params.id, 10);
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError('Pengguna tidak ditemukan', 404);
  }

  if (user.status === USER_STATUS.BLACKLIST) {
    throw new ApiError('Pengguna yang diblokir tidak bisa ditolak', 400);
  }

  await userRepository.updateStatus(userId, USER_STATUS.REJECTED);
  return sendSuccess(res, { message: 'Pengguna berhasil ditolak' });
};

const blacklistUser = async (req, res) => {
  const userId = Number.parseInt(req.params.id, 10);
  const { reason } = req.body;

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError('Pengguna tidak ditemukan', 404);
  }

  if (user.role === 'admin') {
    throw new ApiError('Akun admin tidak dapat diblokir', 400);
  }

  await userRepository.updateStatus(userId, USER_STATUS.BLACKLIST);
  await userRepository.addToBlacklist({ userId, reason, addedBy: req.user.id });

  return sendSuccess(res, { message: 'Pengguna berhasil diblokir' });
};

const removeFromBlacklist = async (req, res) => {
  const userId = Number.parseInt(req.params.id, 10);
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError('Pengguna tidak ditemukan', 404);
  }

  await userRepository.updateStatus(userId, USER_STATUS.VERIFIED);
  await userRepository.removeFromBlacklist(userId);

  return sendSuccess(res, { message: 'Pengguna berhasil dikeluarkan dari daftar blokir' });
};

const getBlacklistedUsers = async (req, res) => {
  const users = await userRepository.findBlacklisted();
  return sendSuccess(res, { data: { users } });
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
