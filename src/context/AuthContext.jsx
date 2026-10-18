import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';
import { DEMO_TOKEN, clearDemo } from '../lib/demo.js';

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
      .catch((err) => {
        // Only a genuine auth failure (expired/invalid token) should sign the
        // user out. A network hiccup or a cold backend (e.g. Render's free
        // tier waking up) must not wipe a token that's still valid.
        if (err.status === 401) {
          persistToken(null);
          setUser(null);
        }
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
    if (token === DEMO_TOKEN) clearDemo();
    persistToken(null);
    setUser(null);
  }

  // Entra sem conta, com dados de exemplo guardados só neste navegador.
  async function startDemo() {
    const demoUser = await apiRequest('/auth/me', { token: DEMO_TOKEN });
    persistToken(DEMO_TOKEN);
    setUser(demoUser);
  }

  async function requestPasswordReset(email) {
    await apiRequest('/auth/forgot', { method: 'POST', body: { email } });
  }

  async function resetPassword(resetToken, password) {
    const { token: newToken } = await apiRequest('/auth/reset', {
      method: 'POST',
      body: { token: resetToken, password },
    });
    const loggedUser = await apiRequest('/auth/me', { token: newToken });
    persistToken(newToken);
    setUser(loggedUser);
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
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isDemo: token === DEMO_TOKEN,
        login,
        register,
        logout,
        updateProfile,
        startDemo,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
