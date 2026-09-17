import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function Select({ value, onChange, options, placeholder = 'Selecione', error = false, className = '' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
  const selected = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      // Capture phase + stopPropagation so this closes only the dropdown,
      // not an ancestor Modal's own Escape-to-close listener.
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
          error ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        <span className={`truncate ${selected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] py-1 text-sm">
          {normalizedOptions.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-700 dark:hover:text-primary-400 ${
                  opt.value === value
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {opt.value === value && <Check size={14} className="shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
