import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showCredits, setShowCredits] = useState(false);
  const rafRef = useRef<number>(0);

  // Continuously scroll to bottom while credits are animating open
  useEffect(() => {
    if (!showCredits) return;

    const scrollToBottom = () => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      rafRef.current = requestAnimationFrame(scrollToBottom);
    };

    rafRef.current = requestAnimationFrame(scrollToBottom);

    // Stop after animation settles (500ms matches transition duration)
    const timeout = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
    }, 550);

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
    { name: 'Particle Animation', url: 'https://github.com/wingo206', note: 'Original by wingo206' },
    { name: 'Clash Display', url: 'https://www.fontshare.com/fonts/clash-display', note: 'Display font' },
    { name: 'Satoshi', url: 'https://www.fontshare.com/fonts/satoshi', note: 'Body font' },
    { name: 'JetBrains Mono', url: 'https://fonts.google.com/specimen/JetBrains+Mono', note: 'Monospace font' },
  ];

  return (
    <footer className="relative z-10 border-t border-zinc/10">
      {/* Top bar with toggle */}
      <div className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <p className="font-mono text-xs text-ash">
              Designed & Built by Arnav Dashaputra
            </p>
            <span className="text-zinc/50">|</span>
            <p className="font-mono text-xs text-ash">
              2019 - {currentYear}
            </p>
          </div>

          <button
            onClick={handleToggle}
            className="font-mono text-xs text-ash hover:text-cyan transition-colors cursor-pointer"
          >
            {showCredits ? 'Hide Credits' : 'Credits & Attributions'}
          </button>
        </div>
      </div>

      {/* Credits expand downward below the button */}
      <AnimatePresence>
        {showCredits && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-10 pt-2 border-t border-zinc/10">
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
                      title={credit.note}
                    >
                      {credit.name}
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
