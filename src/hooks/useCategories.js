import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function useCategories() {
  const { token, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setCategories([]);
      return;
    }

    apiRequest('/categories', { token })
      .then(setCategories)
      .catch((err) => {
        if (err.status === 401) logout();
        console.error('Não foi possível carregar as categorias:', err);
      });
  }, [token]);

  async function addCategory(name, type) {
    setError('');
    try {
      const created = await apiRequest('/categories', {
        method: 'POST',
        token,
        body: { name, type },
      });
      setCategories((prev) => [...prev, created]);
      return true;
    } catch (err) {
      if (err.status === 401) logout();
      setError(err.message);
      return false;
    }
  }

  async function deleteCategory(id) {
    try {
      await apiRequest(`/categories/${id}`, { method: 'DELETE', token });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      if (err.status === 401) logout();
      console.error('Não foi possível excluir a categoria:', err);
      return false;
    }
  }

  return { categories, addCategory, deleteCategory, error };
}
