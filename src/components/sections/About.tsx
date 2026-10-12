import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { blurUp, revealViewport } from '../../lib/motion';
import ScrollReveal from '../ui/ScrollReveal';
import SectionHeader from '../ui/SectionHeader';

type TechItem = { name: string; url: string };

// Manually shuffled so similar items are spread apart across both rows
const techRow1: TechItem[] = [
  { name: 'Python', url: 'https://www.python.org' },
  { name: 'AWS', url: 'https://aws.amazon.com' },
  { name: 'React', url: 'https://react.dev' },
  { name: 'Machine Learning', url: 'https://en.wikipedia.org/wiki/Machine_learning' },
  { name: 'PostgreSQL', url: 'https://www.postgresql.org' },
  { name: 'Java', url: 'https://www.java.com' },
  { name: 'Docker', url: 'https://www.docker.com' },
  { name: 'Scikit-learn', url: 'https://scikit-learn.org' },
  { name: 'Figma', url: 'https://www.figma.com' },
  { name: 'Node.js', url: 'https://nodejs.org' },
  { name: 'Cloudflare', url: 'https://www.cloudflare.com' },
  { name: 'SQL', url: 'https://en.wikipedia.org/wiki/SQL' },
  { name: 'Streamlit', url: 'https://streamlit.io' },
  { name: 'C#', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/' },
  { name: 'Git', url: 'https://git-scm.com' },
  { name: 'RAG', url: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation' },
  { name: 'MongoDB', url: 'https://www.mongodb.com' },
  { name: 'Photoshop', url: 'https://www.adobe.com/products/photoshop.html' },
  { name: 'OpenAI API', url: 'https://openai.com/api' },
  { name: 'Tableau', url: 'https://www.tableau.com' },
  { name: 'Bash', url: 'https://www.gnu.org/software/bash/' },
  { name: 'FHIR HL7', url: 'https://www.hl7.org/fhir/' },
];

const techRow2: TechItem[] = [
  { name: 'TypeScript', url: 'https://www.typescriptlang.org' },
  { name: 'Tailwind', url: 'https://tailwindcss.com' },
  { name: 'Azure', url: 'https://azure.microsoft.com' },
  { name: 'Pandas', url: 'https://pandas.pydata.org' },
  { name: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'DynamoDB', url: 'https://aws.amazon.com/dynamodb' },
  { name: 'Discord.js', url: 'https://discord.js.org' },
  { name: 'SHAP', url: 'https://shap.readthedocs.io' },
  { name: 'Stripe', url: 'https://stripe.com' },
  { name: 'R', url: 'https://www.r-project.org' },
  { name: 'DevOps', url: 'https://en.wikipedia.org/wiki/DevOps' },
  { name: 'Jupyter', url: 'https://jupyter.org' },
  { name: 'PHP', url: 'https://www.php.net' },
  { name: 'SQL Server', url: 'https://www.microsoft.com/en-us/sql-server' },
  { name: 'Predictive Modeling', url: 'https://en.wikipedia.org/wiki/Predictive_modelling' },
  { name: 'WordPress', url: 'https://wordpress.org' },
  { name: 'SQLite', url: 'https://www.sqlite.org' },
  { name: 'Discord API', url: 'https://discord.com/developers/docs' },
  { name: 'ServiceNow', url: 'https://www.servicenow.com' },
  { name: 'Android SDK', url: 'https://developer.android.com' },
  { name: 'VS Code', url: 'https://code.visualstudio.com' },
  { name: 'Excel', url: 'https://www.microsoft.com/en-us/microsoft-365/excel' },
];

// For mobile: split into 4 shorter rows from the combined pool
const allTech = [...techRow1, ...techRow2];
const quarter = Math.ceil(allTech.length / 4);
const mobileRows = [
  allTech.slice(0, quarter),
  allTech.slice(quarter, quarter * 2),
  allTech.slice(quarter * 2, quarter * 3),
  allTech.slice(quarter * 3),
];
const MOBILE_SPEEDS = ['60s', '66s', '57s', '63s'];

const HOVER_RATE = 0.15;
const RATE_EASE_MS = 1000;

// Defined at module level so React preserves DOM across parent re-renders
const MarqueeRow = ({
  items,
  reverse,
  speed,
  paused,
}: {
  items: TechItem[];
  reverse?: boolean;
  speed?: string;
  paused?: boolean;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /** Eases the CSS animation's playbackRate instead of snapping it. */
  const easeRate = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    cancelAnimationFrame(rafRef.current);
    const anims = track.getAnimations();
    if (anims.length === 0) return;
    const start = anims[0].playbackRate;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - t0) / RATE_EASE_MS, 1);
      const ease = 1 - (1 - t) ** 3; // cubic ease-out
      const rate = start + (target - start) * ease;
      anims.forEach((a) => {
        a.playbackRate = rate;
      });
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const slow = paused ? undefined : () => easeRate(HOVER_RATE);
  const resume = paused ? undefined : () => easeRate(1);

  return (
    <div
      className="marquee-container relative overflow-hidden py-1 md:py-2 mb-1.5 md:mb-3 marquee-fade"
      onMouseEnter={slow}
      onMouseLeave={resume}
      onTouchStart={slow}
      onTouchEnd={resume}
      onTouchCancel={resume}
    >
      <div
        ref={trackRef}
        className={`marquee-track flex w-max ${reverse ? 'marquee-reverse' : ''}`}
        style={speed ? { animationDuration: speed } : undefined}
      >
        {/* The list is rendered twice so translateX(-50%) loops seamlessly — the
            two halves must stay layout-identical, hence the same element and
            classes for both. The second half is decorative, so it is hidden from
            assistive tech and taken out of the tab order instead of being read
            and tabbed through twice. */}
        {[...items, ...items].map((tech, i) => {
          const duplicate = i >= items.length;
          return (
            <a
              key={`${tech.name}-${i}`}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden={duplicate || undefined}
              tabIndex={duplicate ? -1 : undefined}
              className="tag mx-1 md:mx-1.5 inline-block cursor-pointer shrink-0 text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5"
            >
              {tech.name}
            </a>
          );
        })}
      </div>
    </div>
  );
};

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewport = revealViewport(isMobile);

  return (
    <section ref={sectionRef} id="about" className="py-28 md:py-44 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader index="01" label="About" title="Background" sectionRef={sectionRef} />

        {/* Main content grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <ScrollReveal className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              variants={blurUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              custom={0}
            >
              <div className="space-y-6 body-text">
                <p className="text-frost text-lg leading-relaxed">Hey, thanks for visiting my site!</p>
                <p>
                  I'm currently working as a Data Scientist while continuing to build and ship
                  software projects on the side. I love to learn by building with new tools and
                  technologies, whether it be in data science, machine learning, or software
                  development&nbsp;:]
                </p>
                <p>
                  Beyond coding, some of my interests include custom computer peripheral design, PC
                  hardware, and DIY embedded systems projects. I also love Pokemon, Minecraft, vinyl
                  records, skiing, and cats!
                </p>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-5 order-1 lg:order-2">
            <motion.div
              variants={blurUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              custom={0.1}
            >
              <div className="relative w-4/5 mx-auto group">
                <div className="absolute -inset-3 border border-zinc/20 rounded-lg" />
                <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-cyan" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-cyan" />
                <div className="relative aspect-square rounded-lg overflow-hidden bg-graphite">
                  <img
                    src="/images/pfp2.png"
                    alt="Arnav Dashaputra"
                    width={512}
                    height={512}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-obsidian/10" />
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Tech stack marquee */}
        <ScrollReveal className="mt-14 md:mt-28">
          <motion.div
            variants={blurUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <h3 className="font-mono text-[10px] text-ash uppercase tracking-[0.2em] mb-4 md:mb-6 text-center">
              Technologies I Work With
            </h3>

            {/* Desktop: 2 long rows */}
            <div className="hidden md:block">
              <MarqueeRow items={techRow1} paused={prefersReducedMotion} />
              <MarqueeRow items={techRow2} reverse paused={prefersReducedMotion} />
            </div>

            {/* Mobile: 4 shorter rows, faster */}
            <div className="md:hidden">
              {mobileRows.map((row, i) => (
                <MarqueeRow
                  key={i}
                  items={row}
                  speed={MOBILE_SPEEDS[i]}
                  reverse={i % 2 === 1}
                  paused={prefersReducedMotion}
                />
              ))}
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
