import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-obsidian/90 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
          >
            <div
              className="w-full max-w-2xl max-h-[85vh] bg-graphite rounded-2xl border border-zinc/20
                         overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative h-48 md:h-60 flex-shrink-0 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/20 to-transparent" />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-obsidian/60 backdrop-blur-md
                             flex items-center justify-center text-ash hover:text-cyan hover:bg-obsidian/80
                             transition-all border border-zinc/20 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {/* Category badge + title */}
                <div className="mb-5">
                  <span className="inline-block px-2.5 py-1 bg-cyan/10 text-cyan rounded-lg font-mono text-[10px] uppercase tracking-wider mb-3 border border-cyan/15">
                    {project.category}
                  </span>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">
                    {project.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-silver text-sm leading-relaxed mb-8">
                  {project.longDescription}
                </p>

                {/* Technologies */}
                <div className="mb-8">
                  <h3 className="font-mono text-[10px] text-ash uppercase tracking-widest mb-3">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="tag"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h3 className="font-mono text-[10px] text-ash uppercase tracking-widest mb-3">
                    Links
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.links.map((link) => (
                      <motion.a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary text-sm py-2.5"
                      >
                        {link.label}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
