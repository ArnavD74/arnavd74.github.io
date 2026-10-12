import { useState, useEffect, type RefObject } from 'react';
import { registerReveal, parseRevealMargin } from '../lib/revealRegistry';

/**
 * One-shot "has this been reached?" flag for scroll reveals.
 *
 * Replaces framer-motion's `whileInView` + `viewport.once`, which can strand an
 * element at its `initial` state — invisible but still occupying its full box —
 * whenever the viewport observer never catches it on screen. See
 * {@link registerReveal} for why that happens and how measuring instead fixes it.
 *
 * @param margin CSS-margin-style offset for the trigger line, e.g. '-80px 0px'.
 */
export const useRevealOnce = (ref: RefObject<Element | null>, margin = '0px') => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (revealed || !element) return;

    return registerReveal({
      element,
      margin: parseRevealMargin(margin),
      reveal: () => setRevealed(true),
    });
  }, [ref, margin, revealed]);

  return revealed;
};
