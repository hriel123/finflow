export default function ChartLegend({ payload }) {
  return (
    <ul className="flex items-center justify-center gap-6 pt-2">
      {payload.map((entry) => (
        <li key={entry.value} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color, boxShadow: `0 0 6px 1px ${entry.color}` }}
          />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}
