// Validated categorical palette (fixed order — see dataviz skill's references/palette.md).
// Assign slots by fixed order, never re-cycle per filter/render; fold anything past 8 into "Otros".
export const CATEGORICAL_PALETTE = [
  '#2a78d6', // 1 blue
  '#008300', // 2 green
  '#e87ba4', // 3 magenta
  '#eda100', // 4 yellow
  '#1baf7a', // 5 aqua
  '#eb6834', // 6 orange
  '#4a3aa7', // 7 violet
  '#e34948', // 8 red
] as const;

export const INCOME_COLOR = CATEGORICAL_PALETTE[1]; // green
export const EXPENSE_COLOR = CATEGORICAL_PALETTE[7]; // red
export const SEQUENTIAL_HUE = CATEGORICAL_PALETTE[0]; // blue

// Chrome (gridlines/axis labels) follows the current Bootstrap theme via CSS variables,
// so it stays recessive against the surface in both light and dark mode automatically —
// unlike the categorical/status colors above, which are data and stay fixed either way.
export const CHART_TEXT_MUTED = 'var(--bs-secondary-color)';
export const CHART_GRIDLINE = 'var(--bs-border-color-translucent)';

export function paletteSlot(index: number): string {
  return CATEGORICAL_PALETTE[index % CATEGORICAL_PALETTE.length]!;
}
