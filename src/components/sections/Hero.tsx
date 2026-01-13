import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ParticleNetwork from '../visualization/ParticleNetwork';

const HINT_STORAGE_KEY = 'hero-click-hint-shown';

const Hero: React.FC = () => {
  const [showHint, setShowHint] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if hint was already shown
    if (localStorage.getItem(HINT_STORAGE_KEY)) {
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    let timeInView = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // Start counting time in view
          intervalId = setInterval(() => {
            timeInView += 100;
            if (timeInView >= 3000 && !showHint) {
              setShowHint(true);
              if (intervalId) clearInterval(intervalId);
            }
          }, 100);
        } else {
          // Left view, reset timer
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

  // Listen for clicks to dismiss hint and save to storage
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
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Particle network visualization */}
      <ParticleNetwork />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-obsidian to-transparent pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        {/* Geometric accent - top */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-px bg-cyan mx-auto mb-8 origin-center"
        />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none mb-6 text-white"
        >
          Arnav Dashaputra
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-xl md:text-2xl text-silver tracking-wide"
        >
          Data Scientist & Full-Stack Engineer
        </motion.p>

        {/* Geometric accent - bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-px bg-zinc mx-auto mt-8 origin-center"
        />
      </div>

      {/* Corner accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute top-8 left-8 w-16 h-16 border-l border-t border-zinc/30"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute top-8 right-8 w-16 h-16 border-r border-t border-zinc/30"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-zinc/30 z-20"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-zinc/30 z-20"
      />

      {/* Click hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute right-24 lg:right-40 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex items-center gap-5 text-white"
          >
            <span className="text-base tracking-widest uppercase font-light">try clicking</span>
            <svg
              width="36"
              height="36"
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
