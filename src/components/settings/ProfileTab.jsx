import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { translateServerError } from '../../lib/api.js';

export default function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);
    try {
      await updateProfile(name.trim(), email.trim());
      setSuccess(true);
    } catch (err) {
      setError(translateServerError(err.message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-5 max-w-md">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
          <input
            id="profile-email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>

        {error && <p role="alert" className="text-sm text-expense-600 dark:text-expense-400">{error}</p>}
        {success && <p className="text-sm text-income-600 dark:text-income-400">Perfil atualizado com sucesso.</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors active:scale-[0.98]"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
