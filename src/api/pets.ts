/** Thin data-access layer around the `/pets` endpoint. */

import type { Pet } from '../types/pet';

/** Endpoint served by the Vite middleware (see `vite.config.ts`). */
export const PETS_ENDPOINT = '/pets';

/**
 * Fetches the full list of pets using the Fetch API, as required by the spec.
 *
 * Throws a descriptive `Error` on network failure or a non-OK status so the
 * data hook can surface a meaningful error state. An optional `AbortSignal`
 * lets callers cancel the request (used to avoid setting state after unmount).
 */
export async function fetchPets(signal?: AbortSignal): Promise<Pet[]> {
  const response = await fetch(PETS_ENDPOINT, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load pets (HTTP ${response.status} ${response.statusText}).`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Unexpected response shape: expected an array of pets.');
  }

  return data as Pet[];
}
