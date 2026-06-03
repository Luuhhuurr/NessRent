import api from './api';

export const adminService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get category statistics
  getCategoryStats: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  // Get recent bookings
  getRecentBookings: async () => {
    const response = await api.get('/admin/recent-bookings');
    return response.data;
  },
};

export default adminService;