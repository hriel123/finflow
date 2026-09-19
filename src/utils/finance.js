const PT_MONTHS_SHORT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

// Transaction dates are 'YYYY-MM-DD' strings. Parsing them as bare ISO dates
// (`new Date('YYYY-MM-DD')`) reads as UTC midnight, which can shift a day
// backward in negative-UTC-offset timezones (e.g. Brazil). Forcing a local
// time-of-day keeps the date stable regardless of the viewer's timezone.
function parseLocalDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`);
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function getPeriodRange(period, customRange) {
  const now = new Date();

  // A custom range with only one of the two dates filled in still applies
  // that bound instead of silently falling back to "this month" below, which
  // would otherwise look like the picked date was ignored.
  if (period === 'custom' && (customRange?.start || customRange?.end)) {
    return {
      start: customRange?.start ? startOfDay(parseLocalDate(customRange.start)) : new Date(0),
      end: customRange?.end ? endOfDay(parseLocalDate(customRange.end)) : endOfDay(now),
    };
  }

  if (period === 'today') {
    return { start: startOfDay(now), end: endOfDay(now) };
  }

  if (period === 'week') {
    const day = now.getDay(); // 0 = Sunday .. 6 = Saturday
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    return { start: startOfDay(monday), end: endOfDay(now) };
  }

  if (period === 'last3months') {
    const firstOfRange = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return { start: startOfDay(firstOfRange), end: endOfDay(now) };
  }

  if (period === 'year') {
    const firstOfYear = new Date(now.getFullYear(), 0, 1);
    return { start: startOfDay(firstOfYear), end: endOfDay(now) };
  }

  // 'month' (default)
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start: startOfDay(firstOfMonth), end: endOfDay(now) };
}

export function filterTransactions(transactions, { period, customRange, type, category }) {
  const range = getPeriodRange(period, customRange);

  return transactions.filter((t) => {
    const txDate = parseLocalDate(t.date);
    const inRange = txDate >= range.start && txDate <= range.end;
    const matchesType = type === 'all' || t.type === type;
    const matchesCategory = category === 'all' || t.category === category;
    return inRange && matchesType && matchesCategory;
  });
}

export function groupByMonth(transactions, range) {
  const startY = range.start.getFullYear();
  const startM = range.start.getMonth();
  const endY = range.end.getFullYear();
  const endM = range.end.getMonth();
  const totalMonths = (endY - startY) * 12 + (endM - startM) + 1;
  const monthsCount = Math.min(12, Math.max(1, totalMonths));

  const months = [];
  for (let i = monthsCount - 1; i >= 0; i -= 1) {
    const d = new Date(endY, endM - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${PT_MONTHS_SHORT[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    months.push({ key, label, income: 0, expense: 0 });
  }

  const byKey = new Map(months.map((m) => [m.key, m]));
  transactions.forEach((t) => {
    const bucket = byKey.get(t.date.slice(0, 7));
    if (!bucket) return;
    if (t.type === 'income') bucket.income += t.amount;
    else if (t.type === 'expense') bucket.expense += t.amount;
  });

  return months;
}

export function groupByCategory(transactions) {
  const totals = new Map();
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      totals.set(t.category, (totals.get(t.category) || 0) + t.amount);
    });

  return Array.from(totals, ([category, total]) => ({ category, total })).sort(
    (a, b) => b.total - a.total
  );
}

export function getTopCategory(transactions) {
  return groupByCategory(transactions)[0] ?? null;
}
