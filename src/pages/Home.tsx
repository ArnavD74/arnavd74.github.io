import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Header, Footer } from '../components/layout';
import { Hero, About, Experience, Testimonials, Contact } from '../components/sections';
import WaveBackground from '../components/visualization/WaveBackground';

const SECTION_IDS = ['home', 'about', 'experience', 'testimonials', 'contact'] as const;

/** Repeat period of the noise tile, in px. */
const NOISE_TILE = 360;

const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 360 360' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax the noise by transform, wrapped to the tile period. The old version
  // animated backgroundPositionY, which repaints the whole viewport every frame
  // and cannot be composited; a transform on a tile-aligned offset is visually
  // identical and runs on the compositor.
  const noiseY = useTransform(scrollY, (v) => -((v * 0.15) % NOISE_TILE));

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      // A third of the way down the viewport is "what the reader is looking at".
      const probe = window.innerHeight / 3;

      for (const id of SECTION_IDS) {
        const element = document.getElementById(id);
        if (!element) continue;
        const { top, bottom } = element.getBoundingClientRect();
        if (probe >= top && probe < bottom) {
          setActiveSection(id);
          return;
        }
      }
    };

    // Coalesce to one measurement per frame; scroll fires far more often than
    // that, and each pass reads layout for five sections.
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-obsidian">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]
                   focus:px-4 focus:py-2 focus:rounded-lg focus:bg-slate focus:text-ice
                   focus:outline-2 focus:outline-cyan focus:font-mono focus:text-xs"
      >
        Skip to content
      </a>

      {/* Scroll progress */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      {/* Noise texture with scroll parallax — behind main (z-10), blocked by hero's bg-obsidian */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{
            // Extra height absorbs the wrapped parallax travel so the tiled
            // texture never runs out at the bottom edge.
            height: `calc(100% + ${NOISE_TILE}px)`,
            opacity: 0.035,
            backgroundImage: NOISE_URL,
            backgroundSize: `${NOISE_TILE}px ${NOISE_TILE}px`,
            backgroundRepeat: 'repeat',
            // The transform is set per frame from JS, which Chrome does not
            // auto-promote the way it does a CSS animation. Without the hint
            // every scroll frame repaints this full-viewport tiled texture.
            willChange: 'transform',
            y: noiseY,
          }}
        />
      </div>

      <WaveBackground />
      <Header activeSection={activeSection} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
