import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Selecione',
  error = false,
  className = '',
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
  const selected = normalizedOptions.find((opt) => opt.value === value);
  const selectedIndex = normalizedOptions.findIndex((opt) => opt.value === value);

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

  useEffect(() => {
    if (open && activeIndex >= 0) {
      listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeIndex]);

  function openList() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function choose(index) {
    onChange(normalizedOptions[index].value);
    setOpen(false);
  }

  function handleKeyDown(e) {
    const last = normalizedOptions.length - 1;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(last, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(last);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeIndex >= 0) choose(activeIndex);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        aria-invalid={error || undefined}
        aria-describedby={ariaDescribedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
          error ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        <span className={`truncate ${selected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute z-50 mt-1.5 w-full max-h-60 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] py-1 text-sm"
        >
          {normalizedOptions.map((opt, index) => (
            <li
              key={opt.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => choose(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left cursor-pointer ${
                index === activeIndex ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400' : ''
              } ${
                opt.value === value
                  ? 'text-primary-600 dark:text-primary-400 font-medium'
                  : index === activeIndex ? '' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              <span className="truncate">{opt.label}</span>
              {opt.value === value && <Check size={14} className="shrink-0" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
