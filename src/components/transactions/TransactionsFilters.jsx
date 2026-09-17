import { Search } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories.js';
import Select from '../common/Select.jsx';

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Receita' },
  { value: 'expense', label: 'Despesa' },
];

const ALL_CATEGORIES = Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Todas as categorias' },
  ...ALL_CATEGORIES.map((c) => ({ value: c, label: c })),
];

export default function TransactionsFilters({ filters, onChange }) {
  const { type, category, search } = filters;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Buscar por descrição..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        />
      </div>

      <Select value={type} onChange={(v) => onChange({ type: v })} options={TYPE_OPTIONS} className="sm:w-36" />

      <Select
        value={category}
        onChange={(v) => onChange({ category: v })}
        options={CATEGORY_OPTIONS}
        className="sm:w-48"
      />
    </div>
  );
}
