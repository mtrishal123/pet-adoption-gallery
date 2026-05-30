import { describe, expect, it } from 'vitest';
import { capitalize, formatBytes, formatDate, formatRelativeDate } from './format';

describe('formatBytes', () => {
  it('handles zero and invalid input', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(-5)).toBe('0 B');
    expect(formatBytes(NaN)).toBe('0 B');
  });

  it('formats bytes, KB and MB with the right precision', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1_572_864)).toBe('1.5 MB');
  });
});

describe('formatRelativeDate', () => {
  const now = new Date('2026-05-29T12:00:00Z');

  it('returns coarse relative labels', () => {
    expect(formatRelativeDate('2026-05-29T08:00:00Z', now)).toBe('Today');
    expect(formatRelativeDate('2026-05-28T12:00:00Z', now)).toBe('Yesterday');
    expect(formatRelativeDate('2026-05-26T12:00:00Z', now)).toBe('3 days ago');
    expect(formatRelativeDate('2026-05-10T12:00:00Z', now)).toBe('2 weeks ago');
    expect(formatRelativeDate('2026-03-01T12:00:00Z', now)).toBe('2 months ago');
  });

  it('handles invalid dates gracefully', () => {
    expect(formatRelativeDate('not-a-date', now)).toBe('Unknown date');
  });
});

describe('formatDate / capitalize', () => {
  it('formats an ISO date', () => {
    expect(formatDate('2026-05-12T00:00:00Z')).toMatch(/May/);
  });

  it('capitalizes the first letter', () => {
    expect(capitalize('dog')).toBe('Dog');
    expect(capitalize('')).toBe('');
  });
});
