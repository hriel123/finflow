import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories.js';
import { useCategories } from '../../hooks/useCategories.js';
import Select from '../common/Select.jsx';

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mês' },
  { value: 'last3months', label: 'Últimos 3 meses' },
  { value: 'year', label: 'Este ano' },
  { value: 'custom', label: 'Personalizado' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Receitas' },
  { value: 'expense', label: 'Despesas' },
];

const dateInputClass =
  'rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30';

export default function FiltersBar({ filters, onChange }) {
  const { period, customRange, type, category } = filters;
  const { categories: customCategories } = useCategories();
  const categoryNames = Array.from(
    new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES, ...customCategories.map((c) => c.name)])
  );
  const categoryOptions = [
    { value: 'all', label: 'Todas as categorias' },
    ...categoryNames.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
      <Select
        value={period}
        onChange={(v) => onChange({ period: v })}
        options={PERIOD_OPTIONS}
        className="sm:w-44"
      />

      {period === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customRange?.start ?? ''}
            onChange={(e) => onChange({ customRange: { ...customRange, start: e.target.value } })}
            className={dateInputClass}
          />
          <span className="text-sm text-slate-400 dark:text-slate-500">até</span>
          <input
            type="date"
            value={customRange?.end ?? ''}
            onChange={(e) => onChange({ customRange: { ...customRange, end: e.target.value } })}
            className={dateInputClass}
          />
        </div>
      )}

      <Select value={type} onChange={(v) => onChange({ type: v })} options={TYPE_OPTIONS} className="sm:w-36" />

      <Select
        value={category}
        onChange={(v) => onChange({ category: v })}
        options={categoryOptions}
        className="sm:w-48"
      />
    </div>
  );
}
