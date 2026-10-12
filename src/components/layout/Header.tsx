import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { EASE_OUT_EXPO } from '../../lib/motion';

interface HeaderProps {
  activeSection?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: '00', name: 'Home' },
  { id: 'about', label: '01', name: 'About' },
  { id: 'experience', label: '02', name: 'Experience' },
  { id: 'testimonials', label: '03', name: 'Testimonials' },
  { id: 'contact', label: '04', name: 'Contact' },
];

/** Entrance state resolved once, after the browser has restored scroll position. */
type Entrance = { ready: false } | { ready: true; animate: boolean };

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [entrance, setEntrance] = useState<Entrance>({ ready: false });

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 50);
    };

    // Deferred a frame so the browser has finished restoring the scroll position
    // on a reload: a page restored mid-scroll should not replay the entrance.
    const initial = requestAnimationFrame(() => {
      setEntrance({ ready: true, animate: window.scrollY < 100 });
      measure();
    });

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(initial);
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Held back one frame so the entrance animation is never played from the wrong
  // starting state. `aria-hidden` on a nav that exists for one frame is noise, so
  // rendering nothing is the right call here.
  if (!entrance.ready) return null;

  const { animate } = entrance;

  const linkClass = (id: string) =>
    `relative font-mono text-sm cursor-pointer transition-colors rounded
     focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan/70 ${
       isScrolled
         ? activeSection === id
           ? 'text-white'
           : 'text-silver hover:text-white'
         : activeSection === id
           ? 'text-frost'
           : 'text-ash hover:text-frost'
     }`;

  const renderNav = (variant: 'desktop' | 'mobile') => {
    const isDesktop = variant === 'desktop';
    const offset = isDesktop ? 20 : 10;
    const stagger = isDesktop ? 0.1 : 0.05;

    return NAV_ITEMS.map((item, index) => (
      <motion.div
        key={item.id}
        initial={animate ? { opacity: 0, y: -offset } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={
          animate
            ? { delay: 1.3 + stagger * index, duration: isDesktop ? 0.5 : 0.4 }
            : { duration: 0 }
        }
      >
        <ScrollLink
          to={item.id}
          spy={true}
          smooth={true}
          offset={-80}
          duration={800}
          href={`#${item.id}`}
          // The visible label is just a number, so the section name has to be
          // supplied for screen readers and for the browser's link preview.
          aria-label={item.name}
          aria-current={activeSection === item.id ? 'true' : undefined}
          title={item.name}
          className={`${linkClass(item.id)} ${isDesktop ? 'tracking-wide' : ''}`}
        >
          {item.label}
          {activeSection === item.id && (
            <motion.span
              layoutId={isDesktop ? 'activeSection' : 'activeSectionMobile'}
              className="absolute -bottom-1 left-0 right-0 h-px bg-cyan"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </ScrollLink>
      </motion.div>
    ));
  };

  return (
    <motion.header
      initial={animate ? { y: -100 } : false}
      animate={{ y: 0 }}
      transition={animate ? { duration: 0.6, delay: 0.95, ease: EASE_OUT_EXPO } : { duration: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,box-shadow]
                  duration-300 ${isScrolled ? 'py-3 liquid-glass' : 'py-5 bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
        <nav aria-label="Sections" className="hidden md:flex items-center gap-10">
          {renderNav('desktop')}
        </nav>
        <nav aria-label="Sections" className="flex md:hidden items-center gap-6">
          {renderNav('mobile')}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
