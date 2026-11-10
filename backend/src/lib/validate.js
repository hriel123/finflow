export const MAX_AMOUNT = 99999999.99;

export function textError(values, max) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (typeof value !== 'string') return 'invalid field type';
    if (value.length > max) return 'text too long';
  }
  return null;
}
