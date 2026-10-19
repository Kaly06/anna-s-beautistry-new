import { useEffect, useState } from 'react';
import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

type CursorVariant = 'default' | 'hover' | 'view';

/**
 * A champagne-gold cursor: a soft trailing ring plus a crisp dot.
 * Only activates for fine pointers, never on touch devices.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const reduce = useReducedMotion();
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState('');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 210, damping: 22, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 210, damping: 22, mass: 0.35 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    document.documentElement.classList.add('cursor-none');

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    const handleOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>('a, button, [data-cursor]');
      if (!interactive) {
        setVariant('default');
        setLabel('');
        return;
      }
      setVariant(interactive.dataset.cursor === 'view' ? 'view' : 'hover');
      setLabel(interactive.dataset.cursorLabel ?? '');
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      document.documentElement.classList.remove('cursor-none');
    };
  }, [x, y, reduce]);

  if (!enabled || reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <m.div
        className="absolute -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-gold-300/60"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: variant === 'default' ? 1 : 1.9,
          borderColor: variant === 'default' ? 'rgba(224,200,139,0.55)' : 'rgba(224,200,139,0.9)',
          backgroundColor:
            variant === 'default' ? 'rgba(224,200,139,0)' : 'rgba(224,200,139,0.08)',
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {variant === 'view' && label ? (
          <m.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 0.55 }}
            className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-gold-200"
          >
            {label}
          </m.span>
        ) : null}
      </m.div>
      <m.div
        className="absolute -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-gold-300"
        style={{ x, y }}
        animate={{ opacity: variant === 'default' ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
