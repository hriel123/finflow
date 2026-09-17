import { useState } from 'react';
import { formatCurrency } from '../../utils/format.js';
import { useCurrency } from '../../hooks/useCurrency.js';
import Modal from '../common/Modal.jsx';
import CurrencyInput from '../common/CurrencyInput.jsx';

const MODE_LABELS = {
  add: { title: 'Adicionar dinheiro', submit: 'Adicionar' },
  withdraw: { title: 'Retirar dinheiro', submit: 'Retirar' },
};

export default function MoneyModal({ goal, mode, onClose, onConfirm }) {
  const { currency } = useCurrency();
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const { title, submit } = MODE_LABELS[mode];

  function validate() {
    if (!amount || amount <= 0) {
      setError('Informe um valor maior que zero.');
      return false;
    }
    if (mode === 'withdraw' && amount > goal.savedAmount) {
      setError('O valor não pode ser maior que o total economizado.');
      return false;
    }
    setError('');
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onConfirm(amount);
    onClose();
  }

  return (
    <Modal title={title} onClose={onClose} maxWidthClass="sm:max-w-sm">
      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{goal.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Valor
          </label>
          <CurrencyInput value={amount} onChange={setAmount} error={Boolean(error)} autoFocus />
          {error && <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{error}</p>}
          {mode === 'withdraw' && (
            <p className="text-xs text-slate-400 mt-1">
              Disponível: {formatCurrency(goal.savedAmount, currency)}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2 pb-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-[0.98]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2.5 shadow-sm transition-colors active:scale-[0.98]"
          >
            {submit}
          </button>
        </div>
      </form>
    </Modal>
  );
}
