import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { usePetsContext } from '../context/PetsContext';
import { useFavorites } from '../context/FavoritesContext';
import { Button, Container } from '../components/ui';
import { PetGrid } from '../components/PetGrid';
import { SelectionBar } from '../components/SelectionBar';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusViews';

/**
 * The user's adoption shortlist.
 *
 * Favorites are stored as ids in `localStorage`; here we resolve them against
 * the loaded pet list (preserving the order in which they were favorited).
 */
export function FavoritesPage() {
  const { status, pets, error, refetch } = usePetsContext();
  const { favoriteIds } = useFavorites();

  const favoritePets = useMemo(() => {
    const byId = new Map(pets.map((p) => [p.id, p]));
    return favoriteIds
      .map((id) => byId.get(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [pets, favoriteIds]);

  return (
    <>
      <Container>
        <Head>
          <h1>Your favorites</h1>
          <p>Pets you’ve shortlisted for adoption. Saved on this device.</p>
        </Head>

        {status === 'loading' && <LoadingState count={4} />}

        {status === 'error' && (
          <ErrorState message={error ?? 'Unknown error.'} onRetry={refetch} />
        )}

        {status !== 'loading' && status !== 'error' && favoritePets.length === 0 && (
          <EmptyState
            title="No favorites yet"
            message="Tap the heart on any pet to add them to your shortlist."
            action={
              <Button as={Link} to="/">
                Browse pets
              </Button>
            }
          />
        )}

        {favoritePets.length > 0 && <PetGrid pets={favoritePets} />}
      </Container>

      <SelectionBar allPets={pets} visiblePets={favoritePets} />
    </>
  );
}

const Head = styled.section`
  margin-bottom: ${({ theme }) => theme.space(7)};
  h1 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    margin-bottom: ${({ theme }) => theme.space(2)};
  }
  p {
    color: ${({ theme }) => theme.color.textMuted};
    font-size: 1.05rem;
  }
`;
