import api from './api';

export const userService = {
  // Get all users (admin only)
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get single user
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Verify user (admin only)
  verifyUser: async (id) => {
    const response = await api.patch(`/users/${id}/verify`);
    return response.data;
  },

  // Reject user (admin only)
  rejectUser: async (id, reason = '') => {
    const response = await api.patch(`/users/${id}/reject`, { reason });
    return response.data;
  },

  // Blacklist user (admin only)
  blacklistUser: async (id, reason = '') => {
    const response = await api.post(`/users/${id}/blacklist`, { reason });
    return response.data;
  },

  // Remove from blacklist (admin only)
  removeFromBlacklist: async (id) => {
    const response = await api.delete(`/users/${id}/blacklist`);
    return response.data;
  },

  // Get blacklisted users (admin only)
  getBlacklist: async () => {
    const response = await api.get('/users/blacklist');
    return response.data;
  },
};

export default userService;