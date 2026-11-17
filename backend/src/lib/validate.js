export const MAX_AMOUNT = 99999999.99;

export function isCents(value) {
  return Number(value.toFixed(2)) === value;
}

const MAX_ID = 2147483647;

export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 && id <= MAX_ID ? id : null;
}

export function textError(values, max) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (typeof value !== 'string') return 'invalid field type';
    if (value.length > max) return 'text too long';
  }
  return null;
}
