import { formatCurrency } from '../../utils/format.js';
import { useCurrency } from '../../hooks/useCurrency.js';

export default function PeriodSummary({ summary }) {
  const { currency } = useCurrency();
  const { income, expense, balance, topCategory, count } = summary;

  const rows = [
    { label: 'Receitas', value: formatCurrency(income, currency), valueClass: 'text-income-600 dark:text-income-400' },
    { label: 'Despesas', value: formatCurrency(expense, currency), valueClass: 'text-expense-600 dark:text-expense-400' },
    { label: 'Saldo', value: formatCurrency(balance, currency), valueClass: 'text-slate-900 dark:text-slate-100' },
    {
      label: 'Maior gasto',
      value: topCategory ? topCategory.category : '—',
      valueClass: 'text-slate-900 dark:text-slate-100',
    },
    { label: 'Transações', value: String(count), valueClass: 'text-slate-900 dark:text-slate-100' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-5">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Resumo do período</h2>
      <dl className="divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2.5 text-sm">
            <dt className="text-slate-500 dark:text-slate-400">{row.label}</dt>
            <dd className={`font-semibold money ${row.valueClass}`}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
