import axios from 'axios';

// ── Base URL ──────────────────────────────────────────────────────────────────
// In dev: Vite's proxy forwards /api → http://localhost:5000
// In prod: set VITE_API_BASE_URL in your hosting env (e.g. Vercel)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 s — generous for AI generation endpoint
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tripai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / invalid — clear storage
      localStorage.removeItem('tripai_token');
      localStorage.removeItem('tripai_user');
      // Let the ProtectedRoute handle the redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
