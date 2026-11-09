import api from '../lib/api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getCategoryStats: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  getRecentBookings: async () => {
    const response = await api.get('/admin/recent-bookings');
    return response.data;
  },
};

export default adminService;
