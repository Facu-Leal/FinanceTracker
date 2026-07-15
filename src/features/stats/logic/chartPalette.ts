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

export const CHART_TEXT_MUTED = '#898781';
export const CHART_GRIDLINE = '#e1e0d9';

export function paletteSlot(index: number): string {
  return CATEGORICAL_PALETTE[index % CATEGORICAL_PALETTE.length]!;
}
