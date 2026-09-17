import { TrendingUp, TrendingDown, ArrowDownCircle, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import { useCurrency } from '../../hooks/useCurrency.js';

export default function ReportSummaryCards({ avgIncome, avgExpense, biggestExpense, savingsRate }) {
  const { currency } = useCurrency();

  const tiles = [
    {
      label: 'Média mensal de receitas',
      value: formatCurrency(avgIncome, currency),
      icon: TrendingUp,
      badge: 'bg-income-50 dark:bg-income-500/10 text-income-600 dark:text-income-400',
    },
    {
      label: 'Média mensal de despesas',
      value: formatCurrency(avgExpense, currency),
      icon: TrendingDown,
      badge: 'bg-expense-50 dark:bg-expense-500/10 text-expense-600 dark:text-expense-400',
    },
    {
      label: 'Maior despesa do período',
      value: biggestExpense ? formatCurrency(biggestExpense.amount, currency) : '—',
      sublabel: biggestExpense?.description,
      icon: ArrowDownCircle,
      badge: 'bg-expense-50 dark:bg-expense-500/10 text-expense-600 dark:text-expense-400',
    },
    {
      label: 'Taxa de economia',
      value: `${savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      badge: 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map(({ label, value, sublabel, icon: Icon, badge }) => (
        <div
          key={label}
          className="card-hover-glow bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-5 flex items-start justify-between"
        >
          <div className="min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-semibold money text-slate-900 dark:text-slate-100">{value}</p>
            {sublabel && <p className="text-xs text-slate-400 truncate mt-0.5">{sublabel}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${badge}`}>
            <Icon size={20} />
          </div>
        </div>
      ))}
    </div>
  );
}
