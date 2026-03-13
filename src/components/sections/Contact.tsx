import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { contact } from '../../data/contact';
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

const Contact: React.FC = () => {
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

  const contactItems = [
    {
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      value: contact.github,
      href: `https://${contact.github}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      value: contact.linkedin,
      href: `https://${contact.linkedin}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-32 md:py-44 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Full-section grid: left has header + CTA, right has cards centered to the whole thing */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left column - header + CTA stacked */}
          <div>
            {/* Section header */}
            <motion.div
              style={{ y: headerY, opacity: headerOpacity }}
              className="mb-12 md:mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs text-cyan tracking-widest">04</span>
                <div className="w-12 h-px bg-cyan" />
                <span className="font-mono text-xs text-ash tracking-widest uppercase">Contact</span>
              </div>
              <h2 className="section-title text-white">
                Get in Touch
              </h2>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={blurUp}
              initial="hidden"
              whileInView="visible"
              viewport={mobileViewport ?? { once: true }}
              custom={0}
            >
              <p className="text-frost text-lg md:text-xl leading-relaxed mb-10">
                I'm always looking for new opportunities.
                <br />
                Whether you have a question or just want to say hi, I'd love to hear from you!
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href={`mailto:${contact.email}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-base"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Say Hello
                </motion.a>

                <motion.a
                  href={contact.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary text-base"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Right column - vertically centered to the full section height */}
          <div className="flex items-center">
            <div className="space-y-4 w-full">
              {contactItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  variants={blurUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={mobileViewport ?? { once: true }}
                  custom={0.1 + index * 0.1}
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group flex items-center gap-5 bento-card p-5 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate/80 flex items-center justify-center
                                  text-ash group-hover:text-cyan group-hover:bg-cyan/10
                                  transition-all duration-500 shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-mono text-[10px] text-ash uppercase tracking-[0.2em] mb-0.5">
                      {item.label}
                    </h3>
                    <p className="font-body text-sm text-frost group-hover:text-cyan transition-colors duration-300 truncate">
                      {item.value}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-zinc/50 group-hover:text-cyan/60 transition-all duration-300 shrink-0
                                 -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
