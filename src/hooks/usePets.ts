import { useCallback, useEffect, useState } from 'react';
import { fetchPets } from '../api/pets';
import type { Pet } from '../types/pet';

/**
 * The four mutually-exclusive states the gallery data can be in. Modelling this
 * as an explicit union (rather than a tangle of `isLoading`/`error` booleans)
 * forces every consumer to handle loading, error and empty states deliberately,
 * which is exactly what the challenge asks for.
 */
export type PetsStatus = 'loading' | 'error' | 'empty' | 'success';

export interface UsePetsResult {
  status: PetsStatus;
  /** Loaded pets (empty array unless `status === 'success'`). */
  pets: Pet[];
  /** Populated only when `status === 'error'`. */
  error: string | null;
  /** Re-runs the request (used by the error state's "Try again" button). */
  refetch: () => void;
}

/**
 * Custom hook responsible for loading and managing the pet list.
 *
 * Responsibilities:
 *  - issues the `fetch('/pets')` request,
 *  - tracks an explicit `status` (loading | error | empty | success),
 *  - cancels in-flight requests on unmount / refetch via `AbortController`,
 *  - exposes a `refetch` for retrying after an error.
 */
export function usePets(): UsePetsResult {
  const [pets, setPets] = useState<Pet[]>([]);
  const [status, setStatus] = useState<PetsStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  // Bumping this re-runs the effect to retry a failed request.
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    // Resetting to the loading state when the (re)fetch kicks off is the whole
    // point of this data-fetching effect, so the set-state-in-effect rule is
    // intentionally relaxed for just these two reset calls.
    /* eslint-disable react-hooks/set-state-in-effect */
    setStatus('loading');
    setError(null);
    /* eslint-enable react-hooks/set-state-in-effect */

    fetchPets(controller.signal)
      .then((data) => {
        if (!active) return;
        setPets(data);
        setStatus(data.length === 0 ? 'empty' : 'success');
      })
      .catch((err: unknown) => {
        // Ignore the abort that fires on unmount/refetch.
        if (!active || controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setStatus('error');
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadToken]);

  const refetch = useCallback(() => setReloadToken((n) => n + 1), []);

  return { status, pets, error, refetch };
}
