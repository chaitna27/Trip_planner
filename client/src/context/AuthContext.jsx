import { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'tripai_token';
const USER_KEY  = 'tripai_user';

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true); // true while we hydrate from storage

  // ── Hydrate from localStorage on mount ─────────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser  = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ── Persist helpers ─────────────────────────────────────────────────────────
  const persistSession = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY,  JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  // ── register() ─────────────────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, password }) => {
    const { data } = await axiosInstance.post('/api/auth/register', {
      name,
      email,
      password,
    });
    // Backend returns token + user on register — but we redirect to login
    // so we don't persist the session here.
    return data;
  }, []);

  // ── login() ────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    const { data } = await axiosInstance.post('/api/auth/login', {
      email,
      password,
    });
    if (data.success) {
      persistSession(data.token, data.user);
    }
    return data;
  }, []);

  // ── logout() ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearSession();
    toast.success('Logged out successfully');
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
