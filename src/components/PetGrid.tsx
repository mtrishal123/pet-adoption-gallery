import type { Pet } from '../types/pet';
import { GalleryGrid } from './GalleryGrid';
import { PetCard } from './PetCard';

/** Renders a list of pets into the responsive gallery grid. */
export function PetGrid({ pets }: { pets: Pet[] }) {
  return (
    <GalleryGrid>
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </GalleryGrid>
  );
}
