import { useEffect, useState } from 'react';

const STORAGE_KEY = 'finflow_currency';
export const CURRENCIES = ['BRL', 'USD', 'EUR'];

function loadInitialCurrency() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (CURRENCIES.includes(stored)) return stored;
  } catch (err) {
    console.error('Não foi possível ler a moeda do localStorage:', err);
  }
  return 'BRL';
}

export function useCurrency() {
  const [currency, setCurrency] = useState(loadInitialCurrency);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch (err) {
      console.error('Não foi possível salvar a moeda no localStorage:', err);
    }
  }, [currency]);

  return { currency, setCurrency };
}
