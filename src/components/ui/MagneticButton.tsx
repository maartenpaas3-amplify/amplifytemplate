import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { brandConfig } from '../../config/brand.config';

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
// v3: "quiet luxury" outline button. Earlier versions tried to earn "wow"
// by stacking ambient motion (v1) or a single press gimmick (v2, page-fold).
// Both still read as an app-button doing a trick. This version borrows from
// hospitality/editorial brands instead of SaaS: no filled pill at rest, just
// a thin border and colored label — quieter and, counterintuitively, reads
// as MORE expensive than a bright solid block. On press, a solid fill sweeps
// in from the left in one deliberate motion and the label switches to the
// background color to stay legible against it, then both reverse on release.
// One motion, no ambient loop, calm at rest — a screenshot at rest still
// looks intentional instead of "nothing is happening yet".
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
  const { colors } = brandConfig;
  const [pressed, setPressed] = useState(false);
  const fillColor = glowColor ?? colors.accent;

  const shapeRadius = shape === 'pill' ? '999px' : '0.5rem';

  return (
    <span className={`relative ${fullWidth ? 'block w-full' : 'inline-block'}`}>
      <motion.button
        onClick={onClick}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        disabled={disabled}
        style={{
          borderRadius: shapeRadius,
          border: `1.5px solid ${fillColor}`,
          backgroundColor: 'transparent',
          ...style,
        }}
        className={`relative overflow-hidden inline-flex items-center justify-center gap-2 ${
          fullWidth ? 'w-full' : ''
        } disabled:opacity-40 ${className ?? ''}`}
      >
        {/* Solid fill, sweeps in from the left on press, sweeps back out on release. */}
        <motion.span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: fillColor, originX: 0 }}
          animate={{ scaleX: pressed ? 1 : 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.span
          className="relative z-10 inline-flex items-center gap-2"
          animate={{ color: pressed ? colors.background : fillColor }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
          {showArrow && <ArrowRight className="w-4 h-4" />}
        </motion.span>
      </motion.button>
    </span>
  );
};
