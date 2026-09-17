import { useState } from 'react';
import { MoreVertical, CheckCircle2, Target as TargetIcon, Calendar } from 'lucide-react';
import { GOAL_ICONS } from '../../data/goalIcons.js';
import { GOAL_CATEGORY_COLORS } from '../../data/goalCategories.js';
import { formatCurrency, formatDateBR } from '../../utils/format.js';
import { useCurrency } from '../../hooks/useCurrency.js';
import {
  getProgressPercent,
  getRemainingAmount,
  getGoalStatus,
  formatDaysRemainingLabel,
} from '../../utils/goalCalculations.js';

export default function GoalCard({ goal, onAddMoney, onWithdrawMoney, onEdit, onDelete }) {
  const { currency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);

  const Icon = GOAL_ICONS[goal.icon] ?? TargetIcon;
  const colors = GOAL_CATEGORY_COLORS[goal.category] ?? GOAL_CATEGORY_COLORS.Outros;
  const percent = getProgressPercent(goal);
  const remaining = getRemainingAmount(goal);
  const status = getGoalStatus(goal);
  const daysLabel = formatDaysRemainingLabel(goal);

  function closeAnd(action) {
    setMenuOpen(false);
    action(goal);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}
          >
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {goal.name}
            </h3>
            {goal.description && (
              <p className="text-xs text-slate-400 truncate">{goal.description}</p>
            )}
          </div>
        </div>
        {status === 'completed' && (
          <span className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-income-600 dark:text-income-400 bg-income-50 dark:bg-income-500/10 px-2 py-1 rounded-full">
            <CheckCircle2 size={12} /> Concluída
          </span>
        )}
      </div>

      <div>
        <div className="flex items-baseline justify-between text-sm mb-1.5">
          <span className="font-semibold text-slate-900 dark:text-slate-100 money">
            {formatCurrency(goal.savedAmount, currency)}
          </span>
          <span className="text-slate-400 money">{formatCurrency(goal.targetAmount, currency)}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              status === 'completed' ? 'bg-income-500' : 'bg-primary-600'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <TargetIcon size={13} />
          {status === 'completed' ? 'Meta atingida' : `Faltam ${formatCurrency(remaining, currency)}`}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={13} />
          {status === 'active' ? `Prazo: ${formatDateBR(goal.deadline)} · ${daysLabel}` : daysLabel}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={() => onAddMoney(goal)}
          className="flex-1 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 shadow-sm transition-colors active:scale-[0.98]"
        >
          Adicionar dinheiro
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-20 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 animate-scale-in">
                <button
                  onClick={() => closeAnd(onEdit)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => closeAnd(onAddMoney)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Adicionar dinheiro
                </button>
                <button
                  onClick={() => closeAnd(onWithdrawMoney)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Retirar dinheiro
                </button>
                <button
                  onClick={() => closeAnd(onDelete)}
                  className="w-full text-left px-3 py-2 text-sm text-expense-600 dark:text-expense-400 hover:bg-expense-50 dark:hover:bg-expense-500/10"
                >
                  Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
