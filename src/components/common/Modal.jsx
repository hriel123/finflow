import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Modal({ title, onClose, children, maxWidthClass = 'sm:max-w-md' }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement;
    if (!dialogRef.current.contains(document.activeElement)) dialogRef.current.focus();
    return () => {
      if (previous && document.contains(previous)) previous.focus();
    };
  }, []);

  function handleTab(e) {
    if (e.key !== 'Tab') return;
    const focusable = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 animate-fade-in"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleTab}
        className={`relative bg-white dark:bg-slate-900 w-full ${maxWidthClass} sm:rounded-2xl rounded-t-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-scale-in focus:outline-none`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
          <h2 id={titleId} className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
