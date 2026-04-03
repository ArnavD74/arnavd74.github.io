import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showCredits, setShowCredits] = useState(false);
  const rafRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Continuously scroll to bottom while credits are animating open
  useEffect(() => {
    if (!showCredits) return;

    const scrollToBottom = () => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      rafRef.current = requestAnimationFrame(scrollToBottom);
    };

    rafRef.current = requestAnimationFrame(scrollToBottom);

    // Stop after animation settles (650ms matches transition duration)
    const timeout = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
    }, 700);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout);
    };
  }, [showCredits]);

  // When closing, snap to bottom after collapse
  const handleToggle = () => {
    if (showCredits) {
      // Closing - keep at bottom
      setShowCredits(false);
      requestAnimationFrame(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
    } else {
      setShowCredits(true);
    }
  };

  const credits = [
    { name: 'React 19', url: 'https://react.dev' },
    { name: 'TypeScript', url: 'https://www.typescriptlang.org' },
    { name: 'Vite', url: 'https://vitejs.dev' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
    { name: 'Framer Motion', url: 'https://www.framer.com/motion' },
    { name: 'React Router', url: 'https://reactrouter.com' },
    { name: 'React Scroll', url: 'https://www.npmjs.com/package/react-scroll' },
  ];

  const fonts = [
    { name: 'Clash Display', url: 'https://www.fontshare.com/fonts/clash-display', fontClass: 'font-display' },
    { name: 'Satoshi', url: 'https://www.fontshare.com/fonts/satoshi', fontClass: 'font-body' },
    { name: 'JetBrains Mono', url: 'https://fonts.google.com/specimen/JetBrains+Mono', fontClass: 'font-mono' },
  ];

  return (
    <footer className="relative z-10 border-t border-zinc/10">
      {/* Top bar with toggle */}
      <div className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={isMobile ? false : { opacity: 0, y: 16 }}
            whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
            viewport={isMobile ? undefined : { once: true }}
            transition={isMobile ? undefined : { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <p className="font-mono text-xs text-ash">
              Designed & Built by Arnav Dashaputra
            </p>
            <span className="text-zinc/50">|</span>
            <p className="font-mono text-xs text-ash">
              2019 - {currentYear}
            </p>
          </motion.div>

          <motion.button
            initial={isMobile ? false : { opacity: 0, y: 16 }}
            whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
            viewport={isMobile ? undefined : { once: true }}
            transition={isMobile ? undefined : { duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleToggle}
            className="font-mono text-xs text-ash hover:text-cyan transition-colors cursor-pointer"
          >
            {showCredits ? 'Hide Credits' : 'Credits & Attributions'}
          </motion.button>
        </div>
      </div>

      {/* Credits expand downward below the button */}
      <AnimatePresence>
        {showCredits && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-10 pt-2">
              <div className="max-w-2xl mx-auto">
                <p className="font-mono text-[10px] text-ash uppercase tracking-widest text-center mb-5">
                  Built with
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {credits.map((credit) => (
                    <a
                      key={credit.name}
                      href={credit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate/40 rounded-lg text-xs text-ash hover:text-cyan
                                 border border-zinc/15 hover:border-cyan/30 transition-all"
                      title={credit.name}
                    >
                      {credit.name}
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
                  <span className="font-display text-lg text-silver/50 mr-1 relative top-[1px]">Aa</span>
                  {fonts.map((font) => (
                    <a
                      key={font.name}
                      href={font.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1.5 bg-slate/40 rounded-lg text-xs text-ash hover:text-cyan
                                 border border-zinc/15 hover:border-cyan/30 transition-all ${font.fontClass}`}
                    >
                      {font.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
