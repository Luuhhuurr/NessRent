import api from '../lib/api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  getAllBookings: async (params = {}) => {
    const response = await api.get('/bookings/all', { params });
    return response.data;
  },

  // Bookings of the products the signed-in user owns.
  getOwnerDeliveries: async () => {
    const response = await api.get('/bookings/penyerahan');
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${parseInt(id, 10)}/status`, { status });
    return response.data;
  },
};

export default bookingService;
