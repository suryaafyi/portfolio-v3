import type Lenis from "lenis";

/**
 * SiteChrome owns the single site-wide Lenis instance; this lets other
 * components (e.g. the Works list's magnetic snap) drive that same scroller
 * instead of fighting it with native `window.scrollTo`.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;
