import { useCallback, useEffect, useState } from 'react';

/**
 * A `useState`-like hook that persists its value to `localStorage` (or
 * `sessionStorage`) and keeps it in sync across browser tabs.
 *
 * Reads are lazily initialised and wrapped in try/catch so the app still works
 * if storage is unavailable (e.g. private mode) or contains corrupt JSON.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  storage: Storage = window.localStorage,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = storage.getItem(key);
      return raw === null ? initialValue : (JSON.parse(raw) as T);
    } catch {
      return initialValue;
    }
  });

  // Persist on every change.
  useEffect(() => {
    try {
      storage.setItem(key, JSON.stringify(state));
    } catch {
      /* Storage full or unavailable — fail silently. */
    }
  }, [key, state, storage]);

  // Sync changes made in other tabs/windows.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key || event.newValue === null) return;
      try {
        setState(JSON.parse(event.newValue) as T);
      } catch {
        /* ignore malformed cross-tab payloads */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const set = useCallback((value: T | ((prev: T) => T)) => {
    setState(value);
  }, []);

  return [state, set];
}
