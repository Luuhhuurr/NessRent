import api from './api';

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get current user's bookings
  getMyBookings: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  // Get single booking by ID
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Cancel a booking
  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Get all bookings (admin only)
  getAllBookings: async (params = {}) => {
    console.log('>>> FRONTEND bookingService.getAllBookings() CALLED WITH PARAMS:', JSON.stringify(params, null, 2));
    const response = await api.get('/bookings/all', { params });
    console.log('>>> FRONTEND API RESPONSE STATUS:', response.status);
    console.log('>>> FRONTEND API RESPONSE DATA:', response.data);
    return response.data;
  },

  // Update booking status (admin only)
  updateBookingStatus: async (id, status) => {
    const numericId = parseInt(id, 10);
    console.log('>>> FRONTEND updateBookingStatus() CALLED');
    console.log('>>> FRONTEND updateBookingStatus() ID:', id, '| Parsed:', numericId, '| Type:', typeof id);
    console.log('>>> FRONTEND updateBookingStatus() STATUS:', status, '| Type:', typeof status);
    console.log('>>> FRONTEND updateBookingStatus() Full URL:', `/bookings/${numericId}/status`);
    console.log('>>> FRONTEND updateBookingStatus() Request body:', { status });

    const response = await api.patch(`/bookings/${numericId}/status`, { status });
    console.log('>>> FRONTEND updateBookingStatus() Response status:', response.status);
    console.log('>>> FRONTEND updateBookingStatus() Response data:', response.data);
    return response.data;
  },
};

export default bookingService;