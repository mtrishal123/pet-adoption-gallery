import { useCallback, useEffect, useRef } from 'react';

/**
 * Invokes `onLoadMore` whenever a sentinel element scrolls into view.
 *
 * Returns a ref callback to attach to the sentinel (an element rendered at the
 * bottom of the list). Built on `IntersectionObserver`, so it does not run
 * expensive work on every scroll event.
 *
 * @param onLoadMore  Called when the sentinel becomes visible and `hasMore`.
 * @param hasMore     Whether there are more items to load (observer pauses when false).
 * @param rootMargin  Pre-fetch margin so loading starts before the user hits the very bottom.
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  hasMore: boolean,
  rootMargin = '400px',
): (node: Element | null) => void {
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Keep the latest callback without re-creating the observer each render.
  // Updating the ref in an effect (rather than during render) keeps the
  // observer stable while always calling the freshest callback.
  const callbackRef = useRef(onLoadMore);
  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  const setSentinel = useCallback(
    (node: Element | null) => {
      observerRef.current?.disconnect();
      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) callbackRef.current();
        },
        { rootMargin },
      );
      observerRef.current.observe(node);
    },
    [hasMore, rootMargin],
  );

  // Clean up when the component using the sentinel unmounts.
  useEffect(() => () => observerRef.current?.disconnect(), []);

  return setSentinel;
}
