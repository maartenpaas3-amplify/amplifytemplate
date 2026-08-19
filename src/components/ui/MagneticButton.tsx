import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;
  showArrow?: boolean;
  shape?: 'cut' | 'pill';
  fullWidth?: boolean;
  disabled?: boolean;
}

// The studio's ONE primary-action button, used everywhere a CTA needs
// presence (hero, footer, add-to-cart, checkout) — one implementation, not
// four hand-rolled buttons drifting apart.
//
// v2: replaced the stacked ambient effects (breathing glow + rotating ring +
// looping arrow + particle burst) with ONE deliberate motion instead of four
// competing ones. Four things moving at once on a small button reads as
// noisy, not premium — that was a real mistake in the previous version.
//
// The new idea: a page-fold. On press, the bottom-right corner of the button
// lifts like a turned page corner, with a soft shadow underneath, then
// settles back. It's a TAP effect (whileTap / press), not a hover effect —
// the real audience orders from a phone, where hover doesn't exist. The
// button is calm at rest; the fold is the entire "reward" moment.
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className,
  style,
  glowColor,
  showArrow = true,
  shape = 'cut',
  fullWidth = false,
  disabled = false,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);

  const shapeRadius = shape === 'pill' ? '999px' : '0.5rem';
  const foldSize = shape === 'pill' ? 16 : 20;

  return (
    <span className={`relative ${fullWidth ? 'block w-full' : 'inline-block'}`}>
      <motion.button
        ref={ref}
        onClick={onClick}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        disabled={disabled}
        animate={{ scale: pressed ? 0.97 : 1 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{ ...style, borderRadius: shapeRadius }}
        className={`relative overflow-hidden inline-flex items-center justify-center gap-2 ${
          fullWidth ? 'w-full' : ''
        } disabled:opacity-40 ${className ?? ''}`}
      >
        <span className="relative z-10">{children}</span>
        {showArrow && (
          <span className="relative z-10 inline-flex">
            <ArrowRight className="w-4 h-4" />
          </span>
        )}

        {/* Page-fold: the corner lifts on press, revealing a shaded underside. */}
        <motion.span
          aria-hidden
          className="absolute bottom-0 right-0 pointer-events-none"
          style={{
            width: foldSize,
            height: foldSize,
            background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.28) 50%)`,
            transformOrigin: 'bottom right',
          }}
          animate={{
            clipPath: pressed
              ? 'polygon(100% 0%, 100% 100%, 0% 100%)'
              : 'polygon(100% 55%, 100% 100%, 55% 100%)',
            opacity: pressed ? 1 : 0.55,
          }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            width: foldSize * 1.6,
            height: 3,
            right: 0,
            bottom: 0,
            background: glowColor ?? 'rgba(255,255,255,0.5)',
            transformOrigin: 'bottom right',
            filter: 'blur(2px)',
          }}
          animate={{ opacity: pressed ? 0.5 : 0, rotate: -45 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.button>
    </span>
  );
};
