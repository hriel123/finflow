import { ArrowUpRight, ArrowDownRight, Trash2, Inbox } from 'lucide-react';
import { formatCurrency, formatDateBR } from '../../utils/format.js';
import { useCurrency } from '../../hooks/useCurrency.js';

export default function TransactionList({ transactions, onDelete }) {
  const { currency } = useCurrency();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Transações</h2>
        <span className="text-xs text-slate-400">{transactions.length} lançamento(s)</span>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 px-5 text-center">
          <Inbox size={24} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400">Nenhuma transação ainda.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[420px] overflow-y-auto">
          {transactions.map((t) => {
            const isIncome = t.type === 'income';
            return (
              <li
                key={t.id}
                className="flex items-center justify-between gap-2 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
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
                  <button
                    onClick={() => onDelete(t.id)}
                    title="Excluir transação"
                    className="text-slate-300 dark:text-slate-600 hover:text-expense-600 dark:hover:text-expense-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
