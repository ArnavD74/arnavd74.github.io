import { useState, useEffect } from 'react';

const queryFor = (breakpoint: number) => `(max-width: ${breakpoint - 1}px)`;

/**
 * Tracks whether the viewport is below `breakpoint`.
 *
 * The initial value is read synchronously in the useState initializer rather
 * than in an effect, so the very first render already has the right answer —
 * components that branch their animation config on it never flash the desktop
 * variant on a phone.
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(queryFor(breakpoint)).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(queryFor(breakpoint));
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
};
