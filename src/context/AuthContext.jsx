import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';

const STORAGE_KEY = 'finflow_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      console.error('Não foi possível ler o token do localStorage:', err);
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    apiRequest('/auth/me', { token })
      .then(setUser)
      .catch(() => {
        persistToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  function persistToken(newToken) {
    setToken(newToken);
    try {
      if (newToken) localStorage.setItem(STORAGE_KEY, newToken);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Não foi possível salvar o token no localStorage:', err);
    }
  }

  async function login(email, password) {
    const { token: newToken } = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const loggedUser = await apiRequest('/auth/me', { token: newToken });
    persistToken(newToken);
    setUser(loggedUser);
  }

  async function register(name, email, password) {
    await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    await login(email, password);
  }

  function logout() {
    persistToken(null);
    setUser(null);
  }

  async function updateProfile(name, email) {
    const updatedUser = await apiRequest('/auth/me', {
      method: 'PUT',
      token,
      body: { name, email },
    });
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
