import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Header, Footer } from '../components/layout';
import { Hero, About, Experience, Testimonials, Contact } from '../components/sections';
import WaveBackground from '../components/visualization/WaveBackground';

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
    <div className="relative min-h-screen bg-obsidian noise-bg">
      {/* Scroll progress */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

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
