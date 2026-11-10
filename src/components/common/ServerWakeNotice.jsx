import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { onServerWaking } from '../../lib/api.js';

const GIVE_UP_SECONDS = 90;

export default function ServerWakeNotice() {
  const [since, setSince] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => onServerWaking(setSince), []);

  useEffect(() => {
    if (!since) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [since]);

  if (!since) return null;

  const seconds = Math.max(0, Math.round((now - since) / 1000));
  const failed = seconds >= GIVE_UP_SECONDS;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md flex items-start gap-3 bg-white dark:bg-slate-900 border border-primary-500/40 rounded-2xl shadow-lg px-4 py-4 animate-fade-in">
      {failed ? (
        <AlertCircle size={22} className="text-expense-600 dark:text-expense-400 shrink-0 mt-0.5" />
      ) : (
        <Loader2 size={22} className="text-primary-600 dark:text-primary-500 animate-spin shrink-0 mt-0.5" />
      )}
      <div className="text-sm">
        <div role="status" aria-live="polite">
          {failed ? (
            <>
              <p className="font-semibold text-slate-900 dark:text-slate-100">O servidor não respondeu</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
                Já se passou mais de um minuto e meio. Verifique a internet e tente de novo.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Ligando o servidor…</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">
                Ele fica em repouso quando ninguém está usando e leva até 1 minuto para voltar. Aguarde,
                não precisa recarregar a página.
              </p>
            </>
          )}
        </div>
        {failed ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 min-h-11 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium shadow-sm transition-colors"
          >
            Tentar de novo
          </button>
        ) : (
          <p className="mt-2 text-xs text-slate-500 money">Aguardando há {seconds} s</p>
        )}
      </div>
    </div>
  );
}
