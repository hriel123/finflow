import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function fromApi(goal) {
  return {
    id: goal.id,
    name: goal.title,
    description: goal.description ?? '',
    category: goal.category,
    icon: goal.icon,
    targetAmount: Number(goal.targetAmount),
    savedAmount: Number(goal.currentAmount),
    deadline: goal.deadline.slice(0, 10),
    createdAt: goal.createdAt,
  };
}

function toApi(goal) {
  const data = {};
  if (goal.name !== undefined) data.title = goal.name;
  if (goal.description !== undefined) data.description = goal.description;
  if (goal.category !== undefined) data.category = goal.category;
  if (goal.icon !== undefined) data.icon = goal.icon;
  if (goal.targetAmount !== undefined) data.targetAmount = goal.targetAmount;
  if (goal.savedAmount !== undefined) data.currentAmount = goal.savedAmount;
  if (goal.deadline !== undefined) data.deadline = goal.deadline;
  return data;
}

export function useGoals() {
  const { token, logout } = useAuth();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (!token) {
      setGoals([]);
      return;
    }

    apiRequest('/goals', { token })
      .then((data) => setGoals(data.map(fromApi)))
      .catch((err) => {
        if (err.status === 401) logout();
        console.error('Não foi possível carregar as metas:', err);
      });
  }, [token]);

  async function addGoal(goal) {
    try {
      const created = await apiRequest('/goals', {
        method: 'POST',
        token,
        body: toApi(goal),
      });
      setGoals((prev) => [fromApi(created), ...prev]);
      return true;
    } catch (err) {
      if (err.status === 401) logout();
      console.error('Não foi possível criar a meta:', err);
      return false;
    }
  }

  async function updateGoal(id, patch) {
    try {
      const updated = await apiRequest(`/goals/${id}`, {
        method: 'PUT',
        token,
        body: toApi(patch),
      });
      setGoals((prev) => prev.map((g) => (g.id === id ? fromApi(updated) : g)));
      return true;
    } catch (err) {
      if (err.status === 401) logout();
      console.error('Não foi possível atualizar a meta:', err);
      return false;
    }
  }

  async function deleteGoal(id) {
    try {
      await apiRequest(`/goals/${id}`, { method: 'DELETE', token });
      setGoals((prev) => prev.filter((g) => g.id !== id));
      return true;
    } catch (err) {
      if (err.status === 401) logout();
      console.error('Não foi possível excluir a meta:', err);
      return false;
    }
  }

  // Deposits/withdrawals hit dedicated backend endpoints that compute the new
  // amount from the database's current value inside that same request,
  // instead of adding a delta to this hook's (possibly stale) local state.
  async function addMoney(id, amount) {
    try {
      const updated = await apiRequest(`/goals/${id}/deposit`, {
        method: 'POST',
        token,
        body: { amount },
      });
      setGoals((prev) => prev.map((g) => (g.id === id ? fromApi(updated) : g)));
      return true;
    } catch (err) {
      if (err.status === 401) logout();
      console.error('Não foi possível adicionar o valor à meta:', err);
      return false;
    }
  }

  async function withdrawMoney(id, amount) {
    try {
      const updated = await apiRequest(`/goals/${id}/withdraw`, {
        method: 'POST',
        token,
        body: { amount },
      });
      setGoals((prev) => prev.map((g) => (g.id === id ? fromApi(updated) : g)));
      return true;
    } catch (err) {
      if (err.status === 401) logout();
      console.error('Não foi possível retirar o valor da meta:', err);
      return false;
    }
  }

  return { goals, addGoal, updateGoal, deleteGoal, addMoney, withdrawMoney };
}
