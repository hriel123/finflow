import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function normalize(transaction) {
  return {
    ...transaction,
    amount: Number(transaction.amount),
    date: transaction.date.slice(0, 10),
  };
}

export function useTransactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!token) {
      setTransactions([]);
      return;
    }

    apiRequest('/transactions', { token })
      .then((data) => setTransactions(data.map(normalize)))
      .catch((err) => console.error('Não foi possível carregar as transações:', err));
  }, [token]);

  async function addTransaction(transaction) {
    try {
      const created = await apiRequest('/transactions', {
        method: 'POST',
        token,
        body: transaction,
      });
      setTransactions((prev) => [normalize(created), ...prev]);
    } catch (err) {
      console.error('Não foi possível criar a transação:', err);
    }
  }

  async function updateTransaction(id, patch) {
    try {
      const updated = await apiRequest(`/transactions/${id}`, {
        method: 'PUT',
        token,
        body: patch,
      });
      setTransactions((prev) => prev.map((t) => (t.id === id ? normalize(updated) : t)));
    } catch (err) {
      console.error('Não foi possível atualizar a transação:', err);
    }
  }

  async function deleteTransaction(id) {
    try {
      await apiRequest(`/transactions/${id}`, { method: 'DELETE', token });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Não foi possível excluir a transação:', err);
    }
  }

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    income,
    expense,
    balance,
  };
}
