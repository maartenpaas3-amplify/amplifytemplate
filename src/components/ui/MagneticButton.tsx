import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cutCornerClipPath } from '../../config/theme';

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

interface Particle {
  id: number;
  angle: number;
  distance: number;
  color: string;
}

let particleSeq = 0;

// The studio's ONE primary-action button, used everywhere a CTA needs
// presence (hero, footer, add-to-cart, checkout) — one implementation, not
// four hand-rolled buttons drifting apart.
//
// Baseline effects play with NO cursor involved, because the real audience
// orders from a phone and hover doesn't exist there:
//   1. Breathing glow halo, always faintly on, flares on hover.
//   2. A crisp, continuously ROTATING gradient ring around the button — a
//      different kind of "alive" than a symmetric pulse: it turns.
//   3. An arrow that nudges right in an endless loop.
//   4. A real press-down animation (whileTap).
//   5. A small particle burst fired from the button on every tap/click —
//      the tactile "reward" moment, not just an instant state change.
// Magnetic cursor-pull + light sweep remain as a desktop-only bonus layer.
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });
  const [hovering, setHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

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

  const handleClick = () => {
    const burst: Particle[] = Array.from({ length: 8 }, () => ({
      id: particleSeq++,
      angle: Math.random() * 360,
      distance: 26 + Math.random() * 20,
      color: Math.random() > 0.5 ? (glowColor ?? '#fff') : '#fff',
    }));
    setParticles((prev) => [...prev, ...burst]);
    window.setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !burst.includes(p)));
    }, 650);
    onClick?.();
  };

  const shapeClip = shape === 'cut' ? cutCornerClipPath : undefined;
  const shapeRadius = shape === 'pill' ? '999px' : '0.5rem';

  return (
    <span className={`relative ${fullWidth ? 'block w-full' : 'inline-block'}`}>
      {glowColor && (
        <>
          {/* Ambient breathing halo */}
          <motion.span
            className={`absolute inset-0 blur-2xl -z-10 ${shape === 'pill' ? 'rounded-full' : 'rounded-xl'}`}
            style={{ backgroundColor: glowColor }}
            animate={
              hovering ? { opacity: 0.65, scale: 1.4 } : { opacity: [0.2, 0.4, 0.2], scale: [1, 1.12, 1] }
            }
            transition={
              hovering
                ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            }
          />
          {/* Rotating gradient ring, clipped to a 2px border via padding */}
          <span
            className="absolute -inset-[2px] overflow-hidden -z-0"
            style={{ clipPath: shapeClip, borderRadius: shapeRadius }}
          >
            <motion.span
              className="absolute -inset-1/2"
              style={{
                background: `conic-gradient(from 0deg, ${glowColor}, transparent 35%, transparent 65%, ${glowColor})`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
            />
          </span>
        </>
      )}

      <motion.button
        ref={ref}
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={reset}
        disabled={disabled}
        whileTap={{ scale: 0.94 }}
        style={{ x: springX, y: springY, clipPath: shapeClip, ...style }}
        className={`relative z-10 overflow-hidden inline-flex items-center justify-center gap-2 ${
          shape === 'pill' ? 'rounded-full' : 'rounded-lg'
        } ${fullWidth ? 'w-full' : ''} disabled:opacity-40 ${className ?? ''}`}
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

        <AnimatePresence>
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            return (
              <motion.span
                key={p.id}
                className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full pointer-events-none z-20"
                style={{ backgroundColor: p.color }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(rad) * p.distance, y: Math.sin(rad) * p.distance, opacity: 0, scale: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
        </AnimatePresence>
      </motion.button>
    </span>
  );
};
