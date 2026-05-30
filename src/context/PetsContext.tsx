import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { usePets, type UsePetsResult } from '../hooks/usePets';

/**
 * Shares a single `usePets` result across the whole app.
 *
 * Fetching once here (rather than per-page) means the gallery and the detail
 * view read from the same in-memory list, so deep-linking to `/pets/:id` and
 * navigating back to the gallery never triggers a redundant network request.
 */
const PetsContext = createContext<UsePetsResult | null>(null);

export function PetsProvider({ children }: { children: ReactNode }) {
  const value = usePets();
  return <PetsContext.Provider value={value}>{children}</PetsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePetsContext(): UsePetsResult {
  const ctx = useContext(PetsContext);
  if (!ctx) throw new Error('usePetsContext must be used within a PetsProvider');
  return ctx;
}
