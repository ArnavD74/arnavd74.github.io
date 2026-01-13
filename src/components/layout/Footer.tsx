import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showCredits, setShowCredits] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

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

  const handleToggleCredits = () => {
    setShowCredits(!showCredits);
  };

  useEffect(() => {
    if (showCredits) {
      const timer = setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [showCredits]);

  return (
    <motion.footer
      ref={footerRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative z-10 py-10 border-t border-zinc/20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          <AnimatePresence>
            {showCredits && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden w-full max-w-2xl"
              >
                <div className="pb-6 border-b border-zinc/20 mb-6">
                  <p className="font-mono text-xs text-silver text-center mb-4">
                    Built with:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {credits.map((credit) => (
                      <a
                        key={credit.name}
                        href={credit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-slate/50 rounded text-xs text-ash hover:text-cyan
                                   border border-zinc/20 hover:border-cyan/30 transition-all"
                        title={credit.note}
                      >
                        {credit.name}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleToggleCredits}
            className="font-mono text-xs text-ash hover:text-cyan transition-colors"
          >
            {showCredits ? 'Hide Credits' : 'Credits & Attributions'}
          </button>

          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center">
            <p className="font-mono text-xs text-ash">
              Designed & Built by Arnav Dashaputra
            </p>
            <span className="hidden md:inline text-zinc">|</span>
            <p className="font-mono text-xs text-ash">
              2019 - {currentYear}
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
