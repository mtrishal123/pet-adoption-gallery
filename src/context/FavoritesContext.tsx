import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { usePersistentState } from '../hooks/useLocalStorage';

/**
 * Tracks the user's adoption shortlist ("favorites").
 *
 * This is intentionally separate from the download `SelectionContext`: favoriting
 * a pet is a long-lived intent ("I'm interested in adopting"), so it is persisted
 * to `localStorage` and survives across sessions, whereas a download selection is
 * transient.
 */
interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = usePersistentState<string[]>(
    'pag.favorites',
    [],
  );

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback((id: string) => favoriteSet.has(id), [favoriteSet]);

  const toggleFavorite = useCallback(
    (id: string) =>
      setFavoriteIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev],
      ),
    [setFavoriteIds],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      isFavorite,
      toggleFavorite,
      count: favoriteIds.length,
    }),
    [favoriteIds, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
