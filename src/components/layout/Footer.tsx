import { useState, useRef, useEffect, useCallback } from 'react';
import { animate, type AnimationPlaybackControls } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { EASE_SOFT, noReveal, softRise } from '../../lib/motion';
import Reveal from '../ui/Reveal';

const CREDITS = [
  { name: 'React 19', url: 'https://react.dev' },
  { name: 'TypeScript', url: 'https://www.typescriptlang.org' },
  { name: 'Vite', url: 'https://vite.dev' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { name: 'Framer Motion', url: 'https://motion.dev' },
  { name: 'React Scroll', url: 'https://www.npmjs.com/package/react-scroll' },
];

const FONTS = [
  { name: 'Clash Display', url: 'https://www.fontshare.com/fonts/clash-display', fontClass: 'font-display' },
  { name: 'Satoshi', url: 'https://www.fontshare.com/fonts/satoshi', fontClass: 'font-body' },
  { name: 'JetBrains Mono', url: 'https://fonts.google.com/specimen/JetBrains+Mono', fontClass: 'font-mono' },
];

const PANEL_ID = 'footer-credits';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showCredits, setShowCredits] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  /** Panel height currently written to the DOM, in px. */
  const heightRef = useRef(0);
  /** Viewport y the footer bar is being held at for this toggle. */
  const anchorTopRef = useRef(0);
  /** While true, each height step is cancelled out by an equal scroll. */
  const pinnedRef = useRef(false);
  const playbackRef = useRef<AnimationPlaybackControls | null>(null);

  const releasePin = useCallback(() => {
    pinnedRef.current = false;
  }, []);

  /**
   * Drives the panel's height, cancelling each step out with an equal scroll.
   *
   * The panel is rendered *above* the bar, so growing it by N pushes the bar N
   * further down the document; scrolling by the same N holds the bar — and the
   * toggle button under the cursor — perfectly still, which is what makes the
   * panel appear to unfurl upward out from behind it. The page therefore stays
   * pinned to its bottom, and collapsing runs the same path in reverse.
   *
   * Both writes happen here, in order, inside the animation's own update step:
   * the height lands first, then the bar is re-measured against it and the
   * scroll corrected. Doing it in one synchronous step is what keeps the two in
   * the same frame. Driving the scroll from a ResizeObserver instead — which is
   * where this started — runs it *after* layout, where scrolling can trigger a
   * second observer pass that the browser defers to the next frame; the frame in
   * between is painted with the panel already grown but the page not yet
   * scrolled, which flashes content from higher up the page into view.
   *
   * The correction is measured rather than derived from the height delta.
   * Arithmetic looks equivalent and is not: collapsing at the page bottom also
   * shrinks the document, so the browser clamps the scroll by the same amount
   * and an open-loop correction double-counts it, landing ~25px short. Measuring
   * re-closes the loop every frame.
   */
  const stepTo = useCallback((height: number) => {
    const panel = panelRef.current;
    const bar = barRef.current;
    if (!panel) return;

    heightRef.current = height;
    panel.style.height = `${height}px`;
    if (!pinnedRef.current || !bar) return;

    // Reads back the layout that the write above just invalidated, so the delta
    // already accounts for the new height and for any clamping.
    const delta = bar.getBoundingClientRect().top - anchorTopRef.current;
    if (Math.abs(delta) < 0.5) return;
    // behavior:'instant' guards against an inherited smooth scroll-behavior
    // turning each correction into its own easing animation.
    window.scrollBy({ top: delta, behavior: 'instant' });
  }, []);

  const toggleCredits = () => {
    const open = !showCredits;
    setShowCredits(open);

    const target = open ? (contentRef.current?.offsetHeight ?? 0) : 0;
    playbackRef.current?.stop();
    anchorTopRef.current = barRef.current?.getBoundingClientRect().top ?? 0;
    pinnedRef.current = true;

    if (prefersReducedMotion) {
      stepTo(target);
      pinnedRef.current = false;
      return;
    }

    playbackRef.current = animate(heightRef.current, target, {
      duration: 0.55,
      ease: EASE_SOFT,
      onUpdate: stepTo,
      onComplete: releasePin,
    });
  };

  // Reflow while open: match the content's new height without animating, and
  // without touching the scroll position (the user did not ask to move).
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(() => {
      if (!showCredits || pinnedRef.current) return;
      const panel = panelRef.current;
      if (!panel) return;
      heightRef.current = content.offsetHeight;
      panel.style.height = `${heightRef.current}px`;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [showCredits]);

  // Any deliberate scroll input hands control straight back to the user, so the
  // anchor can never fight someone who starts scrolling mid-animation.
  useEffect(() => {
    window.addEventListener('wheel', releasePin, { passive: true });
    window.addEventListener('touchmove', releasePin, { passive: true });
    return () => {
      window.removeEventListener('wheel', releasePin);
      window.removeEventListener('touchmove', releasePin);
      playbackRef.current?.stop();
    };
  }, [releasePin]);

  // Mobile skips the footer's entrance animation — on a short viewport the footer
  // is already on screen when the page settles, so it reads as a stutter.
  const entranceVariants = isMobile || prefersReducedMotion ? noReveal : softRise;

  const pill =
    'px-3 py-1.5 bg-slate/40 rounded-lg text-xs text-ash hover:text-cyan ' +
    'border border-zinc/15 hover:border-cyan/30 transition-colors duration-300';

  return (
    // overflow-anchor:none stops the browser's own scroll anchoring from also
    // compensating for the panel resize and fighting the anchor below.
    // Deliberately left transparent: the wave field renders behind the footer.
    <footer className="relative z-10 border-t border-zinc/10" style={{ overflowAnchor: 'none' }}>
      {/* Credits panel — deliberately rendered before the bar so it opens upward.
          A plain div: the height is driven imperatively by stepTo so that it and
          the scroll correction commit together. */}
      <div
        ref={panelRef}
        id={PANEL_ID}
        // h-0 as a class, not an inline style: the height is owned imperatively
        // by stepTo, and a React-managed inline height would be re-applied on any
        // re-render and clobber it. The class only has to hold the closed state
        // until the first toggle, after which the inline height always wins.
        className="overflow-hidden h-0"
        style={{
          // contain:paint marks this clip as a self-contained paint unit, so the
          // strip it reveals cannot be filled by anything painted outside it.
          // Purely a rasterisation hint — the box is already overflow-hidden, so
          // layout and visuals are unchanged.
          contain: 'paint',
        }}
        aria-hidden={!showCredits}
        inert={!showCredits}
      >
        <div ref={contentRef} className="px-6 pt-10 pb-2">
          <div className="max-w-2xl mx-auto">
            <p className="font-mono text-[10px] text-ash uppercase tracking-widest text-center mb-5">
              Built with
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {CREDITS.map((credit) => (
                <a
                  key={credit.name}
                  href={credit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pill}
                >
                  {credit.name}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
              <span
                aria-hidden="true"
                className="font-display text-lg text-silver/50 mr-1 relative top-[1px]"
              >
                Aa
              </span>
              {FONTS.map((font) => (
                <a
                  key={font.name}
                  href={font.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${pill} ${font.fontClass}`}
                >
                  {font.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar — held still while the panel above it opens and closes. */}
      <div ref={barRef} className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
          {/* Stacks below sm: the two lines plus the divider do not fit on one
              row at 390px, and the flex row used to wrap both of them mid-phrase
              around a stranded separator. */}
          <Reveal
            variants={entranceVariants}
            delay={0.3}
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3"
          >
            <p className="font-mono text-xs text-ash whitespace-nowrap">
              Designed &amp; Built by Arnav Dashaputra
            </p>
            <span aria-hidden="true" className="hidden sm:inline text-zinc/50">
              |
            </span>
            <p className="font-mono text-xs text-ash whitespace-nowrap">2019 - {currentYear}</p>
          </Reveal>

          <Reveal variants={entranceVariants} delay={0.55}>
            <button
              type="button"
              onClick={toggleCredits}
              aria-expanded={showCredits}
              aria-controls={PANEL_ID}
              className="font-mono text-xs text-ash hover:text-cyan transition-colors cursor-pointer
                         rounded focus-visible:outline-2 focus-visible:outline-offset-4
                         focus-visible:outline-cyan/70"
            >
              {showCredits ? 'Hide Credits' : 'Credits & Attributions'}
            </button>
          </Reveal>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
