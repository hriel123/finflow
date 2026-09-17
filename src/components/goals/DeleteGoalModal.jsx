import Modal from '../common/Modal.jsx';

export default function DeleteGoalModal({ goal, onClose, onConfirm }) {
  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Modal title="Excluir meta?" onClose={onClose} maxWidthClass="sm:max-w-sm">
      <div className="px-5 py-4 space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tem certeza que deseja excluir{' '}
          <span className="font-medium text-slate-700 dark:text-slate-200">"{goal.name}"</span>?
          Esta ação não poderá ser desfeita.
        </p>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-[0.98]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-expense-600 hover:opacity-90 text-white text-sm font-medium py-2.5 shadow-sm transition-opacity active:scale-[0.98]"
          >
            Excluir
          </button>
        </div>
      </div>
    </Modal>
  );
}
