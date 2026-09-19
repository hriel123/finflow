import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVER_ERROR_MESSAGES = {
  'invalid credentials': 'E-mail ou senha incorretos.',
  'invalid email format': 'Informe um e-mail válido.',
  'password must be at least 6 characters long': 'A senha deve ter pelo menos 6 caracteres.',
  'name, email and password are required': 'Preencha nome, e-mail e senha.',
  'email and password are required': 'Preencha e-mail e senha.',
  'email already registered': 'Este e-mail já está cadastrado.',
};

function translateServerError(message) {
  return SERVER_ERROR_MESSAGES[message] ?? message;
}

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const newErrors = {};
    if (mode === 'register' && !name.trim()) {
      newErrors.name = 'Informe seu nome.';
    }
    if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Informe um e-mail válido.';
    }
    if (!password) {
      newErrors.password = 'Informe sua senha.';
    } else if (mode === 'register' && password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setFieldErrors({});
    setServerError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setServerError(translateServerError(err.message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
            <Wallet className="text-white" size={18} />
          </div>
          <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-slate-100">
            FinFlow
          </span>
        </div>

        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-5">
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className={`flex-1 text-sm font-medium py-1.5 transition-colors ${
              mode === 'login'
                ? 'bg-primary-600 text-white'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('register')}
            className={`flex-1 text-sm font-medium py-1.5 transition-colors ${
              mode === 'register'
                ? 'bg-primary-600 text-white'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                  fieldErrors.name ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{fieldErrors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              E-mail
            </label>
            <input
              type="text"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                fieldErrors.email ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                fieldErrors.password ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {fieldErrors.password && (
              <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-expense-600 dark:text-expense-400 bg-expense-50 dark:bg-expense-500/10 rounded-xl px-3 py-2.5">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl shadow-sm transition-colors active:scale-[0.98]"
          >
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
