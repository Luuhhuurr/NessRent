import api from '../lib/api';

export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  verifyUser: async (id) => {
    const response = await api.patch(`/users/${id}/verify`);
    return response.data;
  },

  rejectUser: async (id, reason = '') => {
    const response = await api.patch(`/users/${id}/reject`, { reason });
    return response.data;
  },

  blacklistUser: async (id, reason = '') => {
    const response = await api.post(`/users/${id}/blacklist`, { reason });
    return response.data;
  },

  removeFromBlacklist: async (id) => {
    const response = await api.delete(`/users/${id}/blacklist`);
    return response.data;
  },

  getBlacklist: async () => {
    const response = await api.get('/users/blacklist');
    return response.data;
  },
};

export default userService;
