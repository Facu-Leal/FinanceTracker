import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface PrivacyModeValue {
  hidden: boolean;
  toggle: () => void;
}

const PrivacyModeContext = createContext<PrivacyModeValue>({ hidden: false, toggle: () => {} });

/**
 * App-wide "hide my balance" toggle — for when someone's looking over your shoulder while you
 * check Movimientos. Deliberately in-memory only (not persisted): it should default back to
 * visible on the next app open rather than silently staying hidden and confusing you later.
 */
export function PrivacyModeProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const value = useMemo(() => ({ hidden, toggle: () => setHidden((h) => !h) }), [hidden]);
  return <PrivacyModeContext.Provider value={value}>{children}</PrivacyModeContext.Provider>;
}

export function usePrivacyMode(): PrivacyModeValue {
  return useContext(PrivacyModeContext);
}
