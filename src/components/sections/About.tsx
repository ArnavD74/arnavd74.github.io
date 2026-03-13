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

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.4], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // On mobile, trigger all whileInView immediately
  const mobileViewport = isMobile
    ? { once: true, margin: '2000px' as const }
    : undefined;

  // Manually shuffled so similar items are spread apart across both rows
  const techRow1 = [
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
    { name: 'C#', url: 'https://docs.microsoft.com/en-us/dotnet/csharp' },
    { name: 'Git', url: 'https://git-scm.com' },
    { name: 'RAG', url: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation' },
    { name: 'MongoDB', url: 'https://www.mongodb.com' },
    { name: 'Photoshop', url: 'https://www.adobe.com/products/photoshop.html' },
    { name: 'Lua', url: 'https://www.lua.org' },
    { name: 'OpenAI API', url: 'https://openai.com/api' },
    { name: 'Tableau', url: 'https://www.tableau.com' },
    { name: 'Unity', url: 'https://unity.com' },
    { name: 'Bash', url: 'https://www.gnu.org/software/bash/' },
    { name: 'FHIR', url: 'https://www.hl7.org/fhir/' },
  ];

  const techRow2 = [
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
    { name: 'C', url: 'https://en.wikipedia.org/wiki/C_(programming_language)' },
    { name: 'SQLite', url: 'https://www.sqlite.org' },
    { name: 'Discord API', url: 'https://discord.com/developers/docs' },
    { name: 'Lightroom', url: 'https://www.adobe.com/products/photoshop-lightroom.html' },
    { name: 'ServiceNow', url: 'https://www.servicenow.com' },
    { name: 'Android SDK', url: 'https://developer.android.com' },
    { name: 'Autodesk Inventor', url: 'https://www.autodesk.com/products/inventor' },
    { name: 'VS Code', url: 'https://code.visualstudio.com' },
    { name: 'Excel', url: 'https://www.microsoft.com/en-us/microsoft-365/excel' },
  ];

  // For mobile: split into 4 rows from combined pool
  const allTech = [...techRow1, ...techRow2];
  const quarter = Math.ceil(allTech.length / 4);
  const mobileRow1 = allTech.slice(0, quarter);
  const mobileRow2 = allTech.slice(quarter, quarter * 2);
  const mobileRow3 = allTech.slice(quarter * 2, quarter * 3);
  const mobileRow4 = allTech.slice(quarter * 3);

  const MarqueeRow = ({ items, reverse, speed }: { items: typeof techRow1; reverse?: boolean; speed?: string }) => (
    <div className="marquee-container relative overflow-hidden py-1 md:py-2 mb-1.5 md:mb-3">
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />
      <div
        className={`marquee-track flex shrink-0 ${reverse ? 'marquee-reverse' : ''}`}
        style={speed ? { animationDuration: speed } : undefined}
      >
        {[...items, ...items, ...items, ...items].map((tech, i) => (
          <a
            key={`${tech.name}-${i}`}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tag mx-1 md:mx-1.5 inline-block cursor-pointer shrink-0 text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5"
          >
            {tech.name}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="about" className="pt-32 pb-8 md:py-44 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-20 md:mb-28"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-cyan tracking-widest">01</span>
            <div className="w-12 h-px bg-cyan" />
            <span className="font-mono text-xs text-ash tracking-widest uppercase">About</span>
          </div>
          <h2 className="section-title text-white">
            Background
          </h2>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            variants={blurUp}
            initial="hidden"
            whileInView="visible"
            viewport={mobileViewport ?? { once: true, margin: '-80px' }}
            custom={0}
            className="lg:col-span-7 order-2 lg:order-1"
          >
            <div className="space-y-6 body-text">
              <p className="text-frost text-lg leading-relaxed">
                Hey, I'm Arnav, thanks for visiting my site!
              </p>
              <p>
                My background spans full-stack engineering (React, Node, Python), cloud infrastructure (AWS),
                and data science/ML workflows. I'm most engaged when I can move between these areas
                rather than stay siloed in one.
              </p>
              <p>
                I have a strong bias for action, translating business needs into dependable
                software through analytical processes and methodical execution. I'm currently
                working as a Data Scientist while continuing to build and ship software projects.
              </p>
              <p>
                Beyond development, some niche interests I have include Discord bot development,
                custom peripheral design (mechanical keyboards, enthusiast-grade mice),
                PC hardware, and DIY embedded systems projects.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={blurUp}
            initial="hidden"
            whileInView="visible"
            viewport={mobileViewport ?? { once: true, margin: '-80px' }}
            custom={0.1}
            className="lg:col-span-5 order-1 lg:order-2"
          >
            <div className="relative w-4/5 mx-auto group">
              <div className="absolute -inset-3 border border-zinc/20 rounded-lg" />
              <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-cyan" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-cyan" />
              <div className="relative aspect-square rounded-lg overflow-hidden bg-graphite">
                <img
                  src="/images/pfp2.png"
                  alt="Arnav Dashaputra"
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-obsidian/10" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack Marquee */}
        <motion.div
          variants={blurUp}
          initial="hidden"
          whileInView="visible"
          viewport={mobileViewport ?? { once: true }}
          custom={0.1}
          className="mt-14 md:mt-28"
        >
          <h3 className="font-mono text-[10px] text-ash uppercase tracking-[0.2em] mb-4 md:mb-6 text-center">
            Technologies I Work With
          </h3>

          {/* Desktop: 2 rows */}
          <div className="hidden md:block">
            <MarqueeRow items={techRow1} />
            <MarqueeRow items={techRow2} reverse />
          </div>

          {/* Mobile: 4 rows, faster */}
          <div className="md:hidden">
            <MarqueeRow items={mobileRow1} speed="20s" />
            <MarqueeRow items={mobileRow2} speed="22s" reverse />
            <MarqueeRow items={mobileRow3} speed="19s" />
            <MarqueeRow items={mobileRow4} speed="21s" reverse />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
