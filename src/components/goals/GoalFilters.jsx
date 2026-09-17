import { GOAL_CATEGORIES } from '../../data/goalCategories.js';
import Select from '../common/Select.jsx';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Ativas' },
  { value: 'completed', label: 'Concluídas' },
  { value: 'overdue', label: 'Atrasadas' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'deadline', label: 'Prazo mais próximo' },
  { value: 'progressDesc', label: 'Maior progresso' },
  { value: 'progressAsc', label: 'Menor progresso' },
  { value: 'targetDesc', label: 'Maior valor objetivo' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Todas as categorias' },
  ...GOAL_CATEGORIES.map((c) => ({ value: c, label: c })),
];

export default function GoalFilters({ filters, onChange }) {
  const { status, category, sortBy } = filters;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
      <Select value={status} onChange={(v) => onChange({ status: v })} options={STATUS_OPTIONS} className="sm:w-40" />

      <Select
        value={category}
        onChange={(v) => onChange({ category: v })}
        options={CATEGORY_OPTIONS}
        className="sm:w-48"
      />

      <Select value={sortBy} onChange={(v) => onChange({ sortBy: v })} options={SORT_OPTIONS} className="sm:w-52" />
    </div>
  );
}
