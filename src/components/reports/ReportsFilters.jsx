import Select from '../common/Select.jsx';

const PERIOD_OPTIONS = [
  { value: 'month', label: 'Mês atual' },
  { value: 'year', label: 'Este ano' },
  { value: 'custom', label: 'Personalizado' },
];

const inputClass =
  'rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30';

export default function ReportsFilters({ filters, onChange }) {
  const { period, customRange } = filters;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
      <Select value={period} onChange={(v) => onChange({ period: v })} options={PERIOD_OPTIONS} className="sm:w-44" />

      {period === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customRange?.start ?? ''}
            onChange={(e) => onChange({ customRange: { ...customRange, start: e.target.value } })}
            className={inputClass}
          />
          <span className="text-sm text-slate-400 dark:text-slate-500">até</span>
          <input
            type="date"
            value={customRange?.end ?? ''}
            onChange={(e) => onChange({ customRange: { ...customRange, end: e.target.value } })}
            className={inputClass}
          />
        </div>
      )}
    </div>
  );
}
