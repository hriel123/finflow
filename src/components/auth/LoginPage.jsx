import { useState } from 'react';
import { Wallet, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVER_ERROR_MESSAGES = {
  'invalid credentials': 'E-mail ou senha incorretos.',
  'invalid email format': 'Informe um e-mail válido.',
  'password must be at least 6 characters long': 'A senha deve ter pelo menos 6 caracteres.',
  'name, email and password are required': 'Preencha nome, e-mail e senha.',
  'email and password are required': 'Preencha e-mail e senha.',
  'email already registered': 'Este e-mail já está cadastrado.',
  'too many attempts, please try again later': 'Muitas tentativas. Espere alguns minutos e tente de novo.',
  'email not configured': 'A recuperação de senha por e-mail ainda não foi ativada.',
  'invalid or expired reset link': 'Este link expirou ou já foi usado. Peça um novo em "Esqueci minha senha".',
  'token and password are required': 'Informe a nova senha.',
  'Failed to fetch': 'Sem conexão com o servidor. Verifique a internet e tente de novo.',
};

function readResetToken() {
  return new URLSearchParams(window.location.search).get('redefinir') || '';
}

function translateServerError(message) {
  return SERVER_ERROR_MESSAGES[message] ?? message;
}

export default function LoginPage() {
  const { login, register, startDemo, requestPasswordReset, resetPassword } = useAuth();
  const [resetToken] = useState(readResetToken);
  const [mode, setMode] = useState(() => {
    if (resetToken) return 'reset';
    return new URLSearchParams(window.location.search).has('criar') ? 'register' : 'login';
  });
  const [confirm, setConfirm] = useState('');
  const [sent, setSent] = useState(false);
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
    if (mode !== 'reset' && !EMAIL_REGEX.test(email)) {
      newErrors.email = 'Informe um e-mail válido.';
    }
    if (mode !== 'forgot') {
      if (!password) {
        newErrors.password = 'Informe sua senha.';
      } else if (mode !== 'login' && password.length < 6) {
        newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
      }
    }
    if (mode === 'reset' && password && confirm !== password) {
      newErrors.confirm = 'As duas senhas não são iguais.';
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setFieldErrors({});
    setServerError('');
    setSent(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        window.history.replaceState(null, '', window.location.pathname);
      } else if (mode === 'register') {
        await register(name, email, password);
        window.history.replaceState(null, '', window.location.pathname);
      } else if (mode === 'forgot') {
        await requestPasswordReset(email);
        setSent(true);
      } else {
        await resetPassword(resetToken, password);
        window.history.replaceState(null, '', '/');
      }
    } catch (err) {
      setServerError(translateServerError(err.message));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemo() {
    setServerError('');
    try {
      await startDemo();
    } catch (err) {
      setServerError(translateServerError(err.message));
    }
  }

  const tabs = mode === 'login' || mode === 'register';
  const submitLabel = { login: 'Entrar', register: 'Criar conta', forgot: 'Enviar link', reset: 'Salvar nova senha' }[mode];

  function field(key, label, input) {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        {input}
        {fieldErrors[key] && (
          <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{fieldErrors[key]}</p>
        )}
      </div>
    );
  }

  const inputClass = (key) =>
    `w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
      fieldErrors[key] ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
              <Wallet className="text-white" size={18} />
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-slate-100">
              FinFlow
            </span>
          </div>

          {tabs ? (
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-5">
              {[['login', 'Entrar'], ['register', 'Criar conta']].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleModeChange(key)}
                  className={`flex-1 text-sm font-medium py-1.5 transition-colors ${
                    mode === key ? 'bg-primary-600 text-white' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-5">
              <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {mode === 'forgot' ? 'Recuperar acesso' : 'Criar nova senha'}
              </h1>
              {mode === 'forgot' && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Digite o e-mail da conta. Enviamos um link para você criar uma nova senha.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'register' &&
              field('name', 'Nome', (
                <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass('name')} />
              ))}

            {mode !== 'reset' &&
              field('email', 'E-mail', (
                <input type="text" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass('email')} />
              ))}

            {mode !== 'forgot' &&
              field('password', mode === 'reset' ? 'Nova senha' : 'Senha', (
                <input
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass('password')}
                />
              ))}

            {mode === 'reset' &&
              field('confirm', 'Repita a nova senha', (
                <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass('confirm')} />
              ))}

            {mode === 'login' && (
              <div className="-mt-2 text-right">
                <button
                  type="button"
                  onClick={() => handleModeChange('forgot')}
                  className="text-xs font-medium text-primary-600 dark:text-primary-500 hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {serverError && (
              <p className="text-sm text-expense-600 dark:text-expense-400 bg-expense-50 dark:bg-expense-500/10 rounded-xl px-3 py-2.5">
                {serverError}
              </p>
            )}

            {sent && (
              <p className="text-sm text-income-600 bg-income-50 dark:bg-income-500/10 rounded-xl px-3 py-2.5">
                Se houver uma conta com esse e-mail, enviamos um link para criar uma nova senha. Ele vale 30 minutos. Olhe também a caixa de spam.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-xl shadow-sm transition-colors active:scale-[0.98]"
            >
              {submitLabel}
            </button>

            {mode === 'register' && (
              <p className="text-xs text-center text-slate-400">
                Ao criar a conta, você concorda com a{' '}
                <a href="/privacidade.html" target="_blank" rel="noopener" className="text-primary-600 dark:text-primary-500 underline">
                  política de privacidade
                </a>
                .
              </p>
            )}

            {!tabs && (
              <p className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (mode === 'reset') window.history.replaceState(null, '', '/');
                    handleModeChange('login');
                  }}
                  className="text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline"
                >
                  Voltar para entrar
                </button>
              </p>
            )}
          </form>
        </div>

        {tabs && (
          <button
            type="button"
            onClick={handleDemo}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
          >
            <Sparkles size={16} />
            Experimentar sem conta
          </button>
        )}
        {tabs && (
          <p className="mt-2 text-xs text-center text-slate-400">
            Com dados de exemplo, salvos só neste navegador.
          </p>
        )}
      </div>
    </div>
  );
}
