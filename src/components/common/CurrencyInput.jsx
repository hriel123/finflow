import { Plus, Minus } from 'lucide-react';

function formatBRL(value) {
  return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

export default function CurrencyInput({ value, onChange, step = 10, error = false, autoFocus = false }) {
  function handleTextChange(e) {
    const digits = e.target.value.replace(/\D/g, '');
    const cents = digits === '' ? 0 : parseInt(digits, 10);
    onChange(cents / 100);
  }

  function increment() {
    onChange(round2(value + step));
  }

  function decrement() {
    onChange(Math.max(0, round2(value - step)));
  }

  return (
    <div
      className={`flex items-stretch rounded-xl border bg-white dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/30 ${
        error ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <input
        type="text"
        inputMode="numeric"
        autoFocus={autoFocus}
        value={formatBRL(value)}
        onChange={handleTextChange}
        className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
      />
      <div className="flex flex-col shrink-0 border-l border-slate-300 dark:border-slate-700">
        <button
          type="button"
          onClick={increment}
          title={`Adicionar R$ ${step},00`}
          className="flex-1 px-2.5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-[#1e293b] dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-50 transition-colors duration-200 ease-in-out border-b border-slate-300 dark:border-slate-700"
        >
          <Plus size={12} />
        </button>
        <button
          type="button"
          onClick={decrement}
          title={`Remover R$ ${step},00`}
          className="flex-1 px-2.5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-[#1e293b] dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-50 transition-colors duration-200 ease-in-out"
        >
          <Minus size={12} />
        </button>
      </div>
    </div>
  );
}
