import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import ParticleNetwork from '../visualization/ParticleNetwork';

const HINT_STORAGE_KEY = 'hero-click-hint-shown';

const Hero: React.FC = () => {
  const [showHint, setShowHint] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven parallax
  const { scrollY } = useScroll();
  const nameY = useTransform(scrollY, [0, 600], [0, 120]);
  const nameOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const subtitleY = useTransform(scrollY, [0, 600], [0, 60]);
  const subtitleOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const accentScale = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    if (localStorage.getItem(HINT_STORAGE_KEY)) return;

    const section = sectionRef.current;
    if (!section) return;

    let timeInView = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          intervalId = setInterval(() => {
            timeInView += 100;
            if (timeInView >= 3000 && !showHint) {
              setShowHint(true);
              if (intervalId) clearInterval(intervalId);
            }
          }, 100);
        } else {
          if (intervalId) clearInterval(intervalId);
          timeInView = 0;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, [showHint]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowParticles(entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px -200px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showHint) return;

    const handleClick = () => {
      setShowHint(false);
      localStorage.setItem(HINT_STORAGE_KEY, 'true');
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showHint]);

  return (
    <section ref={sectionRef} id="home" className="relative h-dvh flex items-center md:items-center overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Particle network */}
      {showParticles && <ParticleNetwork />}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent pointer-events-none z-10" />

      {/* Content with scroll parallax */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pointer-events-none -mt-20 md:mt-0">
        <div className="flex flex-col gap-6">
          {/* Accent line (no number) */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity: subtitleOpacity }}
            className="w-12 h-px bg-cyan origin-left"
          />

          {/* Name - oversized with scroll parallax */}
          <motion.div style={{ y: nameY, opacity: nameOpacity }}>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-[clamp(3.5rem,11vw,10rem)] leading-[0.88] tracking-tighter text-white"
              >
                Arnav
              </motion.h1>
            </div>
            <div className="overflow-hidden mt-1">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-[clamp(3.5rem,11vw,10rem)] leading-[0.88] tracking-tighter text-white"
              >
                Dashaputra
              </motion.h1>
            </div>
          </motion.div>

          {/* Subtitle only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: subtitleY, opacity: subtitleOpacity }}
            className="mt-4"
          >
            <p className="font-body text-lg md:text-xl text-silver/90 leading-relaxed">
              Data Scientist & Full-Stack Engineer
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scroll CTA - pinned to bottom of viewport */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        style={{ opacity: subtitleOpacity }}
        className="absolute bottom-16 md:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
      >
        <ScrollLink
          to="about"
          spy={true}
          smooth={true}
          offset={-80}
          duration={800}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className="w-5 h-5 text-ash group-hover:text-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </ScrollLink>
      </motion.div>

      {/* Corner accents with scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        style={{ scale: accentScale }}
        className="absolute top-8 left-8 w-20 h-20 border-l border-t border-zinc/15 origin-top-left"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.05 }}
        style={{ scale: accentScale }}
        className="absolute top-8 right-8 w-20 h-20 border-r border-t border-zinc/15 origin-top-right"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        style={{ scale: accentScale }}
        className="absolute bottom-8 left-8 w-20 h-20 border-l border-b border-zinc/15 z-20 origin-bottom-left"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.15 }}
        style={{ scale: accentScale }}
        className="absolute bottom-8 right-8 w-20 h-20 border-r border-b border-zinc/15 z-20 origin-bottom-right"
      />

      {/* Click hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.8 }}
            className="absolute right-12 lg:right-24 top-1/3 z-30 pointer-events-none hidden md:flex items-center gap-5 text-white"
          >
            <span className="text-sm tracking-[0.2em] uppercase font-light text-frost/50">try clicking</span>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-cyan/40"
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
