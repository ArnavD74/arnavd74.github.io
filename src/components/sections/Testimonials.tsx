import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const blurUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface Testimonial {
  name: string;
  title: string;
  image: string;
  relationship: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Paras Parekh',
    title: 'Cofounder, Chief Technology and AI Officer',
    image: '/images/testimonial-paras.jpg',
    relationship: 'Managed Arnav directly',
    quote:
      'I had the pleasure of working with Arnav in a fast-paced AI and digital healthcare startup, where he quickly proved himself to be a rare talent. He brings exceptional technical range, sharp instincts, and the ability to deliver fast without ever sacrificing quality.\n\nWhat sets Arnav apart is his versatility, whether it\'s infrastructure, frontend, backend, or systems integration, he jumps in, learns quickly, and gets things done. He thrives on complex challenges and consistently brings thoughtful, scalable solutions.\n\nFocused, collaborative, and committed, Arnav is the kind of developer every team wants when building something that matters. Any company would be fortunate to have him.',
  },
  {
    name: 'Marisa Narula',
    title: 'Educational Support Professional',
    image: '/images/testimonial-marisa.jpg',
    relationship: 'Managed Arnav directly',
    quote:
      'Arnav is not only a wonderful team member, but also a hard-working and dedicated employee. He is a master at multitasking, and he has a gift for prioritization and problem-solving.\n\nHis passion for solving intricate issues also makes him a great asset to the team. He\'s been a huge help to me and my business, and I can only imagine the contributions he will make to future teams.\n\nI\'m fortunate to have worked with him for several years, and I wish him nothing but good luck in the future.',
  },
];

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  const mobileViewport = isMobile
    ? { once: true, margin: '2000px' as const }
    : undefined;

  return (
    <section ref={sectionRef} id="testimonials" className="pt-32 pb-20 md:py-44 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-20 md:mb-28"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-cyan tracking-widest">03</span>
            <div className="w-12 h-px bg-cyan" />
            <span className="font-mono text-xs text-ash tracking-widest uppercase">Testimonials</span>
          </div>
          <h2 className="section-title text-white">
            Kind Words
          </h2>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              variants={blurUp}
              initial="hidden"
              whileInView="visible"
              viewport={mobileViewport ?? { once: true, margin: '-60px' }}
              custom={index * 0.12}
              className="group relative bento-card p-8 md:p-10 flex flex-col"
            >
              {/* Quote mark */}
              <svg
                className="w-10 h-10 text-cyan/15 mb-6 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.3 2.5c-2 1-3.5 2.2-4.6 3.7C5.6 7.7 5 9.5 5 11.5c0 .4.1.7.2 1 .6-.5 1.3-.7 2.2-.7 1 0 1.8.3 2.5 1 .7.7 1 1.5 1 2.5s-.4 1.9-1.1 2.6c-.7.7-1.6 1.1-2.6 1.1-1.2 0-2.2-.5-3-1.4-.7-.9-1.1-2.1-1.1-3.5 0-2.5.8-4.8 2.3-6.8 1.5-2 3.5-3.5 5.9-4.4l.1.6zm10 0c-2 1-3.5 2.2-4.6 3.7-1.1 1.5-1.7 3.3-1.7 5.3 0 .4.1.7.2 1 .6-.5 1.3-.7 2.2-.7 1 0 1.8.3 2.5 1 .7.7 1 1.5 1 2.5s-.4 1.9-1.1 2.6c-.7.7-1.6 1.1-2.6 1.1-1.2 0-2.2-.5-3-1.4-.7-.9-1.1-2.1-1.1-3.5 0-2.5.8-4.8 2.3-6.8 1.5-2 3.5-3.5 5.9-4.4l.1.6z" />
              </svg>

              {/* Quote text */}
              <blockquote className="text-silver text-sm md:text-[15px] leading-relaxed mb-8 flex-1 whitespace-pre-line">
                {t.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-zinc/15">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc/20 group-hover:ring-cyan/30 transition-all duration-500"
                />
                <div className="min-w-0">
                  <p className="font-body font-semibold text-sm text-frost group-hover:text-white transition-colors">
                    {t.name}
                  </p>
                  <p className="font-mono text-[10px] text-ash truncate">
                    {t.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
