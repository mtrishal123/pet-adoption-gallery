/**
 * Mock data source for the gallery.
 *
 * In a real product this data would come from a backend. For this challenge we
 * generate a deterministic, realistic dataset here and serve it from a tiny
 * Vite middleware (see `vite.config.ts`) at `GET /pets`, so the front-end makes
 * a genuine `fetch('/pets')` network request exactly as the spec requires.
 *
 * This module is intentionally dependency-free (it only imports a *type*) so it
 * can be imported both by the Vite config (Node context) and by the browser
 * app / unit tests without pulling in DOM or build-only code.
 */

import type { Gender, GoodWith, Pet, Species } from '../types/pet';

/** Real, stable dog photos from the Dog CEO image CDN (`images.dog.ceo`). */
const DOG_IMAGES: string[] = [
  'https://images.dog.ceo/breeds/poodle-miniature/n02113712_2746.jpg',
  'https://images.dog.ceo/breeds/australian-kelpie/IMG_7387.jpg',
  'https://images.dog.ceo/breeds/mountain-swiss/n02107574_2633.jpg',
  'https://images.dog.ceo/breeds/cockapoo/george-tongue.jpg',
  'https://images.dog.ceo/breeds/coonhound/n02089078_965.jpg',
  'https://images.dog.ceo/breeds/terrier-tibetan/n02097474_1741.jpg',
  'https://images.dog.ceo/breeds/shihtzu/n02086240_3983.jpg',
  'https://images.dog.ceo/breeds/setter-irish/n02100877_797.jpg',
  'https://images.dog.ceo/breeds/greyhound-italian/n02091032_1635.jpg',
  'https://images.dog.ceo/breeds/schnauzer-giant/n02097130_2421.jpg',
  'https://images.dog.ceo/breeds/pointer-german/n02100236_3504.jpg',
  'https://images.dog.ceo/breeds/labrador/n02099712_4133.jpg',
  'https://images.dog.ceo/breeds/buhund-norwegian/hakon3.jpg',
  'https://images.dog.ceo/breeds/komondor/n02105505_4353.jpg',
  'https://images.dog.ceo/breeds/terrier-westhighland/n02098286_945.jpg',
  'https://images.dog.ceo/breeds/shihtzu/n02086240_3186.jpg',
  'https://images.dog.ceo/breeds/labrador/n02099712_3988.jpg',
  'https://images.dog.ceo/breeds/deerhound-scottish/n02092002_1698.jpg',
  'https://images.dog.ceo/breeds/corgi-cardigan/n02113186_741.jpg',
  'https://images.dog.ceo/breeds/retriever-golden/n02099601_280.jpg',
  'https://images.dog.ceo/breeds/redbone/n02090379_2463.jpg',
  'https://images.dog.ceo/breeds/hound-ibizan/n02091244_3240.jpg',
  'https://images.dog.ceo/breeds/terrier-wheaten/n02098105_244.jpg',
  'https://images.dog.ceo/breeds/setter-english/n02100735_10211.jpg',
  'https://images.dog.ceo/breeds/mountain-bernese/n02107683_1629.jpg',
  'https://images.dog.ceo/breeds/ridgeback-rhodesian/n02087394_1352.jpg',
];

/** Real, stable cat photos from TheCatAPI image CDN (`cdn2.thecatapi.com`). */
const CAT_IMAGES: string[] = [
  'https://cdn2.thecatapi.com/images/1qt.jpg',
  'https://cdn2.thecatapi.com/images/26t.jpg',
  'https://cdn2.thecatapi.com/images/2bn.jpg',
  'https://cdn2.thecatapi.com/images/2gh.jpg',
  'https://cdn2.thecatapi.com/images/2ij.jpg',
  'https://cdn2.thecatapi.com/images/3eo.jpg',
  'https://cdn2.thecatapi.com/images/6hr.jpg',
  'https://cdn2.thecatapi.com/images/73r.jpg',
  'https://cdn2.thecatapi.com/images/9s7.jpg',
  'https://cdn2.thecatapi.com/images/a8o.jpg',
  'https://cdn2.thecatapi.com/images/as7.jpg',
  'https://cdn2.thecatapi.com/images/b5r.jpg',
  'https://cdn2.thecatapi.com/images/bar.jpg',
  'https://cdn2.thecatapi.com/images/blk.jpg',
];

/** Name pools, indexed deterministically so output never changes between runs. */
const DOG_NAMES = [
  'Biscuit', 'Rocky', 'Luna', 'Cooper', 'Daisy', 'Bear', 'Maple', 'Finn',
  'Hazel', 'Tucker', 'Willow', 'Scout', 'Penny', 'Murphy', 'Olive', 'Gus',
  'Ruby', 'Ziggy', 'Nala', 'Bowie', 'Pepper', 'Mango', 'Archie', 'Juno', 'Otis',
];
const CAT_NAMES = [
  'Miso', 'Clementine', 'Salem', 'Pixel', 'Cleo', 'Pumpkin', 'Sable',
  'Marble', 'Tofu', 'Pesto', 'Loki', 'Nova', 'Wasabi', 'Mochi',
];

const DOG_BREEDS = [
  'Miniature Poodle', 'Australian Kelpie', 'Swiss Mountain Dog', 'Cockapoo',
  'Coonhound', 'Tibetan Terrier', 'Shih Tzu', 'Irish Setter', 'Italian Greyhound',
  'Giant Schnauzer', 'German Pointer', 'Labrador Retriever', 'Norwegian Buhund',
  'Komondor', 'West Highland Terrier', 'Shih Tzu', 'Labrador Retriever',
  'Scottish Deerhound', 'Cardigan Welsh Corgi', 'Golden Retriever', 'Redbone Coonhound',
  'Ibizan Hound', 'Wheaten Terrier', 'English Setter', 'Bernese Mountain Dog',
  'Rhodesian Ridgeback',
];
const CAT_BREEDS = [
  'Domestic Shorthair', 'Tabby', 'Tuxedo', 'Calico', 'Maine Coon', 'Siamese',
  'Russian Blue', 'Bengal', 'Ragdoll', 'British Shorthair', 'Tortoiseshell',
  'Domestic Longhair', 'Abyssinian', 'Scottish Fold',
];

const LOCATIONS = [
  'Boston, MA', 'Cambridge, MA', 'Somerville, MA', 'Providence, RI',
  'Portland, ME', 'Worcester, MA', 'Burlington, VT', 'Hartford, CT',
];

const DOG_BLURBS = [
  'A goofy, tennis-ball-obsessed sweetheart who greets every morning like it is the best day ever.',
  'Calm on the leash and cuddly on the couch — equally happy hiking trails or napping in a sunbeam.',
  'Knows "sit", "shake", and exactly which neighbor keeps treats. Crate-trained and eager to please.',
  'A gentle old soul looking for a quiet home where the walks are slow and the belly rubs are frequent.',
  'Endless energy and an even bigger heart. Would thrive with an active family and a fenced yard.',
  'Shy at first, devoted forever. Once you earn this pup’s trust you have a shadow for life.',
];
const CAT_BLURBS = [
  'A chatty window-watcher who supervises all household activity from the nearest warm surface.',
  'Independent but affectionate on their own terms — expect head-bonks the moment you sit down.',
  'A playful pouncer who will turn a bottle cap into an hour of entertainment. Litter-trained pro.',
  'A lap-seeking purr machine that believes every laptop is a heated bed built just for them.',
  'Quietly curious and impeccably groomed, this one prefers a calm home with plenty of perches.',
  'Rescued and ready to love. Slow blinks guaranteed once they decide you are part of the family.',
];

const GENDERS: Gender[] = ['male', 'female'];
const GOOD_WITH_POOL: GoodWith[] = ['kids', 'dogs', 'cats'];

/**
 * Builds a `Pet` from an index and species-specific inputs. All "random"
 * looking values are derived from the index so the dataset is fully
 * deterministic — important for stable rendering and reproducible tests.
 */
function makePet(
  index: number,
  species: Species,
  imageUrl: string,
  name: string,
  breed: string,
  blurb: string,
): Pet {
  // Spread listing-creation dates across roughly the last ~150 days.
  const daysAgo = (index * 17 + (species === 'cat' ? 7 : 0)) % 150;
  const created = new Date('2026-05-20T12:00:00Z');
  created.setDate(created.getDate() - daysAgo);

  // Ages between 0.5 and ~8 years, derived from the index.
  const age = Math.round(((index % 16) * 0.5 + 0.5) * 10) / 10;

  // Estimated image size: 350KB–1.8MB, deterministic per pet.
  const sizeBytes = 350_000 + ((index * 97_003) % 1_450_000);

  // Pick 1–3 "good with" traits deterministically.
  const goodWith = GOOD_WITH_POOL.filter((_, i) => (index >> i) % 2 === 0);

  return {
    id: `${species}-${String(index + 1).padStart(3, '0')}`,
    title: name,
    description: blurb,
    imageUrl,
    createdAt: created.toISOString(),
    species,
    breed,
    age,
    gender: GENDERS[index % GENDERS.length],
    location: LOCATIONS[index % LOCATIONS.length],
    goodWith: goodWith.length > 0 ? goodWith : ['kids'],
    sizeBytes,
  };
}

/**
 * The full, deterministic list of adoptable pets. Dogs and cats are
 * interleaved so the gallery shows variety before any sorting is applied.
 */
export const PETS: Pet[] = (() => {
  const dogs = DOG_IMAGES.map((url, i) =>
    makePet(i, 'dog', url, DOG_NAMES[i % DOG_NAMES.length], DOG_BREEDS[i], DOG_BLURBS[i % DOG_BLURBS.length]),
  );
  const cats = CAT_IMAGES.map((url, i) =>
    makePet(
      i,
      'cat',
      url,
      CAT_NAMES[i % CAT_NAMES.length],
      CAT_BREEDS[i % CAT_BREEDS.length],
      CAT_BLURBS[i % CAT_BLURBS.length],
    ),
  );

  // Interleave dogs and cats for a varied initial ordering.
  const merged: Pet[] = [];
  const max = Math.max(dogs.length, cats.length);
  for (let i = 0; i < max; i++) {
    if (dogs[i]) merged.push(dogs[i]);
    if (cats[i]) merged.push(cats[i]);
  }
  return merged;
})();
