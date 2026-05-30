import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { usePetsContext } from '../context/PetsContext';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { applyQuery, DEFAULT_QUERY, type PetQuery } from '../utils/petQuery';
import { Container, Spinner } from '../components/ui';
import { Toolbar } from '../components/Toolbar';
import { PetGrid } from '../components/PetGrid';
import { SelectionBar } from '../components/SelectionBar';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusViews';

/** How many cards to reveal per "page" of the infinite scroll. */
const PAGE_SIZE = 8;

/**
 * Main gallery page.
 *
 * Combines the data hook (via context) with client-side search/filter/sort and
 * infinite scroll. It explicitly renders the loading, error and empty states,
 * and only shows the toolbar + grid once data is available.
 */
export function GalleryPage() {
  const { status, pets, error, refetch } = usePetsContext();

  const [query, setQuery] = useState<PetQuery>(DEFAULT_QUERY);
  // Debounce only the search term so typing stays snappy.
  const debouncedSearch = useDebounce(query.search, 250);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // The fully-derived, sorted + filtered list.
  const filtered = useMemo(
    () => applyQuery(pets, { ...query, search: debouncedSearch }),
    [pets, query, debouncedSearch],
  );

  // Reset the infinite-scroll window whenever the query changes. This uses the
  // React-recommended "adjust state during render" pattern (storing the prior
  // query key) rather than an effect, so there is no extra render pass.
  const queryKey = `${debouncedSearch}|${query.species}|${query.sort}`;
  const [prevQueryKey, setPrevQueryKey] = useState(queryKey);
  if (queryKey !== prevQueryKey) {
    setPrevQueryKey(queryKey);
    setVisibleCount(PAGE_SIZE);
  }

  const visiblePets = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const sentinelRef = useInfiniteScroll(
    () => setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtered.length)),
    hasMore,
  );

  const patchQuery = (patch: Partial<PetQuery>) =>
    setQuery((prev) => ({ ...prev, ...patch }));

  return (
    <>
      <Container>
        <Hero>
          <h1>Find your new best friend</h1>
          <p>
            Browse adoptable pets, shortlist your favorites, and download photo
            packs to share with the family.
          </p>
        </Hero>

        {status === 'loading' && <LoadingState />}

        {status === 'error' && (
          <ErrorState message={error ?? 'Unknown error.'} onRetry={refetch} />
        )}

        {status === 'empty' && (
          <EmptyState
            title="No pets available yet"
            message="There are no adoptable pets in the system right now. Please check back soon!"
          />
        )}

        {status === 'success' && (
          <>
            <Toolbar
              query={query}
              onChange={patchQuery}
              resultCount={filtered.length}
              totalCount={pets.length}
            />

            {filtered.length === 0 ? (
              <EmptyState
                title="No matches found"
                message="Try a different search term or clear the filters to see all pets."
              />
            ) : (
              <>
                <PetGrid pets={visiblePets} />

                {/* Infinite-scroll sentinel + loading indicator. */}
                {hasMore && (
                  <Sentinel ref={sentinelRef}>
                    <Spinner $size={26} />
                    <span>Loading more pets…</span>
                  </Sentinel>
                )}
                {!hasMore && visiblePets.length > PAGE_SIZE && (
                  <EndNote>You’ve reached the end — {filtered.length} pets shown.</EndNote>
                )}
              </>
            )}
          </>
        )}
      </Container>

      {/* Sticky bar appears whenever something is selected (any route view). */}
      <SelectionBar allPets={pets} visiblePets={filtered} />
    </>
  );
}

/* ----------------------------- styled parts ----------------------------- */

const Hero = styled.section`
  margin-bottom: ${({ theme }) => theme.space(7)};

  h1 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    margin-bottom: ${({ theme }) => theme.space(2)};
  }
  p {
    max-width: 560px;
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 1.05rem;
  }
`;

const Sentinel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(10)} 0;
  color: ${({ theme }) => theme.color.textMuted};
`;

const EndNote = styled.p`
  text-align: center;
  padding: ${({ theme }) => theme.space(10)} 0;
  color: ${({ theme }) => theme.color.textMuted};
`;
