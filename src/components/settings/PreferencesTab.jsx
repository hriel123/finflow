import { Sun, Moon } from 'lucide-react';
import { useCurrency, CURRENCIES } from '../../hooks/useCurrency.js';
import Select from '../common/Select.jsx';

const CURRENCY_LABELS = {
  BRL: 'Real brasileiro (R$)',
  USD: 'Dólar americano ($)',
  EUR: 'Euro (€)',
};

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c, label: CURRENCY_LABELS[c] }));

export default function PreferencesTab({ theme, onToggleTheme }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-5 max-w-md space-y-5">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preferências</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tema</label>
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'dark' ? 'Modo escuro' : 'Modo claro'}
          </span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Moeda padrão</label>
        <Select value={currency} onChange={setCurrency} options={CURRENCY_OPTIONS} />
      </div>
    </div>
  );
}
