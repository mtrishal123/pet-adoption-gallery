import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { Pet } from './types/pet';

/**
 * Integration smoke test for the whole app: it mounts the full provider +
 * router tree against a mocked `/pets` endpoint and exercises the core flows
 * (initial render, search filtering, and selecting a pet for download).
 */

const pets: Pet[] = [
  {
    id: 'dog-1',
    title: 'Biscuit',
    description: 'A goofy golden retriever.',
    imageUrl: 'https://example.com/biscuit.jpg',
    createdAt: '2026-05-01T00:00:00Z',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    location: 'Boston, MA',
    goodWith: ['kids', 'dogs'],
    sizeBytes: 500_000,
  },
  {
    id: 'cat-1',
    title: 'Cleo',
    description: 'A regal tabby who loves naps.',
    imageUrl: 'https://example.com/cleo.jpg',
    createdAt: '2026-04-01T00:00:00Z',
    species: 'cat',
    breed: 'Tabby',
    age: 2,
    gender: 'female',
    location: 'Cambridge, MA',
    goodWith: ['cats'],
    sizeBytes: 750_000,
  },
];

function mockFetchOk(body: unknown) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => body,
  } as Response);
}

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe('<App />', () => {
  it('renders the gallery once pets load', async () => {
    mockFetchOk(pets);
    render(<App />);

    // Both pets are visible after the fetch resolves.
    expect(await screen.findByText('Biscuit')).toBeInTheDocument();
    expect(screen.getByText('Cleo')).toBeInTheDocument();
  });

  it('filters the gallery via the search box', async () => {
    mockFetchOk(pets);
    render(<App />);
    await screen.findByText('Biscuit');

    await userEvent.type(screen.getByLabelText('Search pets'), 'cleo');

    await waitFor(() => {
      expect(screen.queryByText('Biscuit')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Cleo')).toBeInTheDocument();
  });

  it('shows the selection bar with a count when a pet is selected', async () => {
    mockFetchOk(pets);
    render(<App />);
    await screen.findByText('Biscuit');

    await userEvent.click(
      screen.getByRole('button', { name: /select biscuit for download/i }),
    );

    const region = await screen.findByRole('region', { name: /download selection/i });
    expect(within(region).getByText('1')).toBeInTheDocument();
  });
});
