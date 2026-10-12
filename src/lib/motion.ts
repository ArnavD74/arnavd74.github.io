/** Shared motion primitives so every section animates with the same curve. */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * Fade + rise reveal used by every section's content blocks.
 * `custom` on the consuming element supplies the delay.
 */
export const blurUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  }),
};

/**
 * Shared `viewport` config for scroll reveals.
 *
 * Mobile uses a large positive margin so the reveal has already been triggered
 * by the time the element is actually on screen. Without it, the element's own
 * `whileInView` fires at the same moment the scroll-linked parent opacity is
 * ramping up, and the two animations fight — producing the "snap-in" flash.
 */
export const revealViewport = (isMobile: boolean) =>
  isMobile
    ? ({ once: true, margin: '2000px 0px' } as const)
    : ({ once: true, margin: '-80px 0px' } as const);
