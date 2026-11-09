import axios from 'axios';
import { API_URL } from './config';
import { getToken, clearAuth } from './auth';

/** Fired when the API rejects the session, so the router can redirect. */
export const UNAUTHORIZED_EVENT = 'nesrent:unauthorized';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.dispatchEvent(
        new CustomEvent(UNAUTHORIZED_EVENT, { detail: { from: window.location.pathname } })
      );
    }
    return Promise.reject(error);
  }
);

/**
 * Pulls a human readable message out of an API error. The backend always
 * answers with `{ success, message }`, so `message` is the reliable field.
 */
export const getErrorMessage = (error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') =>
  error?.response?.data?.message || error?.message || fallback;

/** Field level validation errors, if the backend sent any. */
export const getFieldErrors = (error) => error?.response?.data?.errors || {};

export default api;
