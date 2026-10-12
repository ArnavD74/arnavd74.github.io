import { motion, useScroll, useTransform } from 'framer-motion';
import { type RefObject } from 'react';
import { slideInLeft, slideUpReveal } from '../../lib/motion';
import Reveal from './Reveal';

interface SectionHeaderProps {
  /** Two-digit index shown before the label, e.g. "01". */
  index: string;
  /** Small uppercase eyebrow, e.g. "About". */
  label: string;
  /** Large display heading, e.g. "Background". */
  title: string;
  /**
   * The <section> the header belongs to. Drives the scroll-linked drift so the
   * heading eases in as the section enters and lifts away as it leaves.
   */
  sectionRef: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * The index / rule / eyebrow / title block that opens every content section.
 *
 * Previously this markup was copy-pasted four times with slightly different
 * scroll ranges, which is why the section headings drifted at visibly different
 * rates. One component means one curve everywhere.
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  index,
  label,
  title,
  sectionRef,
  className = 'mb-20 md:mb-28',
}) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 0.3, 0.85, 1], [60, 0, 0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.div style={{ y, opacity }} className={className}>
      <div className="flex items-center gap-4 mb-6">
        <Reveal
          as="span"
          variants={slideInLeft}
          className="font-mono text-xs text-cyan tracking-widest"
        >
          {index}
        </Reveal>
        <Reveal variants={slideInLeft} delay={0.15} className="w-12 h-px bg-cyan" />
        <Reveal
          as="span"
          variants={slideInLeft}
          delay={0.3}
          className="font-mono text-xs text-ash tracking-widest uppercase"
        >
          {label}
        </Reveal>
      </div>
      {/* clip-path alongside overflow-hidden: Safari ignores overflow clipping on
          an element whose child is mid-transform, which let the title bleed out. */}
      <div className="overflow-hidden" style={{ clipPath: 'inset(0)' }}>
        <Reveal as="h2" variants={slideUpReveal} delay={0.2} className="section-title text-white">
          {title}
        </Reveal>
      </div>
    </motion.div>
  );
};

export default SectionHeader;
