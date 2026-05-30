import { describe, expect, it } from 'vitest';
import type { Pet } from '../types/pet';
import { applyQuery, DEFAULT_QUERY } from './petQuery';

/** Minimal pet factory for tests — only the fields the query logic reads. */
function pet(overrides: Partial<Pet>): Pet {
  return {
    id: 'x',
    title: 'Rex',
    description: 'A good dog',
    imageUrl: '',
    createdAt: '2026-01-01T00:00:00Z',
    species: 'dog',
    breed: 'Mixed',
    age: 2,
    gender: 'male',
    location: 'Boston, MA',
    goodWith: ['kids'],
    sizeBytes: 1000,
    ...overrides,
  };
}

const pets: Pet[] = [
  pet({ id: '1', title: 'Biscuit', species: 'dog', createdAt: '2026-05-01T00:00:00Z' }),
  pet({ id: '2', title: 'Alpine', species: 'cat', createdAt: '2026-01-01T00:00:00Z' }),
  pet({ id: '3', title: 'Cleo', species: 'cat', createdAt: '2026-03-01T00:00:00Z', description: 'loves naps' }),
];

describe('applyQuery', () => {
  it('returns all pets with the default query', () => {
    expect(applyQuery(pets, DEFAULT_QUERY)).toHaveLength(3);
  });

  it('does not mutate the input array', () => {
    const copy = [...pets];
    applyQuery(pets, { ...DEFAULT_QUERY, sort: 'name-asc' });
    expect(pets).toEqual(copy);
  });

  it('filters by search across title and description', () => {
    expect(applyQuery(pets, { ...DEFAULT_QUERY, search: 'cleo' }).map((p) => p.id)).toEqual(['3']);
    expect(applyQuery(pets, { ...DEFAULT_QUERY, search: 'naps' }).map((p) => p.id)).toEqual(['3']);
  });

  it('filters by species', () => {
    const cats = applyQuery(pets, { ...DEFAULT_QUERY, species: 'cat' });
    expect(cats.every((p) => p.species === 'cat')).toBe(true);
    expect(cats).toHaveLength(2);
  });

  it('sorts by name ascending and descending', () => {
    expect(applyQuery(pets, { ...DEFAULT_QUERY, sort: 'name-asc' }).map((p) => p.title)).toEqual([
      'Alpine',
      'Biscuit',
      'Cleo',
    ]);
    expect(applyQuery(pets, { ...DEFAULT_QUERY, sort: 'name-desc' }).map((p) => p.title)).toEqual([
      'Cleo',
      'Biscuit',
      'Alpine',
    ]);
  });

  it('sorts by date newest and oldest first', () => {
    expect(applyQuery(pets, { ...DEFAULT_QUERY, sort: 'date-newest' }).map((p) => p.id)).toEqual([
      '1',
      '3',
      '2',
    ]);
    expect(applyQuery(pets, { ...DEFAULT_QUERY, sort: 'date-oldest' }).map((p) => p.id)).toEqual([
      '2',
      '3',
      '1',
    ]);
  });
});
