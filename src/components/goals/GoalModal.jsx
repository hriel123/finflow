import { useState } from 'react';
import { GOAL_CATEGORIES } from '../../data/goalCategories.js';
import { GOAL_ICONS, GOAL_ICON_KEYS } from '../../data/goalIcons.js';
import Modal from '../common/Modal.jsx';
import Select from '../common/Select.jsx';
import CurrencyInput from '../common/CurrencyInput.jsx';

export default function GoalModal({ goal, onClose, onSubmit }) {
  const isEdit = Boolean(goal);

  const [name, setName] = useState(goal?.name ?? '');
  const [description, setDescription] = useState(goal?.description ?? '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount ?? 0);
  const [initialAmount, setInitialAmount] = useState(0);
  const [deadline, setDeadline] = useState(goal?.deadline ?? '');
  const [category, setCategory] = useState(goal?.category ?? GOAL_CATEGORIES[0]);
  const [icon, setIcon] = useState(goal?.icon ?? GOAL_ICON_KEYS[0]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Informe um nome para a meta.';
    }
    if (!targetAmount || targetAmount <= 0) {
      newErrors.targetAmount = 'Informe um valor objetivo maior que zero.';
    }
    if (!isEdit) {
      if (initialAmount < 0) {
        newErrors.initialAmount = 'O valor inicial não pode ser negativo.';
      } else if (initialAmount > targetAmount) {
        newErrors.initialAmount = 'O valor inicial não pode ser maior que o valor objetivo.';
      }
    }
    if (!deadline) {
      newErrors.deadline = 'Informe o prazo da meta.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError('');
    setSubmitting(true);
    const success = await onSubmit({
      name: name.trim(),
      description: description.trim(),
      targetAmount,
      ...(isEdit ? {} : { savedAmount: initialAmount }),
      deadline,
      category,
      icon,
    });
    setSubmitting(false);

    if (success) {
      onClose();
    } else {
      setSubmitError('Não foi possível salvar a meta. Tente novamente.');
    }
  }

  return (
    <Modal title={isEdit ? 'Editar meta' : 'Nova meta'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nome da meta
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Comprar Notebook"
            className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
              errors.name ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.name && <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Descrição <span className="text-slate-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Guardar dinheiro para um notebook novo"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Valor objetivo
            </label>
            <CurrencyInput value={targetAmount} onChange={setTargetAmount} error={Boolean(errors.targetAmount)} />
            {errors.targetAmount && (
              <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{errors.targetAmount}</p>
            )}
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Valor inicial
              </label>
              <CurrencyInput value={initialAmount} onChange={setInitialAmount} error={Boolean(errors.initialAmount)} />
              {errors.initialAmount && (
                <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{errors.initialAmount}</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Prazo
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
              errors.deadline ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.deadline && <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{errors.deadline}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Categoria
          </label>
          <Select value={category} onChange={setCategory} options={GOAL_CATEGORIES} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Ícone
          </label>
          <div className="grid grid-cols-4 gap-2">
            {GOAL_ICON_KEYS.map((key) => {
              const IconComp = GOAL_ICONS[key];
              const selected = icon === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  className={`flex items-center justify-center rounded-xl border py-2.5 transition-colors ${
                    selected
                      ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComp size={18} />
                </button>
              );
            })}
          </div>
        </div>

        {submitError && (
          <p className="text-sm text-expense-600 dark:text-expense-400 bg-expense-50 dark:bg-expense-500/10 rounded-xl px-3 py-2.5">
            {submitError}
          </p>
        )}

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
            disabled={submitting}
            className="flex-1 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 shadow-sm transition-colors active:scale-[0.98]"
          >
            {isEdit ? 'Salvar alterações' : 'Criar meta'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
