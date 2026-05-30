import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay`ms have
 * passed without a change. Used to keep the search box responsive while
 * avoiding re-filtering the gallery on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
