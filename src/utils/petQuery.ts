/**
 * Pure helpers for searching, filtering and sorting the pet list.
 *
 * Keeping this logic out of the components makes it trivial to unit-test and
 * lets the gallery derive its visible list with a single `useMemo`.
 */

import type { Pet, Species } from '../types/pet';

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'date-newest'
  | 'date-oldest';

/** Human-readable labels for the sort dropdown. */
export const SORT_LABELS: Record<SortOption, string> = {
  'name-asc': 'Name (A–Z)',
  'name-desc': 'Name (Z–A)',
  'date-newest': 'Date (Newest first)',
  'date-oldest': 'Date (Oldest first)',
};

export const SORT_OPTIONS = Object.keys(SORT_LABELS) as SortOption[];

/** All the user-controlled query state for the gallery in one object. */
export interface PetQuery {
  /** Free-text search across title + description. */
  search: string;
  /** `'all'` or a specific species. */
  species: Species | 'all';
  sort: SortOption;
}

export const DEFAULT_QUERY: PetQuery = {
  search: '',
  species: 'all',
  sort: 'date-newest',
};

/** Returns true if the pet matches the (already lower-cased) search term. */
function matchesSearch(pet: Pet, term: string): boolean {
  if (term === '') return true;
  return (
    pet.title.toLowerCase().includes(term) ||
    pet.description.toLowerCase().includes(term) ||
    pet.breed.toLowerCase().includes(term)
  );
}

/**
 * Applies search, species filter and sort to a pet list and returns a new
 * array (the input is never mutated).
 */
export function applyQuery(pets: Pet[], query: PetQuery): Pet[] {
  const term = query.search.trim().toLowerCase();

  const filtered = pets.filter(
    (pet) =>
      matchesSearch(pet, term) &&
      (query.species === 'all' || pet.species === query.species),
  );

  // `localeCompare` gives natural, case-insensitive alphabetical ordering.
  const sorted = [...filtered].sort((a, b) => {
    switch (query.sort) {
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'date-oldest':
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'date-newest':
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return sorted;
}
