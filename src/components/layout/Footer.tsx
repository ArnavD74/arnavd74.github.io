import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { EASE_SOFT } from '../../lib/motion';

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
  const barRef = useRef<HTMLDivElement>(null);
  /** Viewport y the footer bar should be held at while the panel resizes. */
  const anchorTopRef = useRef(0);
  /** While true, every panel size change re-anchors the bar. */
  const pinnedRef = useRef(false);

  const releasePin = useCallback(() => {
    pinnedRef.current = false;
  }, []);

  /**
   * Holds the footer bar perfectly still on screen while the credits panel
   * changes height.
   *
   * The panel is rendered *above* the bar, so growing it pushes the bar further
   * down the document. Scrolling by exactly that much cancels the shift out: the
   * bar — and the toggle button under the cursor — does not move a pixel, and the
   * panel appears to unfurl upward out from behind it. The page therefore stays
   * pinned to its bottom, and collapsing runs the same path in reverse.
   *
   * Anchoring on the bar's own viewport position rather than on
   * `scrollHeight - innerHeight` matters: it is self-correcting (each frame
   * re-measures instead of accumulating drift), and it introduces no jump when
   * the click happened a little short of the absolute page bottom.
   *
   * ResizeObserver is the right primitive here because it runs after layout but
   * before paint, so the correction and the new height commit in the same frame
   * and there is nothing to see mid-animation. The previous implementation drove
   * this from a requestAnimationFrame loop on a fixed 700ms timer: it corrected a
   * frame *late* (the visible jitter), kept hijacking the scroll position for
   * 700ms whether the animation had finished or not, and could not be escaped.
   */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const holdAnchor = () => {
      const bar = barRef.current;
      if (!pinnedRef.current || !bar) return;
      const delta = bar.getBoundingClientRect().top - anchorTopRef.current;
      if (Math.abs(delta) < 0.5) return;
      // behavior:'instant' is required — an inherited smooth scroll-behavior
      // would start a fresh easing animation per correction and stutter badly.
      window.scrollBy({ top: delta, behavior: 'instant' });
    };

    const observer = new ResizeObserver(holdAnchor);
    observer.observe(panel);

    // Any deliberate scroll input hands control straight back to the user, so the
    // anchor can never fight someone who starts scrolling mid-animation.
    window.addEventListener('wheel', releasePin, { passive: true });
    window.addEventListener('touchmove', releasePin, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', releasePin);
      window.removeEventListener('touchmove', releasePin);
    };
  }, [releasePin]);

  const toggleCredits = () => {
    anchorTopRef.current = barRef.current?.getBoundingClientRect().top ?? 0;
    pinnedRef.current = true;
    setShowCredits((open) => !open);
  };

  // Mobile skips the footer's entrance animation — on a short viewport the footer
  // is already on screen when the page settles, so it reads as a stutter.
  const entrance = (delay: number) =>
    isMobile || prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.8, delay, ease: EASE_SOFT },
        };

  const pill =
    'px-3 py-1.5 bg-slate/40 rounded-lg text-xs text-ash hover:text-cyan ' +
    'border border-zinc/15 hover:border-cyan/30 transition-colors duration-300';

  return (
    // overflow-anchor:none stops the browser's own scroll anchoring from also
    // compensating for the panel resize and fighting the anchor above.
    <footer className="relative z-10 border-t border-zinc/10" style={{ overflowAnchor: 'none' }}>
      {/* Credits panel — deliberately rendered before the bar so it opens upward. */}
      <motion.div
        ref={panelRef}
        id={PANEL_ID}
        // initial={false}: a freshly loaded page should render closed, not animate
        // a collapse on mount.
        initial={false}
        animate={{ height: showCredits ? 'auto' : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: EASE_SOFT }}
        onAnimationComplete={releasePin}
        className="overflow-hidden"
        aria-hidden={!showCredits}
        inert={!showCredits}
      >
        <div className="px-6 pt-10 pb-2">
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
      </motion.div>

      {/* Footer bar — held still while the panel above it opens and closes. */}
      <div ref={barRef} className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
          {/* Stacks below sm: the two lines plus the divider do not fit on one
              row at 390px, and the flex row used to wrap both of them mid-phrase
              around a stranded separator. */}
          <motion.div
            {...entrance(0.3)}
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3"
          >
            <p className="font-mono text-xs text-ash whitespace-nowrap">
              Designed &amp; Built by Arnav Dashaputra
            </p>
            <span aria-hidden="true" className="hidden sm:inline text-zinc/50">
              |
            </span>
            <p className="font-mono text-xs text-ash whitespace-nowrap">2019 - {currentYear}</p>
          </motion.div>

          <motion.button
            {...entrance(0.55)}
            type="button"
            onClick={toggleCredits}
            aria-expanded={showCredits}
            aria-controls={PANEL_ID}
            className="font-mono text-xs text-ash hover:text-cyan transition-colors cursor-pointer
                       rounded focus-visible:outline-2 focus-visible:outline-offset-4
                       focus-visible:outline-cyan/70"
          >
            {showCredits ? 'Hide Credits' : 'Credits & Attributions'}
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
