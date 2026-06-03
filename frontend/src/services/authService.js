import api from './api';
import { saveAuth, clearAuth } from '../components/ProtectedRoute';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.success && response.data?.data) {
      saveAuth(response.data.data.user, response.data.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', {
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
      nim: userData.nim,
    });
    return response.data;
  },

  logout: () => {
    clearAuth();
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export default authService;