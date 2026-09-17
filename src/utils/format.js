const CURRENCY_LOCALES = {
  BRL: 'pt-BR',
  USD: 'en-US',
  EUR: 'de-DE',
};

export function formatCurrency(value, currency = 'BRL') {
  return (value ?? 0).toLocaleString(CURRENCY_LOCALES[currency] ?? 'pt-BR', {
    style: 'currency',
    currency,
  });
}

export function formatDateBR(dateStr) {
  // Bare ISO date strings ('YYYY-MM-DD') parse as UTC midnight, which can
  // display a day early in negative-UTC-offset timezones. Forcing a local
  // time-of-day keeps the date stable regardless of the viewer's timezone.
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('pt-BR');
}
