import { lazy, Suspense, useMemo, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import SummaryCard from './SummaryCard.jsx';
import TransactionList from './TransactionList.jsx';
import FiltersBar from './FiltersBar.jsx';
import PeriodSummary from './PeriodSummary.jsx';
import TransactionModal from './TransactionModal.jsx';
import DeleteTransactionModal from '../transactions/DeleteTransactionModal.jsx';
import { useTransactions } from '../../hooks/useTransactions.js';
import {
  getPeriodRange,
  filterTransactions,
  groupByMonth,
  groupByCategory,
  getTopCategory,
} from '../../utils/finance.js';

const IncomeExpenseChart = lazy(() => import('./IncomeExpenseChart.jsx'));
const ExpenseByCategoryChart = lazy(() => import('./ExpenseByCategoryChart.jsx'));

const chartFallback = (
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 h-80" />
);

const DEFAULT_FILTERS = {
  period: 'month',
  customRange: null,
  type: 'all',
  category: 'all',
};

export default function Dashboard({ theme }) {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  function handleFiltersChange(patch) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters]
  );

  // Charts always compare income vs. expense / the full category breakdown
  // for the selected period, independent of the type/category filter (which
  // only narrows the summary cards and the transaction list below).
  const periodTransactions = useMemo(
    () =>
      filterTransactions(transactions, {
        period: filters.period,
        customRange: filters.customRange,
        type: 'all',
        category: 'all',
      }),
    [transactions, filters.period, filters.customRange]
  );

  const income = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const expense = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const balance = income - expense;

  const monthlyData = useMemo(() => {
    const range = getPeriodRange(filters.period, filters.customRange);
    return groupByMonth(periodTransactions, range);
  }, [periodTransactions, filters.period, filters.customRange]);

  const categoryData = useMemo(
    () => groupByCategory(periodTransactions),
    [periodTransactions]
  );

  const topCategory = useMemo(() => getTopCategory(filteredTransactions), [filteredTransactions]);

  let listEmptyText;
  if (transactions.length > 0) {
    listEmptyText =
      periodTransactions.length === 0
        ? 'Nenhuma transação no período selecionado.'
        : 'Nenhuma transação encontrada com esses filtros.';
  }
  const chartEmptyText = transactions.some((t) => t.type === 'expense')
    ? 'Nenhuma despesa no período selecionado.'
    : undefined;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl shadow-sm transition-colors active:scale-[0.98]"
        >
          <Plus size={16} />
          Nova transação
        </button>
      </div>

      <FiltersBar filters={filters} onChange={handleFiltersChange} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Saldo atual" value={balance} icon={Wallet} variant="default" />
        <SummaryCard label="Receitas" value={income} icon={TrendingUp} variant="income" />
        <SummaryCard label="Despesas" value={expense} icon={TrendingDown} variant="expense" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Suspense fallback={chartFallback}>
            <IncomeExpenseChart data={monthlyData} theme={theme} />
          </Suspense>
          <Suspense fallback={chartFallback}>
            <ExpenseByCategoryChart data={categoryData} theme={theme} emptyText={chartEmptyText} />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <TransactionList transactions={filteredTransactions} onDelete={setDeletingTransaction} emptyText={listEmptyText} />
        </div>
      </div>

      <PeriodSummary
        summary={{ income, expense, balance, topCategory, count: filteredTransactions.length }}
      />

      {modalOpen && (
        <TransactionModal onClose={() => setModalOpen(false)} onSubmit={addTransaction} />
      )}

      {deletingTransaction && (
        <DeleteTransactionModal
          transaction={deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          onConfirm={() => deleteTransaction(deletingTransaction.id)}
        />
      )}
    </div>
  );
}
