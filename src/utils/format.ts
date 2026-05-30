/** Small, pure formatting helpers shared across the UI (and unit-tested). */

/**
 * Formats a byte count into a human-readable string (e.g. `1.4 MB`).
 * Uses binary units (1024) and caps at GB, which is plenty for image sizes.
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);
  // Show one decimal place for KB and up, none for raw bytes.
  const decimals = exponent === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[exponent]}`;
}

/** Formats an ISO date string as e.g. `May 12, 2026`. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats an ISO date as a coarse relative string (e.g. `3 days ago`,
 * `2 months ago`). `now` is injectable so the logic is deterministic in tests.
 */
export function formatRelativeDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/** Capitalizes the first letter of a string. */
export function capitalize(value: string): string {
  return value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);
}
