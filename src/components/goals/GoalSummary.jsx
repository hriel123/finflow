import { Target, CheckCircle2, PiggyBank, Flag } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import { getGoalStatus } from '../../utils/goalCalculations.js';
import { useCurrency } from '../../hooks/useCurrency.js';

export default function GoalSummary({ goals }) {
  const { currency } = useCurrency();
  const activeCount = goals.filter((g) => getGoalStatus(g) !== 'completed').length;
  const completedCount = goals.filter((g) => getGoalStatus(g) === 'completed').length;
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  const tiles = [
    {
      label: 'Metas ativas',
      value: String(activeCount),
      icon: Target,
      badge: 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400',
    },
    {
      label: 'Metas concluídas',
      value: String(completedCount),
      icon: CheckCircle2,
      badge: 'bg-income-50 dark:bg-income-500/10 text-income-600 dark:text-income-400',
    },
    {
      label: 'Total guardado',
      value: formatCurrency(totalSaved, currency),
      icon: PiggyBank,
      badge: 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400',
    },
    {
      label: 'Total dos objetivos',
      value: formatCurrency(totalTarget, currency),
      icon: Flag,
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map(({ label, value, icon: Icon, badge }) => (
        <div
          key={label}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-5 flex items-start justify-between"
        >
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-semibold money text-slate-900 dark:text-slate-100">{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge}`}>
            <Icon size={20} />
          </div>
        </div>
      ))}
    </div>
  );
}
