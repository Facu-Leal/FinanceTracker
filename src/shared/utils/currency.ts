import type { Money } from '../types/common';

const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formats integer cents as a currency string, e.g. 1234500 -> "$12.345". */
export function formatCurrency(cents: Money): string {
  return formatter.format(cents / 100);
}

/** Parses a user-typed amount (in whole currency units, e.g. "12345.50") into integer cents. */
export function parseAmountToCents(input: string): Money {
  const normalized = input.replace(/\./g, '').replace(',', '.').trim();
  const value = Number.parseFloat(normalized);
  if (Number.isNaN(value)) return 0;
  return Math.round(value * 100);
}
