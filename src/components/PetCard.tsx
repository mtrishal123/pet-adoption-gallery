import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Pet } from '../types/pet';
import { useSelection } from '../context/SelectionContext';
import { useFavorites } from '../context/FavoritesContext';
import { capitalize, formatBytes, formatRelativeDate } from '../utils/format';
import { Badge } from './ui';
import { CheckIcon, HeartIcon } from './icons';

interface PetCardProps {
  pet: Pet;
}

/**
 * A single pet tile in the gallery grid.
 *
 * Interactions:
 *  - clicking the card body navigates to the detail route,
 *  - the checkbox (top-left) toggles download selection,
 *  - the heart (top-right) toggles the adoption favorite.
 *
 * Selection/favorite buttons stop event propagation so they don't trigger the
 * card's navigation. Wrapped in `memo` since the gallery can render many cards.
 */
function PetCardComponent({ pet }: PetCardProps) {
  const { isSelected, toggle } = useSelection();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgFailed, setImgFailed] = useState(false);

  const selected = isSelected(pet.id);
  const favorite = isFavorite(pet.id);

  // Graceful fallback if the remote image fails to load.
  const imageSrc = imgFailed
    ? `https://picsum.photos/seed/${pet.id}/600/600`
    : pet.imageUrl;

  return (
    <Card $selected={selected}>
      <MediaLink to={`/pets/${pet.id}`} aria-label={`View ${pet.title}'s details`}>
        <Image
          src={imageSrc}
          alt={`${pet.title}, a ${pet.breed}`}
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
        <SpeciesTag>{capitalize(pet.species)}</SpeciesTag>
      </MediaLink>

      {/* Selection checkbox */}
      <SelectButton
        type="button"
        $selected={selected}
        onClick={() => toggle(pet.id)}
        aria-pressed={selected}
        aria-label={selected ? `Deselect ${pet.title}` : `Select ${pet.title} for download`}
      >
        {selected && <CheckIcon width={16} height={16} />}
      </SelectButton>

      {/* Favorite heart */}
      <FavButton
        type="button"
        $active={favorite}
        onClick={() => toggleFavorite(pet.id)}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${pet.title} from favorites` : `Add ${pet.title} to favorites`}
      >
        <HeartIcon filled={favorite} width={18} height={18} />
      </FavButton>

      <Body>
        <TitleRow>
          <Title to={`/pets/${pet.id}`}>{pet.title}</Title>
          <Age>{pet.age < 1 ? '<1 yr' : `${pet.age} yr`}</Age>
        </TitleRow>
        <Breed>{pet.breed}</Breed>
        <Description>{pet.description}</Description>
        <Meta>
          <Badge $tone="neutral">{formatBytes(pet.sizeBytes)}</Badge>
          <MetaDate>Added {formatRelativeDate(pet.createdAt)}</MetaDate>
        </Meta>
      </Body>
    </Card>
  );
}

export const PetCard = memo(PetCardComponent);

/* ----------------------------- styled parts ----------------------------- */

const Card = styled.article<{ $selected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.surface};
  border: 2px solid
    ${({ theme, $selected }) => ($selected ? theme.color.primary : theme.color.border)};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const MediaLink = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surfaceAlt};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${MediaLink}:hover & {
    transform: scale(1.06);
  }
`;

const SpeciesTag = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.space(3)};
  bottom: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => `${theme.space(1)} ${theme.space(2.5)}`};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.scrim};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
`;

const SelectButton = styled.button<{ $selected: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.space(3)};
  left: ${({ theme }) => theme.space(3)};
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  border: 2px solid
    ${({ theme, $selected }) => ($selected ? theme.color.primary : 'rgba(255,255,255,0.9)')};
  background: ${({ theme, $selected }) =>
    $selected ? theme.color.primary : 'rgba(20, 14, 40, 0.35)'};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.12s ease, background-color 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

const FavButton = styled.button<{ $active: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.space(3)};
  right: ${({ theme }) => theme.space(3)};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  background: rgba(20, 14, 40, 0.35);
  color: ${({ theme, $active }) => ($active ? theme.color.danger : '#fff')};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.12s ease, color 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(4)};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)};
`;

const Title = styled(Link)`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color.text};
  &:hover {
    color: ${({ theme }) => theme.color.primary};
  }
`;

const Age = styled.span`
  flex-shrink: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Breed = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.primary};
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.color.textMuted};
  /* Clamp to three lines so every card is the same height. */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)};
  margin-top: ${({ theme }) => theme.space(1)};
`;

const MetaDate = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.color.textMuted};
`;
