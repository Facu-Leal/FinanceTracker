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

/**
 * Parses a user-typed amount into integer cents, tolerating both "." and "," as either a
 * thousands-grouping mark or a decimal separator. The ambiguity is resolved by looking at the
 * LAST "." or "," in the string: if it's followed by exactly 1-2 digits, it's treated as a
 * decimal point (e.g. "20000.00" -> 20000 pesos, "16.666,67" -> 16666.67 pesos); otherwise every
 * "." / "," is a grouping mark and gets stripped (e.g. "200.000" -> 200000, "2.000.000" ->
 * 2000000). This is what actually distinguishes "twenty thousand, no cents" from "two hundred
 * thousand" when a period could mean either — naively stripping every "." (or always reading it
 * as a decimal point) silently inflates or deflates the amount by 10x-100x.
 */
export function parseAmountToCents(input: string): Money {
  const trimmed = input.trim();
  if (!trimmed) return 0;

  const decimalMatch = trimmed.match(/^(.*)[.,](\d{1,2})$/);
  if (decimalMatch) {
    const pesos = Number(decimalMatch[1]!.replace(/\D/g, '')) || 0;
    const cents = Number(decimalMatch[2]!.padEnd(2, '0'));
    return pesos * 100 + cents;
  }

  const pesos = Number(trimmed.replace(/\D/g, '')) || 0;
  return pesos * 100;
}

/** Compact form for chart axis ticks, e.g. 20000000 -> "$200k", 150000000 -> "$1.5M". */
export function formatCompactCurrency(cents: Money): string {
  const pesos = cents / 100;
  const abs = Math.abs(pesos);
  if (abs >= 1_000_000) return `$${(pesos / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${Math.round(pesos / 1000)}k`;
  return `$${Math.round(pesos)}`;
}

/** Formats cents back into a plain editable string (for pre-filling an amount input), e.g. 1666666 -> "16666.66", 50000 -> "500". */
export function centsToEditableString(cents: Money): string {
  const pesos = cents / 100;
  return Number.isInteger(pesos) ? String(pesos) : pesos.toFixed(2);
}
