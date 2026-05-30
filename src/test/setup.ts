// Registers jest-dom's custom matchers (e.g. `toBeInTheDocument`) with Vitest's
// `expect`, polyfills a couple of browser APIs jsdom lacks, and cleans up the
// DOM after each test.
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom doesn't implement IntersectionObserver (used by the infinite-scroll
// hook), so provide a no-op stub for tests.
if (!('IntersectionObserver' in globalThis)) {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
}

// jsdom logs "Not implemented" for scrollTo; the app calls it on route change.
vi.stubGlobal('scrollTo', vi.fn());

afterEach(() => {
  cleanup();
});
