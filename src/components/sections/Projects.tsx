import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { projects } from '../../data/projects';
import type { Project } from '../../types';
import ProjectModal from '../ui/ProjectModal';

type Category = 'all' | 'projects' | 'coursework' | 'oss' | 'work';

const blurUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  const categories: { id: Category; label: string }[] = [
    { id: 'projects', label: 'Projects' },
    { id: 'work', label: 'Work' },
    { id: 'oss', label: 'OSS' },
    { id: 'coursework', label: 'Coursework' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <section ref={sectionRef} id="projects" className="py-32 md:py-44 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-16 md:mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-cyan tracking-widest">02</span>
            <div className="w-12 h-px bg-cyan" />
            <span className="font-mono text-xs text-ash tracking-widest uppercase">Works</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="section-title text-white">
              My Work
            </h2>

            {/* Filter pills */}
            <div className="flex gap-1 p-1 bg-slate/40 rounded-xl border border-zinc/15 backdrop-blur-sm">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer
                    ${activeCategory === cat.id
                      ? 'text-obsidian'
                      : 'text-silver hover:text-frost'
                    }`}
                >
                  {activeCategory === cat.id && (
                    <motion.span
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-cyan rounded-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects grid - fluid tiles */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {filteredProjects.map((project, index) => (
              <motion.button
                key={project.id}
                variants={blurUp}
                initial="hidden"
                animate="visible"
                custom={index * 0.06}
                onClick={() => openModal(project)}
                className="group project-tile text-left aspect-[4/3]"
              >
                {/* Full-bleed image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out
                             group-hover:scale-[1.06]
                             ${project.archived ? 'grayscale opacity-40' : ''}`}
                />

                {/* Permanent bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />

                {/* Hover overlay - deepens */}
                <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/40 transition-all duration-500" />

                {/* Archived badge */}
                {project.archived && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate/80 backdrop-blur-md rounded-lg text-[10px] font-mono text-ash uppercase tracking-wider z-10">
                    Archived
                  </div>
                )}

                {/* Content - always visible at bottom, expands on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  {/* Category label */}
                  <span className="font-mono text-[10px] text-cyan/70 uppercase tracking-[0.15em] mb-2 block
                                   translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {project.category === 'oss' ? 'Open Source' : project.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-body font-semibold text-base md:text-lg text-white leading-snug mb-2">
                    {project.title}
                  </h3>

                  {/* Description - slides up on hover */}
                  <p className="text-silver/80 text-sm leading-relaxed line-clamp-2 mb-3
                               max-h-0 group-hover:max-h-20 opacity-0 group-hover:opacity-100
                               transition-all duration-500 overflow-hidden">
                    {project.description}
                  </p>

                  {/* Tech tags - slide up on hover */}
                  <div className="flex gap-1.5 flex-wrap
                                 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                                 transition-all duration-500 delay-75">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-md text-[10px] text-frost/80 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top-right arrow indicator */}
                <div className="absolute top-4 right-4 z-10
                               opacity-0 group-hover:opacity-100 translate-x-2 -translate-y-2
                               group-hover:translate-x-0 group-hover:translate-y-0
                               transition-all duration-500">
                  <svg className="w-5 h-5 text-cyan/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default Projects;
