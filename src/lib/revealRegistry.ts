/**
 * Shared trigger for one-shot scroll reveals.
 *
 * IntersectionObserver is the obvious tool here and it is the wrong one. It only
 * delivers a callback when an element's intersection *changes* across a
 * threshold, so an element that travels from below the fold to above it between
 * two samples — a fling, a dropped frame, a jump to the page bottom — produces no
 * delivery at all. framer-motion's `whileInView` + `once` is built on exactly
 * that, and its state machine only leaves `initial` on an `isIntersecting: true`
 * delivery, so a skipped element stays at `opacity: 0` with its full layout box
 * forever: a row that has vanished leaving a gap.
 *
 * Measuring positions directly removes the dependency on ever catching the
 * element on screen. One rAF-coalesced listener serves every pending reveal and
 * detaches itself once they have all fired, so the cost is bounded and
 * disappears entirely by the time the reader reaches the bottom of the page.
 */

interface PendingReveal {
  element: Element;
  /** How far below the viewport bottom the trigger line sits, in px. */
  margin: number;
  reveal: () => void;
}

const pending = new Set<PendingReveal>();
let frame = 0;
let listening = false;

const check = () => {
  frame = 0;
  const viewportHeight = window.innerHeight;
  const ready: PendingReveal[] = [];

  for (const entry of pending) {
    // A single rule covers both cases. `top` falls as the element rises, so an
    // element that is merely entering and one the page has already scrolled
    // clean past (top far negative) both satisfy it. Reveals are one-way, so the
    // two never need telling apart.
    if (entry.element.getBoundingClientRect().top <= viewportHeight + entry.margin) {
      ready.push(entry);
    }
  }

  // Drain after measuring: revealing re-renders, which can register or drop
  // entries, and mutating the set mid-iteration risks skipping one.
  for (const entry of ready) {
    pending.delete(entry);
    entry.reveal();
  }

  if (pending.size === 0) stopListening();
};

const schedule = () => {
  if (frame === 0) frame = requestAnimationFrame(check);
};

const startListening = () => {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
};

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  if (frame !== 0) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

/** Registers an element for reveal. Returns an unsubscribe function. */
export const registerReveal = (entry: PendingReveal) => {
  pending.add(entry);
  startListening();
  schedule();

  return () => {
    pending.delete(entry);
    if (pending.size === 0) stopListening();
  };
};

/**
 * Reads the vertical offset out of a CSS-margin-style string ("-80px 0px").
 * Positive pulls the trigger earlier, negative pushes it later — matching the
 * `rootMargin` semantics these values were originally written for.
 */
export const parseRevealMargin = (margin: string) => Number.parseFloat(margin) || 0;
