import { useMemo, useState } from 'react';
import { Target, Plus } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals.js';
import { getGoalStatus, getProgressPercent } from '../../utils/goalCalculations.js';
import GoalSummary from './GoalSummary.jsx';
import GoalFilters from './GoalFilters.jsx';
import GoalCard from './GoalCard.jsx';
import GoalModal from './GoalModal.jsx';
import MoneyModal from './MoneyModal.jsx';
import DeleteGoalModal from './DeleteGoalModal.jsx';

const DEFAULT_FILTERS = { status: 'all', category: 'all', sortBy: 'recent' };

function sortGoals(goals, sortBy) {
  const sorted = [...goals];
  switch (sortBy) {
    case 'deadline':
      return sorted.sort((a, b) => a.deadline.localeCompare(b.deadline));
    case 'progressDesc':
      return sorted.sort((a, b) => getProgressPercent(b) - getProgressPercent(a));
    case 'progressAsc':
      return sorted.sort((a, b) => getProgressPercent(a) - getProgressPercent(b));
    case 'targetDesc':
      return sorted.sort((a, b) => b.targetAmount - a.targetAmount);
    default: // 'recent'
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, addMoney, withdrawMoney } = useGoals();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [moneyModal, setMoneyModal] = useState(null); // { goal, mode }
  const [deletingGoal, setDeletingGoal] = useState(null);

  function handleFiltersChange(patch) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  const filteredGoals = useMemo(() => {
    const filtered = goals.filter((g) => {
      const status = getGoalStatus(g);
      const matchesStatus = filters.status === 'all' || status === filters.status;
      const matchesCategory = filters.category === 'all' || g.category === filters.category;
      return matchesStatus && matchesCategory;
    });
    return sortGoals(filtered, filters.sortBy);
  }, [goals, filters]);

  function handleCreateSubmit(data) {
    return addGoal(data);
  }

  function handleEditSubmit(data) {
    return updateGoal(editingGoal.id, data);
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Metas financeiras</h1>
          <p className="text-sm text-slate-400">
            Acompanhe seus objetivos e transforme seus planos em realidade.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3.5 py-2.5 rounded-xl shadow-sm transition-colors active:scale-[0.98] shrink-0"
        >
          <Plus size={16} />
          Nova meta
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-3 py-16 px-5 text-center">
          <Target size={28} className="text-slate-300 dark:text-slate-600" />
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Você ainda não possui metas.
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Crie sua primeira meta financeira e comece a acompanhar seu progresso.
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors active:scale-[0.98] mt-1"
          >
            <Plus size={16} />
            Criar primeira meta
          </button>
        </div>
      ) : (
        <>
          <GoalSummary goals={goals} />
          <GoalFilters filters={filters} onChange={handleFiltersChange} />

          {filteredGoals.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 py-12 px-5 text-center">
              <p className="text-sm text-slate-400">Nenhuma meta encontrada.</p>
              <p className="text-sm text-slate-400">Tente alterar os filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddMoney={(g) => setMoneyModal({ goal: g, mode: 'add' })}
                  onWithdrawMoney={(g) => setMoneyModal({ goal: g, mode: 'withdraw' })}
                  onEdit={setEditingGoal}
                  onDelete={setDeletingGoal}
                />
              ))}
            </div>
          )}
        </>
      )}

      {createOpen && (
        <GoalModal onClose={() => setCreateOpen(false)} onSubmit={handleCreateSubmit} />
      )}

      {editingGoal && (
        <GoalModal goal={editingGoal} onClose={() => setEditingGoal(null)} onSubmit={handleEditSubmit} />
      )}

      {moneyModal && (
        <MoneyModal
          goal={moneyModal.goal}
          mode={moneyModal.mode}
          onClose={() => setMoneyModal(null)}
          onConfirm={(amount) =>
            moneyModal.mode === 'add'
              ? addMoney(moneyModal.goal.id, amount)
              : withdrawMoney(moneyModal.goal.id, amount)
          }
        />
      )}

      {deletingGoal && (
        <DeleteGoalModal
          goal={deletingGoal}
          onClose={() => setDeletingGoal(null)}
          onConfirm={() => deleteGoal(deletingGoal.id)}
        />
      )}
    </div>
  );
}
