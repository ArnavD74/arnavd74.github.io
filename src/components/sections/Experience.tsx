import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { experiences } from '../../data/experience';
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

const Experience: React.FC = () => {
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
    <section ref={sectionRef} id="experience" className="py-32 md:py-44 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-20 md:mb-28"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-cyan tracking-widest">02</span>
            <div className="w-12 h-px bg-cyan" />
            <span className="font-mono text-xs text-ash tracking-widest uppercase">Experience</span>
          </div>
          <h2 className="section-title text-white">
            Career
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2">
            <div className="w-px h-full bg-gradient-to-b from-cyan/30 via-zinc/30 to-transparent" />
          </div>

          <div className="space-y-12 md:space-y-16">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={exp.id}
                  variants={blurUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={mobileViewport ?? { once: true, margin: '-60px' }}
                  custom={0.05}
                  className={`relative flex items-start ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-7 z-10">
                    <div className="relative flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        index === 0
                          ? 'bg-cyan border-cyan'
                          : 'bg-obsidian border-zinc/60'
                      }`} />
                      {index === 0 && (
                        <div className="absolute w-6 h-6 rounded-full bg-cyan/20 animate-ping" />
                      )}
                    </div>
                  </div>

                  {/* Mobile spacer */}
                  <div className="w-12 shrink-0 md:hidden" />

                  {/* Card */}
                  <div className={`flex-1 md:w-[calc(50%-3rem)] ${
                    isLeft ? 'md:pr-14' : 'md:pl-14'
                  }`}>
                    <div className="group timeline-card relative">
                      {/* Period badge */}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1.5 bg-slate/80 border border-zinc/25 rounded-lg
                                         font-mono text-[11px] text-cyan tracking-wide">
                          {exp.period}
                        </span>
                      </div>

                      {/* Company & title */}
                      <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-cyan transition-colors duration-500">
                        {exp.company}
                      </h3>
                      {exp.title && (
                        <p className="font-body font-medium text-frost/80 mt-1 mb-1">
                          {exp.title}
                        </p>
                      )}
                      <p className="font-mono text-[11px] text-ash mb-5 flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {exp.location}
                      </p>

                      {/* Tagline - prominent summary */}
                      {exp.tagline && (
                        <p className="text-frost/90 text-sm leading-relaxed mb-4">
                          {exp.tagline}
                        </p>
                      )}

                      {/* Bullet points */}
                      {exp.points.length > 0 && (
                        <ul className="space-y-2.5 mb-5">
                          {exp.points.map((point, i) => (
                            <li key={i} className="flex gap-3 text-silver text-sm leading-relaxed">
                              <span className="text-cyan/40 mt-[7px] shrink-0">
                                <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 6 6">
                                  <circle cx="3" cy="3" r="3" />
                                </svg>
                              </span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Sub-sections (e.g. multiple roles at same company) */}
                      {exp.subSections && exp.subSections.length > 0 && (
                        <div className="space-y-5">
                          {exp.subSections.map((sub, si) => (
                            <div key={si} className={si > 0 ? 'pt-4 border-t border-zinc/15' : ''}>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                                <span className="font-body font-medium text-frost/90 text-sm">
                                  {sub.title}
                                </span>
                                {sub.period && (
                                  <span className="font-mono text-[10px] text-ash">
                                    {sub.period}
                                  </span>
                                )}
                              </div>
                              {sub.tagline && (
                                <p className="text-frost/90 text-sm leading-relaxed mb-3">
                                  {sub.tagline}
                                </p>
                              )}
                              {sub.points.length > 0 && (
                                <ul className="space-y-2">
                                  {sub.points.map((point, pi) => (
                                    <li key={pi} className="flex gap-3 text-silver text-sm leading-relaxed">
                                      <span className="text-cyan/40 mt-[7px] shrink-0">
                                        <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 6 6">
                                          <circle cx="3" cy="3" r="3" />
                                        </svg>
                                      </span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Technology badges */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className={`flex flex-wrap gap-1.5 ${
                          (exp.points.length > 0 || (exp.subSections && exp.subSections.length > 0)) ? 'mt-5 pt-5 border-t border-zinc/15' : ''
                        }`}>
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 bg-slate/60 rounded-lg font-mono text-[10px] text-silver border border-zinc/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Hover accent */}
                      <div className={`absolute top-0 ${isLeft ? 'right-0' : 'left-0'} w-0 group-hover:w-12 h-px bg-cyan/30 transition-all duration-700`} />
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block flex-1 md:w-[calc(50%-3rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
