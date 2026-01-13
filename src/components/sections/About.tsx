import { motion } from 'framer-motion';

const About: React.FC = () => {
  const technologies = [
    { name: 'React', url: 'https://react.dev' },
    { name: 'TypeScript', url: 'https://www.typescriptlang.org' },
    { name: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { name: 'Python', url: 'https://www.python.org' },
    { name: 'Java', url: 'https://www.java.com' },
    { name: 'C#', url: 'https://docs.microsoft.com/en-us/dotnet/csharp' },
    { name: 'Node.js', url: 'https://nodejs.org' },
    { name: 'AWS', url: 'https://aws.amazon.com' },
    { name: 'Docker', url: 'https://www.docker.com' },
    { name: 'PostgreSQL', url: 'https://www.postgresql.org' },
    { name: 'DynamoDB', url: 'https://aws.amazon.com/dynamodb' },
    { name: 'MongoDB', url: 'https://www.mongodb.com' },
    { name: 'Pandas', url: 'https://pandas.pydata.org' },
    { name: 'Scikit-learn', url: 'https://scikit-learn.org' },
    { name: 'R', url: 'https://www.r-project.org' },
    { name: 'Streamlit', url: 'https://streamlit.io' },
    { name: 'Tailwind', url: 'https://tailwindcss.com' },
    { name: 'Git', url: 'https://git-scm.com' },
    { name: 'Figma', url: 'https://www.figma.com' },
    { name: 'OpenAI API', url: 'https://openai.com/api' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="about" className="py-32 relative">
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
            01 / About
          </span>
          <h2 className="section-title text-white">
            Background
          </h2>
        </motion.div>

        {/* Main content grid - asymmetric */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Text content - takes 7 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 order-2 lg:order-1"
          >
            <div className="space-y-6 body-text">
              <p className="text-frost text-lg leading-relaxed">
                I'm a recent graduate of Rutgers University with a Bachelor's in Computer Science
                and a minor in Data Science.
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

            {/* Technologies section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 pt-8 border-t border-zinc/30"
            >
              <h3 className="font-mono text-xs text-ash uppercase tracking-widest mb-5">
                Technologies
              </h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {technologies.map((tech) => (
                  <motion.a
                    key={tech.name}
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.03,
                      borderColor: 'rgba(0, 212, 255, 0.4)',
                    }}
                    className="tag cursor-pointer"
                  >
                    {tech.name}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image - takes 5 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 order-1 lg:order-2"
          >
            <div className="relative w-4/5 mx-auto">
              {/* Decorative frame */}
              <div className="absolute -inset-3 border border-zinc/20 rounded-lg" />
              <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-cyan" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-cyan" />

              {/* Image container */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-graphite">
                <img
                  src="/images/pfp2.png"
                  alt="Arnav Dashaputra"
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-obsidian/10" />
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
