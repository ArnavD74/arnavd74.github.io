import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../data/projects';
import type { Project } from '../../types';
import ProjectModal from '../ui/ProjectModal';

type Category = 'all' | 'projects' | 'coursework' | 'oss' | 'work';

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <section id="projects" className="py-32 relative">
      {/* Subtle divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-zinc/30" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-cyan tracking-widest uppercase mb-4 block">
            02 / Works
          </span>
          <h2 className="section-title text-white">
            My Work
          </h2>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all duration-200
                ${activeCategory === cat.id
                  ? 'bg-cyan text-obsidian'
                  : 'bg-slate text-silver border border-zinc/30 hover:border-cyan/40 hover:text-frost'
                }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5"
          >
            {filteredProjects.map((project) => (
              <motion.button
                key={project.id}
                onClick={() => openModal(project)}
                whileHover={{ y: -4 }}
                className="group relative project-card overflow-hidden text-left cursor-pointer"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-t-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className={`w-full block transition-all duration-500
                               group-hover:scale-105 group-hover:blur-sm
                               ${project.archived ? 'grayscale opacity-60' : ''}`}
                  />
                  {/* Overlay on hover - darker for readability */}
                  <div className="absolute inset-0 bg-obsidian/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-3 py-1.5 border border-cyan text-cyan text-xs font-mono uppercase tracking-wider">
                      View Details
                    </span>
                  </div>

                  {project.archived && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 px-1.5 py-0.5 md:px-2 md:py-1 bg-slate/90 backdrop-blur-sm rounded text-[10px] md:text-xs font-mono text-ash uppercase tracking-wider">
                      Archived
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 md:p-5">
                  <h3 className="font-body font-semibold text-sm md:text-base text-frost group-hover:text-white
                                 transition-colors line-clamp-2 mb-1 md:mb-2">
                    {project.title}
                  </h3>

                  {/* Description - hidden on mobile */}
                  <p className="hidden md:block text-silver text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Desktop: category + multiple tech badges */}
                  <div className="hidden md:flex items-center justify-between">
                    <span className="font-mono text-xs text-ash uppercase tracking-wider">
                      {project.category === 'oss' ? 'Open Source' : project.category}
                    </span>
                    <div className="flex gap-1">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-graphite rounded text-xs text-ash"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mobile: just the first tech badge */}
                  <div className="flex md:hidden mt-2">
                    {project.technologies.slice(0, 1).map((tech) => (
                      <span
                        key={tech}
                        className="px-1.5 py-0.5 bg-graphite rounded text-[10px] text-ash"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-cyan
                                transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
