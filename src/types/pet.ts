/**
 * Domain types for the Pet Adoption Gallery.
 *
 * `Species` and `Gender` are modelled as string-literal unions rather than
 * TypeScript `enum`s on purpose: the project's tsconfig enables
 * `erasableSyntaxOnly`, which forbids runtime-emitting constructs like enums.
 */

export type Species = 'dog' | 'cat';

export type Gender = 'male' | 'female';

/** Traits a pet is known to be comfortable around — used for filtering. */
export type GoodWith = 'kids' | 'dogs' | 'cats';

/**
 * A single adoptable pet.
 *
 * The fields required by the challenge spec are `id`, `imageUrl`, `title`,
 * `description` and `createdAt` (the "entity creation date"). The remaining
 * fields enrich the gallery so the detail view and filters feel real.
 */
export interface Pet {
  id: string;
  /** Display title shown on the card (the pet's name). */
  title: string;
  /** Longer marketing-style blurb shown on the card and detail page. */
  description: string;
  /** Absolute URL to the pet's photo. */
  imageUrl: string;
  /** ISO-8601 timestamp representing when the listing was created. */
  createdAt: string;

  species: Species;
  breed: string;
  /** Age in years (can be fractional for young animals). */
  age: number;
  gender: Gender;
  /** City / shelter location string. */
  location: string;
  /** Traits this pet is comfortable around. */
  goodWith: GoodWith[];
  /**
   * Estimated size of the full-resolution image in bytes. Pre-computed in the
   * mock data so the UI can show an estimated download size without issuing a
   * `HEAD` request per image.
   */
  sizeBytes: number;
}
