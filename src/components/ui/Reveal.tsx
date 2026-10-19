import type { ReactNode } from 'react';
import { m } from 'framer-motion';
import { EASE } from '../../lib/animations';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}

/** Generic scroll-triggered fade-and-rise. */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 26,
  duration = 1.05,
  once = true,
}: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-8%' }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </m.div>
  );
}
