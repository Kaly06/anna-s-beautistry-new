import { m, useScroll, useSpring } from 'framer-motion';

/** A single gold hairline tracking reading progress across the top of the page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.25 });

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-gold-600 via-gold-200 to-gold-600"
      style={{ scaleX }}
    />
  );
}
