import { MARKS, type MarkName } from '../../data/marks';

interface MarkProps {
  name: MarkName;
  className?: string;
  strokeWidth?: number;
}

/** Renders a house mark as stroked SVG in a 40x40 box. */
export default function Mark({ name, className = '', strokeWidth = 1.2 }: MarkProps) {
  const mark = MARKS[name];
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {mark.path.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
