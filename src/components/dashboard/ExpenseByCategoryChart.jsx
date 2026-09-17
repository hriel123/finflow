import { useState } from 'react';
import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/format.js';
import { useCurrency } from '../../hooks/useCurrency.js';

const CATEGORY_COLORS = [
  '#6366f1', // indigo (primary)
  '#f97316', // orange
  '#0ea5e9', // sky
  '#a855f7', // purple
  '#14b8a6', // teal
  '#eab308', // amber
  '#ec4899', // pink
  '#64748b', // slate
];

function renderActiveShape(props) {
  return <Sector {...props} outerRadius={props.outerRadius + 6} />;
}

export default function ExpenseByCategoryChart({ data, theme }) {
  const { currency } = useCurrency();
  const isDark = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState(undefined);
  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="card-hover-glow bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-5 h-80 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Despesas por categoria</h2>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <PieChartIcon size={24} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400">Você ainda não possui despesas cadastradas.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 min-h-0">
          <div className="w-full sm:w-1/2 h-32 sm:h-full shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="category"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={2}
                  stroke={isDark ? '#1e293b' : 'rgba(0, 0, 0, 0.1)'}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value, currency)}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    color: '#f1f5f9',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="w-full flex-1 space-y-2 overflow-y-auto max-h-full text-sm">
            {data.map((entry, index) => (
              <li key={entry.category} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 min-w-0 text-slate-600 dark:text-slate-300 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                  />
                  <span className="truncate">{entry.category}</span>
                </span>
                <span className="text-slate-400 shrink-0">
                  {total ? Math.round((entry.total / total) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
