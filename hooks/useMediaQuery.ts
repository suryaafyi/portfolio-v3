"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query. Server snapshot is `false`, so the server and first
 * client render agree (no hydration mismatch); React then re-renders with the
 * real match after hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    [query]
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
