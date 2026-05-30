import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { usePetsContext } from '../context/PetsContext';
import { useSelection } from '../context/SelectionContext';
import { useFavorites } from '../context/FavoritesContext';
import { downloadPetsAsZip } from '../utils/download';
import { capitalize, formatBytes, formatDate } from '../utils/format';
import { Badge, Button, Container, Spinner } from '../components/ui';
import { LoadingState, EmptyState, ErrorState } from '../components/StatusViews';
import { ArrowLeftIcon, CheckIcon, DownloadIcon, HeartIcon } from '../components/icons';

/**
 * Detail view for a single pet (`/pets/:id`).
 *
 * Reads from the shared pets context, so deep-linking here loads the data once
 * and navigating back to the gallery preserves both the list and the user's
 * selection. Mirrors the loading/error/empty handling of the gallery and adds
 * an explicit "not found" case for unknown ids.
 */
export function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { status, pets, error, refetch } = usePetsContext();
  const { isSelected, toggle } = useSelection();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [downloading, setDownloading] = useState(false);

  if (status === 'loading') {
    return (
      <Container>
        <LoadingState count={4} />
      </Container>
    );
  }

  if (status === 'error') {
    return (
      <Container>
        <ErrorState message={error ?? 'Unknown error.'} onRetry={refetch} />
      </Container>
    );
  }

  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    return (
      <Container>
        <EmptyState
          title="Pet not found"
          message="We couldn’t find that pet. It may have already found a home!"
          action={
            <Button as={Link} to="/">
              Back to gallery
            </Button>
          }
        />
      </Container>
    );
  }

  const selected = isSelected(pet.id);
  const favorite = isFavorite(pet.id);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadPetsAsZip([pet], `${pet.title.toLowerCase()}-${pet.id}.zip`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Container>
      <BackLink to="/">
        <ArrowLeftIcon width={18} height={18} /> Back to gallery
      </BackLink>

      <Layout>
        <Media>
          <img src={pet.imageUrl} alt={`${pet.title}, a ${pet.breed}`} />
          <FavFloat
            type="button"
            $active={favorite}
            onClick={() => toggleFavorite(pet.id)}
            aria-pressed={favorite}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon filled={favorite} width={22} height={22} />
          </FavFloat>
        </Media>

        <Info>
          <Header>
            <div>
              <Name>{pet.title}</Name>
              <Breed>{pet.breed}</Breed>
            </div>
            <Badge $tone="primary">{capitalize(pet.species)}</Badge>
          </Header>

          <Facts>
            <Fact>
              <dt>Age</dt>
              <dd>{pet.age < 1 ? 'Under 1 year' : `${pet.age} years`}</dd>
            </Fact>
            <Fact>
              <dt>Gender</dt>
              <dd>{capitalize(pet.gender)}</dd>
            </Fact>
            <Fact>
              <dt>Location</dt>
              <dd>{pet.location}</dd>
            </Fact>
            <Fact>
              <dt>Listed</dt>
              <dd>{formatDate(pet.createdAt)}</dd>
            </Fact>
          </Facts>

          <Section>
            <h2>About {pet.title}</h2>
            <p>{pet.description}</p>
          </Section>

          <Section>
            <h2>Good with</h2>
            <Tags>
              {pet.goodWith.map((tag) => (
                <Badge key={tag} $tone="success">
                  {capitalize(tag)}
                </Badge>
              ))}
            </Tags>
          </Section>

          <Actions>
            <Button
              type="button"
              $variant={selected ? 'secondary' : 'primary'}
              onClick={() => toggle(pet.id)}
            >
              {selected ? <CheckIcon width={18} height={18} /> : null}
              {selected ? 'Selected for download' : 'Select for download'}
            </Button>
            <Button type="button" $variant="secondary" onClick={handleDownload} disabled={downloading}>
              {downloading ? <Spinner $size={18} /> : <DownloadIcon width={18} height={18} />}
              Download photo ({formatBytes(pet.sizeBytes)})
            </Button>
          </Actions>
        </Info>
      </Layout>
    </Container>
  );
}

/* ----------------------------- styled parts ----------------------------- */

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(6)};
  font-weight: 600;
  color: ${({ theme }) => theme.color.textMuted};
  &:hover {
    color: ${({ theme }) => theme.color.primary};
  }
`;

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(8)};
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1.1fr 1fr;
  }
`;

const Media = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.md};
  background: ${({ theme }) => theme.color.surfaceAlt};

  img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;

    @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
      position: sticky;
      top: 90px;
    }
  }
`;

const FavFloat = styled.button<{ $active: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.space(4)};
  right: ${({ theme }) => theme.space(4)};
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.color.scrim};
  color: ${({ theme, $active }) => ($active ? theme.color.danger : '#fff')};
  backdrop-filter: blur(4px);
  transition: transform 0.12s ease;
  &:hover {
    transform: scale(1.08);
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(6)};
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(3)};
`;

const Name = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.6rem);
`;

const Breed = styled.p`
  color: ${({ theme }) => theme.color.primary};
  font-weight: 600;
  margin-top: ${({ theme }) => theme.space(1)};
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => theme.space(5)};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Fact = styled.div`
  dt {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.color.textMuted};
    margin-bottom: ${({ theme }) => theme.space(1)};
  }
  dd {
    font-weight: 600;
    font-size: 1.02rem;
  }
`;

const Section = styled.section`
  h2 {
    font-size: 1.15rem;
    margin-bottom: ${({ theme }) => theme.space(2)};
  }
  p {
    color: ${({ theme }) => theme.color.textMuted};
    line-height: 1.65;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(3)};
`;
