import Mark from './Mark';

/**
 * The house mark: the Halo — an eye ringed with studs, drawn as three
 * concentric rings. It replaces the generic diamond in the nav, the footer and
 * the opening curtain.
 */
export default function Monogram({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <Mark name="halo" strokeWidth={1.5} className="h-full w-full text-gold-300" />
      <span className="absolute h-[22%] w-[22%] rounded-full bg-gold-300" />
    </span>
  );
}
