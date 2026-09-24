import { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories.js';
import Select from '../common/Select.jsx';

const TYPE_OPTIONS = [
  { value: 'expense', label: 'Despesa' },
  { value: 'income', label: 'Receita' },
];

export default function CategoriesTab() {
  const { categories, addCategory, deleteCategory, error } = useCategories();
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const ok = await addCategory(name.trim(), type);
    if (ok) setName('');
  }

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-5 max-w-lg space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Categorias personalizadas</h2>
        <p className="text-xs text-slate-400">
          Crie categorias próprias para usar nas suas transações, além das categorias padrão.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da categoria"
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        />
        <Select value={type} onChange={setType} options={TYPE_OPTIONS} className="w-full sm:w-32 shrink-0" />
        <button
          type="submit"
          className="shrink-0 flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3.5 py-2.5 rounded-xl shadow-sm transition-colors active:scale-[0.98]"
        >
          <Plus size={16} />
          <span className="sm:hidden">Adicionar categoria</span>
        </button>
      </form>
      {error && <p className="text-sm text-expense-600 dark:text-expense-400">{error}</p>}

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <Tag size={22} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400">Nenhuma categoria personalizada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expenseCategories.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Despesas</p>
              <ul className="space-y-1.5">
                {expenseCategories.map((c) => (
                  <CategoryRow key={c.id} category={c} onDelete={deleteCategory} />
                ))}
              </ul>
            </div>
          )}
          {incomeCategories.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Receitas</p>
              <ul className="space-y-1.5">
                {incomeCategories.map((c) => (
                  <CategoryRow key={c.id} category={c} onDelete={deleteCategory} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryRow({ category, onDelete }) {
  return (
    <li className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
      <span className="text-sm text-slate-700 dark:text-slate-200 truncate">{category.name}</span>
      <button
        onClick={() => onDelete(category.id)}
        title="Excluir categoria"
        className="text-slate-400 hover:text-expense-600 dark:hover:text-expense-400 transition-colors shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}
