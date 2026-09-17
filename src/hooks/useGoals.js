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
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (!token) {
      setGoals([]);
      return;
    }

    apiRequest('/goals', { token })
      .then((data) => setGoals(data.map(fromApi)))
      .catch((err) => console.error('Não foi possível carregar as metas:', err));
  }, [token]);

  async function addGoal(goal) {
    try {
      const created = await apiRequest('/goals', {
        method: 'POST',
        token,
        body: toApi(goal),
      });
      setGoals((prev) => [fromApi(created), ...prev]);
    } catch (err) {
      console.error('Não foi possível criar a meta:', err);
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
    } catch (err) {
      console.error('Não foi possível atualizar a meta:', err);
    }
  }

  async function deleteGoal(id) {
    try {
      await apiRequest(`/goals/${id}`, { method: 'DELETE', token });
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Não foi possível excluir a meta:', err);
    }
  }

  async function addMoney(id, amount) {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    await updateGoal(id, { savedAmount: goal.savedAmount + amount });
  }

  async function withdrawMoney(id, amount) {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    await updateGoal(id, { savedAmount: Math.max(0, goal.savedAmount - amount) });
  }

  return { goals, addGoal, updateGoal, deleteGoal, addMoney, withdrawMoney };
}
