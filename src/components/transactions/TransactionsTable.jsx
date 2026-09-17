import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDateBR } from '../../utils/format.js';
import { useCurrency } from '../../hooks/useCurrency.js';

const PAGE_SIZE = 10;

export default function TransactionsTable({ transactions, onEdit, onDelete }) {
  const { currency } = useCurrency();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [transactions.length, totalPages, page]);

  const pageItems = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 flex flex-col">
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 px-5 text-center">
          <Inbox size={24} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400">Nenhuma transação encontrada.</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {pageItems.map((t) => {
              const isIncome = t.type === 'income';
              return (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${
                        isIncome
                          ? 'bg-income-50 dark:bg-income-500/10 text-income-600 dark:text-income-400'
                          : 'bg-expense-50 dark:bg-expense-500/10 text-expense-600 dark:text-expense-400'
                      }`}
                    >
                      {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {t.description}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {t.category} · {formatDateBR(t.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-sm font-semibold money whitespace-nowrap ${
                        isIncome ? 'text-income-600 dark:text-income-400' : 'text-expense-600 dark:text-expense-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(t.amount, currency)}
                    </span>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(t)}
                        title="Editar transação"
                        className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded-lg"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(t)}
                        title="Excluir transação"
                        className="p-1.5 text-slate-400 hover:text-expense-600 dark:hover:text-expense-400 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400">
                Página {page} de {totalPages} · {transactions.length} lançamento(s)
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
