import { useMemo, useState } from 'react';
import ReportsFilters from './ReportsFilters.jsx';
import ReportSummaryCards from './ReportSummaryCards.jsx';
import MonthlyTrendChart from './MonthlyTrendChart.jsx';
import ExpenseByCategoryChart from '../dashboard/ExpenseByCategoryChart.jsx';
import { useTransactions } from '../../hooks/useTransactions.js';
import { getPeriodRange, filterTransactions, groupByMonth, groupByCategory } from '../../utils/finance.js';

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

  const monthsCount = monthlyData.length || 1;
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
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Relatórios</h1>
        <p className="text-sm text-slate-400">Analise sua evolução financeira em detalhe.</p>
      </div>

      <ReportsFilters filters={filters} onChange={handleFiltersChange} />

      <ReportSummaryCards
        avgIncome={avgIncome}
        avgExpense={avgExpense}
        biggestExpense={biggestExpense}
        savingsRate={savingsRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyTrendChart data={monthlyData} theme={theme} />
        </div>
        <div className="lg:col-span-1">
          <ExpenseByCategoryChart data={categoryData} theme={theme} />
        </div>
      </div>
    </div>
  );
}
