import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { brandConfig } from '../../config/brand.config';

// Wow module (Layer 3): "customCursor". Desktop-only branded cursor that
// grows and inverts over clickable elements — the detail that made Japoneza
// feel designed rather than default. Hidden automatically on touch devices.
export const CustomCursor: React.FC = () => {
  const { colors } = brandConfig;
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue<number>(-100);
  const y = useMotionValue<number>(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest('button, a, [role="button"]'));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[999] pointer-events-none rounded-full mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        backgroundColor: colors.textPrimary,
      }}
      animate={{ width: hovering ? 48 : 14, height: hovering ? 48 : 14 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    />
  );
};
