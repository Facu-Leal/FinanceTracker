import { usePrivacyMode } from '../privacyMode';
import { formatCurrency } from '../utils/currency';

interface MaskedAmountProps {
  value: number;
  className?: string;
}

/** Renders a currency amount, or a fixed-width mask when privacy mode is on — never reveals magnitude via the mask's length. */
export function MaskedAmount({ value, className }: MaskedAmountProps) {
  const { hidden } = usePrivacyMode();
  return <span className={className}>{hidden ? '$ ••••••' : formatCurrency(value)}</span>;
}
