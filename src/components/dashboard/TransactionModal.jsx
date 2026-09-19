import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories.js';
import { useCategories } from '../../hooks/useCategories.js';
import Modal from '../common/Modal.jsx';
import Select from '../common/Select.jsx';
import CurrencyInput from '../common/CurrencyInput.jsx';

function todayISO() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now - tzOffset).toISOString().slice(0, 10);
}

export default function TransactionModal({ transaction, onClose, onSubmit }) {
  const isEdit = Boolean(transaction);

  const [type, setType] = useState(transaction?.type ?? 'expense');
  const [description, setDescription] = useState(transaction?.description ?? '');
  const [amount, setAmount] = useState(transaction?.amount ?? 0);
  const [category, setCategory] = useState(transaction?.category ?? '');
  const [date, setDate] = useState(transaction?.date ?? todayISO());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { categories: customCategories } = useCategories();
  const staticCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const customNames = customCategories.filter((c) => c.type === type).map((c) => c.name);
  const categories = Array.from(new Set([...staticCategories, ...customNames]));

  function handleTypeChange(newType) {
    setType(newType);
    setCategory('');
  }

  function validate() {
    const newErrors = {};
    if (!description.trim()) {
      newErrors.description = 'Informe uma descrição.';
    }
    if (!amount || amount <= 0) {
      newErrors.amount = 'Informe um valor maior que zero.';
    }
    if (!category) {
      newErrors.category = 'Selecione uma categoria.';
    }
    if (!date) {
      newErrors.date = 'Informe a data.';
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
      type,
      description: description.trim(),
      amount,
      category,
      date,
    });
    setSubmitting(false);

    if (success) {
      onClose();
    } else {
      setSubmitError('Não foi possível salvar a transação. Tente novamente.');
    }
  }

  return (
    <Modal title={isEdit ? 'Editar transação' : 'Nova transação'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
        {/* Tipo */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              type === 'income'
                ? 'bg-income-50 dark:bg-income-500/10 border-income-500 text-income-600 dark:text-income-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowUpRight size={16} />
            Receita
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              type === 'expense'
                ? 'bg-expense-50 dark:bg-expense-500/10 border-expense-500 text-expense-600 dark:text-expense-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowDownRight size={16} />
            Despesa
          </button>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Descrição
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Supermercado, Salário..."
            className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
              errors.description ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Valor
          </label>
          <CurrencyInput value={amount} onChange={setAmount} error={Boolean(errors.amount)} />
          {errors.amount && (
            <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Categoria
          </label>
          <Select
            value={category}
            onChange={setCategory}
            options={categories}
            placeholder="Selecione uma categoria"
            error={Boolean(errors.category)}
          />
          {errors.category && (
            <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{errors.category}</p>
          )}
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
              errors.date ? 'border-expense-500' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.date && <p className="text-xs text-expense-600 dark:text-expense-400 mt-1">{errors.date}</p>}
        </div>

        {submitError && (
          <p className="text-sm text-expense-600 dark:text-expense-400 bg-expense-50 dark:bg-expense-500/10 rounded-xl px-3 py-2.5">
            {submitError}
          </p>
        )}

        {/* Botões */}
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
            {isEdit ? 'Salvar alterações' : 'Adicionar transação'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
