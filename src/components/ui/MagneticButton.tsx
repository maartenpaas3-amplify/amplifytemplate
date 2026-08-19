import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cutCornerClipPath } from '../../config/theme';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;
  showArrow?: boolean;
  // 'cut' = the studio's signature primary-action shape (see theme.ts).
  // 'pill' = plain rounded, for secondary/inline uses.
  shape?: 'cut' | 'pill';
}

// Shared UI primitive (part of the fixed engine, not a wow module — usable
// anywhere a primary CTA needs presence).
//
// IMPORTANT: hover-only effects are invisible on touch devices, and this
// engine's actual audience orders from a phone. So every effect here has a
// baseline that plays with NO cursor involved:
//   1. A breathing glow halo that pulses continuously on a loop (desktop
//      hover just makes it flare brighter/bigger — it's never fully off).
//   2. An arrow that nudges right in an endless loop — the "something
//      shifts" motion that's visible on mobile with zero interaction.
//   3. A real press-down animation (whileTap) for the tactile feedback a
//      touch tap needs, since touch has no hover state at all.
//   4. Magnetic pull + light sweep still layered on top for desktop, as a
//      bonus, not the whole effect.
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className,
  style,
  glowColor,
  showArrow = true,
  shape = 'cut',
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });
  const [hovering, setHovering] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    setHovering(false);
  };

  return (
    <span className="relative inline-block">
      {glowColor && (
        <motion.span
          className={`absolute inset-0 blur-2xl -z-10 ${shape === 'pill' ? 'rounded-full' : 'rounded-xl'}`}
          style={{ backgroundColor: glowColor }}
          animate={
            hovering
              ? { opacity: 0.65, scale: 1.4 }
              : { opacity: [0.2, 0.4, 0.2], scale: [1, 1.12, 1] }
          }
          transition={
            hovering
              ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
              : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      )}
      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={reset}
        whileTap={{ scale: 0.94 }}
        style={{ x: springX, y: springY, clipPath: shape === 'cut' ? cutCornerClipPath : undefined, ...style }}
        className={`relative overflow-hidden inline-flex items-center gap-2 ${shape === 'pill' ? 'rounded-full' : 'rounded-lg'} ${className ?? ''}`}
      >
        <span className="relative z-10">{children}</span>
        {showArrow && (
          <motion.span
            className="relative z-10 inline-flex"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        )}
        <motion.span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)' }}
          initial={{ x: '-130%' }}
          animate={{ x: hovering ? '130%' : '-130%' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.button>
    </span>
  );
};
