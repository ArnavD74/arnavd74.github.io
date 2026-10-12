import { motion, type MotionStyle, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useRevealOnce } from '../../hooks/useRevealOnce';
import { blurUp } from '../../lib/motion';

const TAGS = {
  div: motion.div,
  li: motion.li,
  figure: motion.figure,
  span: motion.span,
  h2: motion.h2,
} as const;

interface RevealProps {
  /** Optional: some reveals are bare decorative rules with no content. */
  children?: ReactNode;
  className?: string;
  /** Delay in seconds, handed to the variant's `custom` argument. */
  delay?: number;
  /** rootMargin for the reveal trigger. */
  margin?: string;
  variants?: Variants;
  as?: keyof typeof TAGS;
  style?: MotionStyle;
}

/**
 * Plays a one-shot entrance the first time an element is seen.
 *
 * Deliberately driven by `animate` off {@link useRevealOnce} rather than
 * framer-motion's `whileInView`, which can leave an element stuck at its
 * `initial` state — invisible but still occupying its full box — if the viewport
 * observer never catches it on screen. See that hook for the details.
 */
const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  margin = '0px',
  variants = blurUp,
  as = 'div',
  style,
}) => {
  const ref = useRef<HTMLElement>(null);
  const revealed = useRevealOnce(ref, margin);
  const Tag = TAGS[as];

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- one ref type per tag
      ref={ref as any}
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      animate={revealed ? 'visible' : 'hidden'}
      custom={delay}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
