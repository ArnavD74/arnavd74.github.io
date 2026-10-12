import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import ParticleNetwork from '../visualization/ParticleNetwork';
import { EASE_OUT_EXPO } from '../../lib/motion';

const HINT_STORAGE_KEY = 'hero-click-hint-shown';
/** Continuous dwell time on the hero before the "try clicking" nudge appears. */
const HINT_DELAY_MS = 3000;
/** scrollY at which the subtitle/accent parallax has fully faded. */
const FADE_DISTANCE = 350;

/** localStorage throws in some privacy modes; the hint is not worth a crash. */
const readFlag = (key: string) => {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
};
const writeFlag = (key: string) => {
  try {
    localStorage.setItem(key, 'true');
  } catch {
    /* non-fatal */
  }
};

const Hero: React.FC = () => {
  const [showHint, setShowHint] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven parallax
  const { scrollY } = useScroll();
  const nameY = useTransform(scrollY, [0, 600], [0, 120]);
  const nameOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const subtitleOpacity = useTransform(scrollY, [0, FADE_DISTANCE], [1, 0]);
  const accentScale = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Refs for elements that use CSS @keyframes (motion.div wrappers kill these)
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleWrapRef = useRef<HTMLDivElement>(null);

  // 'hidden' = inline transforms keep elements invisible before animation starts
  // 'animate' = CSS animation classes applied via className (fill-mode:both holds initial state during delay)
  // 'visible' = no animation, no inline transform — elements show instantly (refreshed-while-scrolled)
  const [animState, setAnimState] = useState<'hidden' | 'animate' | 'visible'>('hidden');

  // Apply entrance animations via rAF — StrictMode-safe (cleanup cancels first rAF,
  // only the second fires). Skip animation only if hero is entirely off-screen
  // (scrolled past one full viewport height). Matches Framer Motion's name animation
  // which always plays initial→animate regardless of scroll position.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setAnimState(window.scrollY <= window.innerHeight ? 'animate' : 'visible');
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll-driven opacity/parallax via plain scroll listener.
  // Avoids Framer Motion's useTransform initialization race where derived MotionValues
  // emit incorrect values (opacity=0 at scrollY=0) before stabilizing.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sy = window.scrollY;
      const opacity = String(Math.max(0, 1 - Math.min(sy, FADE_DISTANCE) / FADE_DISTANCE));
      const translateY = `translateY(${sy * 0.1}px)`;
      if (lineRef.current) lineRef.current.style.opacity = opacity;
      if (subtitleWrapRef.current) {
        subtitleWrapRef.current.style.opacity = opacity;
        subtitleWrapRef.current.style.transform = translateY;
      }
    };
    update(); // Set correct initial values immediately
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  // Nudge first-time visitors that the particle field is interactive, once they
  // have dwelled on the hero for a while.
  useEffect(() => {
    if (readFlag(HINT_STORAGE_KEY)) return;
    const section = sectionRef.current;
    if (!section) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let fired = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const dwelling = entry.isIntersecting && entry.intersectionRatio > 0.5;
        if (dwelling && !fired && timer === undefined) {
          // One timer, instead of the old 100ms polling interval that kept
          // ticking forever once the hint had been shown.
          timer = setTimeout(() => {
            fired = true;
            timer = undefined;
            setShowHint(true);
          }, HINT_DELAY_MS);
        } else if (!dwelling && timer !== undefined) {
          clearTimeout(timer);
          timer = undefined;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (timer !== undefined) clearTimeout(timer);
    };
  }, []);

  // Drop the canvas entirely once the hero is well out of view, so a long scroll
  // down the page is not paying for an offscreen particle simulation.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => setShowParticles(entry.isIntersecting), {
      threshold: 0,
      rootMargin: '0px 0px -200px 0px',
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showHint) return;

    const dismiss = () => {
      setShowHint(false);
      writeFlag(HINT_STORAGE_KEY);
    };

    window.addEventListener('click', dismiss);
    return () => window.removeEventListener('click', dismiss);
  }, [showHint]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-dvh flex items-center overflow-hidden bg-obsidian"
    >
      {/* Subtle grid */}
      <div aria-hidden="true" className="absolute inset-0 grid-bg opacity-50" />

      {/* Particle network */}
      {showParticles && <ParticleNetwork />}

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent pointer-events-none z-10"
      />

      {/* Content with scroll parallax */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pointer-events-none -mt-20 md:mt-0">
        <div className="flex flex-col gap-6">
          {/* Accent line — uses CSS classes (not inline style) so React never clears
               the imperatively-set opacity from the scroll listener */}
          <div
            ref={lineRef}
            aria-hidden="true"
            className={`w-12 h-px bg-cyan origin-left${
              animState === 'hidden'
                ? ' hero-line-hidden'
                : animState === 'animate'
                  ? ' hero-line-anim'
                  : ''
            }`}
          />

          {/* Name — oversized, with scroll parallax.
               One <h1> holding both lines: the page previously shipped two separate
               <h1>s, which reads as two competing top-level headings and splits the
               name in an outline. The reveal now animates spans inside it instead. */}
          <motion.div style={{ y: nameY, opacity: nameOpacity }}>
            <h1 className="font-display font-bold text-[clamp(3.5rem,11vw,10rem)] leading-[0.88] tracking-tighter text-white">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: EASE_OUT_EXPO }}
                >
                  Arnav
                </motion.span>
              </span>
              <span className="block overflow-hidden mt-1">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.55, ease: EASE_OUT_EXPO }}
                >
                  Dashaputra
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* Subtitle — uses CSS classes (not inline style) for same reason as line */}
          <div ref={subtitleWrapRef} className="mt-4 overflow-hidden">
            <p
              className={`font-body text-lg md:text-xl text-silver/90 leading-relaxed${
                animState === 'hidden'
                  ? ' hero-subtitle-hidden'
                  : animState === 'animate'
                    ? ' hero-subtitle-anim'
                    : ''
              }`}
            >
              Data Scientist &amp; Full-Stack Engineer
            </p>
          </div>
        </div>
      </div>

      {/* Scroll CTA - pinned to bottom of viewport */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        style={{ opacity: subtitleOpacity }}
        className="absolute bottom-16 md:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
      >
        <ScrollLink
          to="about"
          spy={true}
          smooth={true}
          offset={-80}
          duration={800}
          href="#about"
          aria-label="Scroll to About"
          className="flex flex-col items-center gap-2 cursor-pointer group rounded
                     focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan/70"
        >
          <motion.span
            aria-hidden="true"
            className="block"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              className="w-5 h-5 text-ash group-hover:text-cyan transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.span>
        </ScrollLink>
      </motion.div>

      {/* Corner accents with scroll */}
      {[
        { pos: 'top-8 left-8 border-l border-t origin-top-left', delay: 1 },
        { pos: 'top-8 right-8 border-r border-t origin-top-right', delay: 1.05 },
        { pos: 'bottom-8 left-8 border-l border-b z-20 origin-bottom-left', delay: 1.1 },
        { pos: 'bottom-8 right-8 border-r border-b z-20 origin-bottom-right', delay: 1.15 },
      ].map((accent) => (
        <motion.div
          key={accent.pos}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: accent.delay }}
          style={{ scale: accentScale }}
          className={`absolute w-20 h-20 border-zinc/15 ${accent.pos}`}
        />
      ))}

      {/* Click hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute z-30 pointer-events-none flex items-center gap-3
                       left-6 top-[70%] text-frost/30
                       md:left-[68%] md:top-[56%] md:text-frost/50 md:gap-5"
          >
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-light">
              try clicking
            </span>
            <svg
              aria-hidden="true"
              className="w-5 h-5 md:w-7 md:h-7 text-cyan/30 md:text-cyan/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
