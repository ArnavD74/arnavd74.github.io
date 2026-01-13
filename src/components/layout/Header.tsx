import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';

interface HeaderProps {
  activeSection?: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'home', label: '00' },
    { id: 'about', label: '01' },
    { id: 'projects', label: '02' },
    { id: 'experience', label: '03' },
    { id: 'contact', label: '04' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-slate/95 backdrop-blur-xl'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
          {/* Desktop nav - centered */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <ScrollLink
                  to={item.id}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={800}
                  className={`relative font-mono text-sm tracking-wide cursor-pointer transition-colors ${
                    isScrolled
                      ? (activeSection === item.id ? 'text-white' : 'text-silver hover:text-white')
                      : (activeSection === item.id ? 'text-frost' : 'text-ash hover:text-frost')
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-cyan"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </ScrollLink>
              </motion.div>
            ))}
          </nav>

          {/* Mobile nav - inline numbered links */}
          <nav className="flex md:hidden items-center gap-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
              >
                <ScrollLink
                  to={item.id}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={800}
                  className={`relative font-mono text-sm cursor-pointer transition-colors ${
                    isScrolled
                      ? (activeSection === item.id ? 'text-white' : 'text-silver hover:text-white')
                      : (activeSection === item.id ? 'text-frost' : 'text-ash hover:text-frost')
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="activeSectionMobile"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-cyan"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </ScrollLink>
              </motion.div>
            ))}
          </nav>
        </div>
      </motion.header>

    </>
  );
};

export default Header;
