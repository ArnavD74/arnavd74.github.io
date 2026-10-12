import { useRef } from 'react';
import { riseIn } from '../../lib/motion';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

interface Testimonial {
  name: string;
  title: string;
  image: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Paras Parekh',
    title: 'Cofounder, Chief Technology and AI Officer',
    image: '/images/testimonial-paras.jpg',
    quote:
      'I had the pleasure of working with Arnav in a fast-paced AI and digital healthcare startup, where he quickly proved himself to be a rare talent. He brings exceptional technical range, sharp instincts, and the ability to deliver fast without ever sacrificing quality.\n\nWhat sets Arnav apart is his versatility, whether it\'s infrastructure, frontend, backend, or systems integration, he jumps in, learns quickly, and gets things done. He thrives on complex challenges and consistently brings thoughtful, scalable solutions.\n\nFocused, collaborative, and committed, Arnav is the kind of developer every team wants when building something that matters. Any company would be fortunate to have him.',
  },
  {
    name: 'Marisa Narula',
    title: 'Educational Support Professional',
    image: '/images/testimonial-marisa.jpg',
    quote:
      'Arnav is not only a wonderful team member, but also a hard-working and dedicated employee. He is a master at multitasking, and he has a gift for prioritization and problem-solving.\n\nHis passion for solving intricate issues also makes him a great asset to the team. He\'s been a huge help to me and my business, and I can only imagine the contributions he will make to future teams.\n\nI\'m fortunate to have worked with him for several years, and I wish him nothing but good luck in the future.',
  },
];

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="testimonials" className="py-28 md:py-44 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader index="03" label="Testimonials" title="Kind Words" sectionRef={sectionRef} />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((t, index) => (
            <Reveal
              as="figure"
              key={t.name}
              variants={riseIn}
              delay={0.4 + index * 0.15}
              margin="100px 0px"
              className="group relative bento-card p-8 md:p-10 flex flex-col h-full"
            >
              {/* Quote mark */}
              <svg
                aria-hidden="true"
                className="w-10 h-10 text-cyan/15 mb-6 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.3 2.5c-2 1-3.5 2.2-4.6 3.7C5.6 7.7 5 9.5 5 11.5c0 .4.1.7.2 1 .6-.5 1.3-.7 2.2-.7 1 0 1.8.3 2.5 1 .7.7 1 1.5 1 2.5s-.4 1.9-1.1 2.6c-.7.7-1.6 1.1-2.6 1.1-1.2 0-2.2-.5-3-1.4-.7-.9-1.1-2.1-1.1-3.5 0-2.5.8-4.8 2.3-6.8 1.5-2 3.5-3.5 5.9-4.4l.1.6zm10 0c-2 1-3.5 2.2-4.6 3.7-1.1 1.5-1.7 3.3-1.7 5.3 0 .4.1.7.2 1 .6-.5 1.3-.7 2.2-.7 1 0 1.8.3 2.5 1 .7.7 1 1.5 1 2.5s-.4 1.9-1.1 2.6c-.7.7-1.6 1.1-2.6 1.1-1.2 0-2.2-.5-3-1.4-.7-.9-1.1-2.1-1.1-3.5 0-2.5.8-4.8 2.3-6.8 1.5-2 3.5-3.5 5.9-4.4l.1.6z" />
              </svg>

              <blockquote className="text-silver text-sm md:text-[15px] leading-relaxed mb-8 flex-1 whitespace-pre-line">
                {t.quote}
              </blockquote>

              <figcaption className="flex items-center gap-4 pt-6 border-t border-zinc/15">
                <img
                  src={t.image}
                  alt={t.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc/20 group-hover:ring-cyan/30 transition-[box-shadow] duration-500"
                />
                <div className="min-w-0">
                  <p className="font-body font-semibold text-sm text-frost group-hover:text-white transition-colors">
                    {t.name}
                  </p>
                  <p className="font-mono text-[10px] text-ash truncate" title={t.title}>
                    {t.title}
                  </p>
                </div>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
