import { useMemo, useState } from 'react';
import { Plus, Receipt } from 'lucide-react';
import TransactionsFilters from './TransactionsFilters.jsx';
import TransactionsTable from './TransactionsTable.jsx';
import DeleteTransactionModal from './DeleteTransactionModal.jsx';
import TransactionModal from '../dashboard/TransactionModal.jsx';
import { useTransactions } from '../../hooks/useTransactions.js';

const DEFAULT_FILTERS = { type: 'all', category: 'all', search: '' };

export default function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  function handleFiltersChange(patch) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  const filteredTransactions = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return transactions
      .filter((t) => filters.type === 'all' || t.type === filters.type)
      .filter((t) => filters.category === 'all' || t.category === filters.category)
      .filter((t) => !search || t.description.toLowerCase().includes(search))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filters]);

  function handleCreateSubmit(data) {
    addTransaction(data);
  }

  function handleEditSubmit(data) {
    updateTransaction(editingTransaction.id, data);
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Transações</h1>
          <p className="text-sm text-slate-400">
            Veja, edite e organize todos os seus lançamentos financeiros.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3.5 py-2.5 rounded-xl shadow-sm transition-colors active:scale-[0.98] shrink-0"
        >
          <Plus size={16} />
          Nova transação
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-3 py-16 px-5 text-center">
          <Receipt size={28} className="text-slate-300 dark:text-slate-600" />
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Você ainda não possui transações.
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Registre sua primeira receita ou despesa para começar a acompanhar seu histórico.
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors active:scale-[0.98] mt-1"
          >
            <Plus size={16} />
            Criar primeira transação
          </button>
        </div>
      ) : (
        <>
          <TransactionsFilters filters={filters} onChange={handleFiltersChange} />
          <TransactionsTable
            transactions={filteredTransactions}
            onEdit={setEditingTransaction}
            onDelete={setDeletingTransaction}
          />
        </>
      )}

      {createOpen && (
        <TransactionModal onClose={() => setCreateOpen(false)} onSubmit={handleCreateSubmit} />
      )}

      {editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleEditSubmit}
        />
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
