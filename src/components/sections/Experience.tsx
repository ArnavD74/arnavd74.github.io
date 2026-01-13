import { motion } from 'framer-motion';
import { experiences } from '../../data/experience';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-32 relative">
      {/* Subtle divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-zinc/30" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="font-mono text-xs text-cyan tracking-widest uppercase mb-4 block">
            03 / Experience
          </span>
          <h2 className="section-title text-white">
            Career
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 transform md:-translate-x-1/2">
            <div className="w-px h-full bg-zinc/40" />
          </div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`relative flex items-start ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline node */}
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-10">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-cyan" />
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan animate-ping opacity-30" />
                  </div>
                </div>

                {/* Spacer for mobile */}
                <div className="w-16 md:hidden" />

                {/* Content card */}
                <div className={`flex-1 md:w-[calc(50%-4rem)] ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'
                }`}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="group relative glass-card rounded-xl p-6 transition-all duration-300"
                  >
                    {/* Date badge */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-slate border border-zinc/40 rounded
                                       font-mono text-xs text-cyan tracking-wide">
                        {exp.period}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-white mb-1 group-hover:text-cyan transition-colors">
                      {exp.company}
                    </h3>

                    <p className="font-body font-medium text-frost mb-1">
                      {exp.title}
                    </p>

                    <p className="font-mono text-xs text-ash mb-5">
                      {exp.location}
                    </p>

                    {exp.points.length > 0 && (
                      <ul className="space-y-3">
                        {exp.points.map((point, i) => (
                          <li key={i} className="flex gap-3 text-silver text-sm leading-relaxed">
                            <span className="text-cyan mt-1 flex-shrink-0">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
                                <rect width="8" height="8" rx="1" />
                              </svg>
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Accent corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-transparent group-hover:border-cyan/30 transition-colors rounded-tr-xl" />
                  </motion.div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block flex-1 md:w-[calc(50%-4rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
