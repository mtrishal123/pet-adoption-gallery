import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { usePersistentState } from '../hooks/useLocalStorage';

/**
 * Tracks which pets are selected for download.
 *
 * The state lives in context (above the router) so a selection survives
 * navigation to a detail view and back — a hard requirement of the challenge.
 * It is additionally persisted to `sessionStorage`, so it also survives a page
 * refresh within the same browser session.
 */
interface SelectionContextValue {
  /** Selected pet ids in insertion order. */
  selectedIds: string[];
  /** Fast membership lookups for cards. */
  isSelected: (id: string) => boolean;
  /** Add the id if absent, remove it if present. */
  toggle: (id: string) => void;
  /** Add many ids at once (used by "Select all"). */
  selectMany: (ids: string[]) => void;
  /** Remove all selections. */
  clear: () => void;
  count: number;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = usePersistentState<string[]>(
    'pag.selection',
    [],
    // Download selection is a per-session concern.
    window.sessionStorage,
  );

  // A Set derived from the array gives O(1) `isSelected` checks.
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const isSelected = useCallback((id: string) => selectedSet.has(id), [selectedSet]);

  const toggle = useCallback(
    (id: string) =>
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      ),
    [setSelectedIds],
  );

  const selectMany = useCallback(
    (ids: string[]) =>
      setSelectedIds((prev) => Array.from(new Set([...prev, ...ids]))),
    [setSelectedIds],
  );

  const clear = useCallback(() => setSelectedIds([]), [setSelectedIds]);

  const value = useMemo<SelectionContextValue>(
    () => ({
      selectedIds,
      isSelected,
      toggle,
      selectMany,
      clear,
      count: selectedIds.length,
    }),
    [selectedIds, isSelected, toggle, selectMany, clear],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within a SelectionProvider');
  return ctx;
}
