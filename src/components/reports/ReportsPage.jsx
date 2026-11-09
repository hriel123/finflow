import { lazy, Suspense, useMemo, useState } from 'react';
import ReportsFilters from './ReportsFilters.jsx';
import ReportSummaryCards from './ReportSummaryCards.jsx';
import { useTransactions } from '../../hooks/useTransactions.js';
import { getPeriodRange, filterTransactions, groupByMonth, groupByCategory } from '../../utils/finance.js';

const MonthlyTrendChart = lazy(() => import('./MonthlyTrendChart.jsx'));
const ExpenseByCategoryChart = lazy(() => import('../dashboard/ExpenseByCategoryChart.jsx'));

const cardFallback = 'bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800';

const DEFAULT_FILTERS = { period: 'year', customRange: null };

export default function ReportsPage({ theme }) {
  const { transactions } = useTransactions();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  function handleFiltersChange(patch) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, { ...filters, type: 'all', category: 'all' }),
    [transactions, filters]
  );

  const monthlyData = useMemo(() => {
    const range = getPeriodRange(filters.period, filters.customRange);
    return groupByMonth(filteredTransactions, range);
  }, [filteredTransactions, filters.period, filters.customRange]);

  const categoryData = useMemo(() => groupByCategory(filteredTransactions), [filteredTransactions]);

  const totalIncome = useMemo(
    () => filteredTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const totalExpense = useMemo(
    () => filteredTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const monthsCount = new Set(filteredTransactions.map((t) => t.date.slice(0, 7))).size || 1;
  const avgIncome = totalIncome / monthsCount;
  const avgExpense = totalExpense / monthsCount;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const biggestExpense = useMemo(() => {
    const expenses = filteredTransactions.filter((t) => t.type === 'expense');
    if (expenses.length === 0) return null;
    return expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0]);
  }, [filteredTransactions]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <ReportsFilters filters={filters} onChange={handleFiltersChange} />

      <ReportSummaryCards
        avgIncome={avgIncome}
        avgExpense={avgExpense}
        biggestExpense={biggestExpense}
        savingsRate={savingsRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className={`${cardFallback} h-96`} />}>
            <MonthlyTrendChart data={monthlyData} theme={theme} />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <Suspense fallback={<div className={`${cardFallback} h-80`} />}>
            <ExpenseByCategoryChart
              data={categoryData}
              theme={theme}
              emptyText={transactions.some((t) => t.type === 'expense') ? 'Nenhuma despesa no período selecionado.' : undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
