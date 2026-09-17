import { formatCurrency } from '../../utils/format.js';
import { useCurrency } from '../../hooks/useCurrency.js';

export default function SummaryCard({ label, value, icon: Icon, variant = 'default' }) {
  const { currency } = useCurrency();
  const styles = {
    default: {
      badge: 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400',
      text: 'text-slate-900 dark:text-slate-100',
    },
    income: {
      badge: 'bg-income-50 dark:bg-income-500/10 text-income-600 dark:text-income-400',
      text: 'text-income-600 dark:text-income-400',
    },
    expense: {
      badge: 'bg-expense-50 dark:bg-expense-500/10 text-expense-600 dark:text-expense-400',
      text: 'text-expense-600 dark:text-expense-400',
    },
  }[variant];

  const formatted = formatCurrency(value, currency);

  return (
    <div className="card-hover-glow bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className={`text-2xl font-semibold money ${styles.text}`}>{formatted}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.badge}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}
