import React, { useId } from 'react';

interface OrnamentDividerProps {
  color: string;
  height?: number;
  opacity?: number;
  className?: string;
}

// Fixed engine component, always on for every client — the studio's one
// signature ornamental detail, a thin chain of diamonds inspired by
// zellige border motifs rather than a generic straight rule or gradient
// line. This is deliberately used in exactly TWO places in the whole app
// (above the Footer, and as a small accent on the signature dish card) —
// not sprinkled everywhere — so it reads as a considered detail specific
// to this studio's work instead of decorative noise.
export const OrnamentDivider: React.FC<OrnamentDividerProps> = ({
  color,
  height = 14,
  opacity = 1,
  className,
}) => {
  const id = useId().replace(/:/g, '');
  const tileW = height * 2;

  return (
    <svg
      aria-hidden
      className={className}
      width="100%"
      height={height}
      style={{ display: 'block', opacity }}
      preserveAspectRatio="none"
    >
      <pattern id={`zellige-${id}`} width={tileW} height={height} patternUnits="userSpaceOnUse">
        <line x1={0} y1={height / 2} x2={tileW} y2={height / 2} stroke={color} strokeWidth={1} strokeOpacity={0.4} />
        <rect
          x={tileW / 2 - height * 0.28}
          y={height / 2 - height * 0.28}
          width={height * 0.56}
          height={height * 0.56}
          transform={`rotate(45 ${tileW / 2} ${height / 2})`}
          fill="none"
          stroke={color}
          strokeWidth={1.2}
        />
      </pattern>
      <rect width="100%" height={height} fill={`url(#zellige-${id})`} />
    </svg>
  );
};
