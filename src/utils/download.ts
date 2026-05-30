/**
 * Downloads one or more pet images as a single `.zip` bundle.
 *
 * Bundling into a zip avoids the browser's "multiple file download" blocking
 * that happens when you trigger several `<a download>` clicks in a row, and
 * gives the user one tidy artifact. Images are fetched as blobs in parallel and
 * added to the archive; any individual image that fails to download is skipped
 * but reported back so the UI can inform the user.
 */

import JSZip from 'jszip';
import type { Pet } from '../types/pet';

export interface DownloadResult {
  /** Number of images successfully added to the zip. */
  succeeded: number;
  /** Titles of pets whose image could not be fetched. */
  failed: string[];
}

/** Derives a safe-ish file extension from an image URL, defaulting to jpg. */
function extensionFor(url: string): string {
  const match = /\.(jpe?g|png|gif|webp|avif)(?:$|\?)/i.exec(url);
  return match ? match[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

/** Turns a pet title into a filesystem-friendly slug. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Builds and triggers download of a zip containing the given pets' images.
 *
 * @param pets      Pets whose images should be bundled.
 * @param fileName  Name for the generated archive (defaults to `pets.zip`).
 */
export async function downloadPetsAsZip(
  pets: Pet[],
  fileName = 'pets.zip',
): Promise<DownloadResult> {
  const zip = new JSZip();
  const failed: string[] = [];

  // Fetch every image in parallel; collect blobs (or record failures).
  const entries = await Promise.all(
    pets.map(async (pet) => {
      try {
        const res = await fetch(pet.imageUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        return { pet, blob };
      } catch {
        failed.push(pet.title);
        return null;
      }
    }),
  );

  let succeeded = 0;
  const usedNames = new Set<string>();
  for (const entry of entries) {
    if (!entry) continue;
    const { pet, blob } = entry;
    // Ensure unique, readable filenames inside the archive.
    let base = `${slugify(pet.title)}-${pet.id}`;
    if (usedNames.has(base)) base = `${base}-${succeeded}`;
    usedNames.add(base);
    zip.file(`${base}.${extensionFor(pet.imageUrl)}`, blob);
    succeeded += 1;
  }

  if (succeeded > 0) {
    const archive = await zip.generateAsync({ type: 'blob' });
    triggerBlobDownload(archive, fileName);
  }

  return { succeeded, failed };
}

/** Programmatically downloads a Blob by clicking a temporary object-URL link. */
function triggerBlobDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Release the object URL on the next tick so the download can start.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
