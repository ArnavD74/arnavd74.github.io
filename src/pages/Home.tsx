import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Header, Footer } from '../components/layout';
import { Hero, About, Experience, Testimonials, Contact } from '../components/sections';
import WaveBackground from '../components/visualization/WaveBackground';

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const noiseY = useTransform(scrollY, (v) => v * -0.15);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'experience', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-obsidian">
      {/* Scroll progress */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      {/* Noise texture with scroll parallax — behind main (z-10), blocked by hero's bg-obsidian */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 360 360' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundPositionY: noiseY,
        }}
      />

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
