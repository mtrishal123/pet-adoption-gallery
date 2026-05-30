import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePets } from './usePets';
import type { Pet } from '../types/pet';

const samplePet: Pet = {
  id: 'dog-1',
  title: 'Rex',
  description: 'A good dog',
  imageUrl: 'https://example.com/rex.jpg',
  createdAt: '2026-01-01T00:00:00Z',
  species: 'dog',
  breed: 'Mixed',
  age: 2,
  gender: 'male',
  location: 'Boston, MA',
  goodWith: ['kids'],
  sizeBytes: 1000,
};

/** Builds a minimal `Response`-like object for the mocked fetch. */
function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => body,
  } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('usePets', () => {
  it('starts in the loading state', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePets());
    expect(result.current.status).toBe('loading');
    expect(result.current.pets).toEqual([]);
  });

  it('transitions to success with data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([samplePet]));
    const { result } = renderHook(() => usePets());

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.pets).toHaveLength(1);
    expect(result.current.pets[0].title).toBe('Rex');
    expect(result.current.error).toBeNull();
  });

  it('transitions to the empty state for an empty array', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([]));
    const { result } = renderHook(() => usePets());

    await waitFor(() => expect(result.current.status).toBe('empty'));
    expect(result.current.pets).toEqual([]);
  });

  it('transitions to the error state on a non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(null, false, 500));
    const { result } = renderHook(() => usePets());

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toContain('500');
  });

  it('refetch retries after an error and can succeed', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse(null, false, 500))
      .mockResolvedValueOnce(jsonResponse([samplePet]));

    const { result } = renderHook(() => usePets());
    await waitFor(() => expect(result.current.status).toBe('error'));

    result.current.refetch();
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
