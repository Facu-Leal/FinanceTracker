import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface PrivacyModeValue {
  hidden: boolean;
  toggle: () => void;
}

const PrivacyModeContext = createContext<PrivacyModeValue>({ hidden: true, toggle: () => {} });

/**
 * App-wide "hide my balance" toggle — for when someone's looking over your shoulder while you
 * check Movimientos. Starts hidden by default every time the app opens (the safer default —
 * you opt into showing amounts, not out of hiding them) and is deliberately in-memory only:
 * revealing it doesn't persist across app restarts, so it's always hidden again next time.
 */
export function PrivacyModeProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(true);
  const value = useMemo(() => ({ hidden, toggle: () => setHidden((h) => !h) }), [hidden]);
  return <PrivacyModeContext.Provider value={value}>{children}</PrivacyModeContext.Provider>;
}

export function usePrivacyMode(): PrivacyModeValue {
  return useContext(PrivacyModeContext);
}
