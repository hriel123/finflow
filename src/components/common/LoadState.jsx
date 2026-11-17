import { AlertCircle, Loader2 } from 'lucide-react';

export default function LoadState({ status, what, onRetry }) {
  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-6 max-w-md mx-auto flex items-start gap-3">
        {status === 'error' ? (
          <AlertCircle size={22} className="text-expense-600 dark:text-expense-400 shrink-0 mt-0.5" />
        ) : (
          <Loader2 size={22} className="text-primary-600 dark:text-primary-500 animate-spin shrink-0 mt-0.5" />
        )}
        <div className="text-sm" role={status === 'error' ? 'alert' : 'status'}>
          {status === 'error' ? (
            <>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Não foi possível carregar {what}</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
                O servidor não respondeu ou deu erro. Os valores não aparecem para não mostrar um saldo errado.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 min-h-11 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium shadow-sm transition-colors active:scale-[0.98]"
              >
                Tentar de novo
              </button>
            </>
          ) : (
            <p className="text-slate-600 dark:text-slate-300">Carregando {what}…</p>
          )}
        </div>
      </div>
    </div>
  );
}
