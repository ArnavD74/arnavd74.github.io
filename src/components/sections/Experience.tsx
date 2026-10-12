import { motion } from 'framer-motion';
import { useRef } from 'react';
import { experiences } from '../../data/experience';
import { blurUp } from '../../lib/motion';
import ScrollReveal from '../ui/ScrollReveal';
import SectionHeader from '../ui/SectionHeader';

const Bullet = () => (
  <span aria-hidden="true" className="text-cyan/40 mt-[7px] shrink-0">
    <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 6 6">
      <circle cx="3" cy="3" r="3" />
    </svg>
  </span>
);

const PointList: React.FC<{ points: string[]; className?: string }> = ({ points, className }) => (
  <ul className={className}>
    {points.map((point) => (
      <li key={point} className="flex gap-3 text-silver text-sm leading-relaxed">
        <Bullet />
        <span>{point}</span>
      </li>
    ))}
  </ul>
);

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="experience" className="py-28 md:py-44 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader index="02" label="Experience" title="Career" sectionRef={sectionRef} />

        {/* Timeline */}
        <div className="relative">
          {/* Spine: centred on desktop, left rail on mobile */}
          <div
            aria-hidden="true"
            className="absolute left-4 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2"
          >
            <div className="w-px h-full bg-gradient-to-b from-cyan/30 via-zinc/30 to-transparent" />
          </div>

          <ol className="space-y-12 md:space-y-16">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;
              const isPresent = exp.period.toLowerCase().includes('present');
              const hasBody = exp.points.length > 0 || (exp.subSections?.length ?? 0) > 0;
              const hasTech = (exp.technologies?.length ?? 0) > 0;

              return (
                <li key={exp.id}>
                  <ScrollReveal
                    className={`relative flex items-start ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline node */}
                    <div
                      aria-hidden="true"
                      className="absolute left-4 md:left-1/2 -translate-x-1/2 top-7 z-10"
                    >
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${
                          isPresent ? 'bg-cyan border-cyan' : 'bg-obsidian border-zinc/60'
                        }`}
                      />
                    </div>

                    {/* Mobile spacer, clearing the left rail */}
                    <div className="w-12 shrink-0 md:hidden" />

                    {/* Card */}
                    <motion.div
                      variants={blurUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-60px 0px' }}
                      custom={0.05}
                      className={`flex-1 md:w-[calc(50%-3rem)] ${isLeft ? 'md:pr-14' : 'md:pl-14'}`}
                    >
                      <div className="group timeline-card relative">
                        {/* Period badge */}
                        <div className="mb-4">
                          <span
                            className="inline-block px-3 py-1.5 bg-slate/80 border border-zinc/25 rounded-lg
                                       font-mono text-[11px] text-cyan tracking-wide"
                          >
                            {exp.period}
                          </span>
                        </div>

                        {/* Company & title */}
                        <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-cyan transition-colors duration-500">
                          {exp.company}
                        </h3>
                        {exp.title && (
                          <p className="font-body font-medium text-frost/80 mt-1 mb-1">{exp.title}</p>
                        )}
                        <p className="font-mono text-[11px] text-ash mb-5 flex items-center gap-1.5">
                          <svg
                            aria-hidden="true"
                            className="w-3 h-3 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {exp.location}
                        </p>

                        {/* Tagline — prominent summary */}
                        {exp.tagline && (
                          <p className="text-frost/90 text-sm leading-relaxed mb-4">{exp.tagline}</p>
                        )}

                        {exp.points.length > 0 && (
                          <PointList points={exp.points} className="space-y-2.5 mb-5" />
                        )}

                        {/* Sub-roles at the same organisation */}
                        {exp.subSections && exp.subSections.length > 0 && (
                          <div className="space-y-5">
                            {exp.subSections.map((sub, si) => (
                              <div
                                key={sub.title}
                                className={si > 0 ? 'pt-4 border-t border-zinc/15' : ''}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                                  <span className="font-body font-medium text-frost/90 text-sm">
                                    {sub.title}
                                  </span>
                                  {sub.period && (
                                    <span className="font-mono text-[10px] text-ash shrink-0">
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
                                  <PointList points={sub.points} className="space-y-2" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Technology badges */}
                        {hasTech && (
                          <div
                            className={`flex flex-wrap gap-1.5 ${
                              hasBody ? 'mt-5 pt-5 border-t border-zinc/15' : ''
                            }`}
                          >
                            {exp.technologies!.map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-1 bg-slate/60 rounded-lg font-mono text-[10px] text-silver border border-zinc/20"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Project links */}
                        {exp.links && exp.links.length > 0 && (
                          <div
                            className={`flex flex-wrap gap-2 ${
                              hasTech ? 'mt-4' : hasBody ? 'mt-5 pt-5 border-t border-zinc/15' : ''
                            }`}
                          >
                            {exp.links.map((link) => (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${link.label} — ${exp.company} (opens in a new tab)`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5
                                           bg-cyan/[0.06] border border-cyan/20 rounded-lg
                                           font-mono text-[11px] text-cyan/70 tracking-wide
                                           hover:bg-cyan/[0.12] hover:border-cyan/35 hover:text-cyan
                                           transition-colors duration-300"
                              >
                                <span>{link.label}</span>
                                <svg
                                  aria-hidden="true"
                                  className="w-3 h-3 shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Mirror column keeping the alternating layout balanced */}
                    <div aria-hidden="true" className="hidden md:block flex-1 md:w-[calc(50%-3rem)]" />
                  </ScrollReveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;
