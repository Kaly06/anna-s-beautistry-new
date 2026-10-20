import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type CursorVariant = 'default' | 'hover' | 'view';

/**
 * A metallic-gold (#d4af37) cursor that tracks the pointer 1:1.
 *
 * The outer element's transform is written directly to the DOM during
 * `pointermove` — no spring, easing, animation frame queue, or React render
 * sits between the pointer and the cursor. Only the ring's hover size and
 * colour have a short transition; the centre of the cursor never trails.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const reduce = useReducedMotion();
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState('');
  const cursorRef = useRef<HTMLDivElement>(null);
  const variantRef = useRef<CursorVariant>('default');
  const labelRef = useRef('');

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    setEnabled(true);
    document.documentElement.classList.add('cursor-none');

    const handleMove = (event: PointerEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.style.opacity = '1';
    };

    const handleOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>('a, button, [data-cursor]');
      const nextVariant: CursorVariant = !interactive
        ? 'default'
        : interactive.dataset.cursor === 'view'
          ? 'view'
          : 'hover';
      const nextLabel = interactive?.dataset.cursorLabel ?? '';

      if (variantRef.current === nextVariant && labelRef.current === nextLabel) return;

      variantRef.current = nextVariant;
      labelRef.current = nextLabel;
      setVariant(nextVariant);
      setLabel(nextLabel);
    };

    const handleLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerover', handleOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerover', handleOver);
      document.documentElement.removeEventListener('pointerleave', handleLeave);
      document.documentElement.classList.remove('cursor-none');
    };
  }, [reduce]);

  if (!enabled || reduce) return null;

  const isActive = variant !== 'default';

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] h-0 w-0 opacity-0"
      style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
    >
      <div
        className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border"
        style={{
          transform: `translate(-50%, -50%) scale(${isActive ? 1.9 : 1})`,
          borderColor: isActive ? 'rgba(212,175,55,0.9)' : 'rgba(212,175,55,0.55)',
          backgroundColor: isActive ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0)',
          transition:
            'transform 100ms ease-out, border-color 100ms ease-out, background-color 100ms ease-out',
        }}
      >
        {variant === 'view' && label ? (
          <span className="font-sans text-[5px] font-medium uppercase tracking-[0.2em] text-gold-200">
            {label}
          </span>
        ) : null}
      </div>
      <div
        className="absolute left-0 top-0 h-[6px] w-[6px] rounded-full bg-gold-400"
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: isActive ? 0 : 1,
          transition: 'opacity 80ms ease-out',
        }}
      />
    </div>
  );
}
