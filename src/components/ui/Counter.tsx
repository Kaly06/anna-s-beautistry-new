import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
}

/** Counts up once, the first time it scrolls into view. */
export default function Counter({ value, suffix = '', prefix = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Shrink the trigger area vertically only: a horizontal shrink would
  // permanently exclude small numbers sitting near the left edge (their
  // whole span can fall inside the trimmed band and never intersect).
  const inView = useInView(ref, { once: true, margin: '-10% 0%' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 1600;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}
