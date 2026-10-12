/** Shared motion primitives so every section animates with the same curve. */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

/** Fade + rise used by section content blocks. `custom` supplies the delay. */
export const blurUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  }),
};

/** Shorter-travel sibling of {@link blurUp}, for cards and list rows. */
export const riseIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  }),
};

/** Section-header eyebrow parts, which slide in from the left. */
export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: EASE_OUT_EXPO },
  }),
};

/** Title reveal from behind a clipping parent. */
export const slideUpReveal = {
  hidden: { y: '100%' },
  visible: (delay = 0) => ({
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE_OUT_EXPO },
  }),
};

/** Footer entrance — gentler curve, shorter travel. */
export const softRise = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE_SOFT },
  }),
};

/** No-op variant, for when motion should be skipped entirely. */
export const noReveal = {
  hidden: {},
  visible: {},
};

/**
 * rootMargin for the About blocks' reveal trigger.
 *
 * Mobile uses a large positive margin so the reveal has already run by the time
 * the element is actually on screen. Without it the reveal fires at the same
 * moment the scroll-linked ScrollReveal parent is ramping its own opacity, and
 * the two read as a snap-in.
 */
export const revealMargin = (isMobile: boolean) => (isMobile ? '2000px 0px' : '-80px 0px');
