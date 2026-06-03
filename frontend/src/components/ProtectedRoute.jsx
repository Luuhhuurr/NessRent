/**
 * Authentication utilities
 * These functions help manage auth state but DO NOT handle routing
 */

// Get user from localStorage
export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('nesrent_user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    if (!user || typeof user !== 'object') return null;
    return user;
  } catch {
    return null;
  }
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem('nesrent_token');
  return !!token && !!localStorage.getItem('nesrent_user');
};

// Clear all auth data
export const clearAuth = () => {
  localStorage.removeItem('nesrent_token');
  localStorage.removeItem('nesrent_user');
};

// Save auth data after login
export const saveAuth = (user, token) => {
  localStorage.setItem('nesrent_token', token);
  localStorage.setItem('nesrent_user', JSON.stringify(user));
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('nesrent_token');
};