import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { brandConfig } from '../../config/brand.config';

// Wow module (Layer 3): "introTransition". One-time branded reveal shown on
// first load — a wipe of the primary color with the restaurant name, then
// the site fades in underneath. Session-scoped so it only plays once per
// visit, not on every internal navigation.
export const IntroTransition: React.FC = () => {
  const { colors, identity } = brandConfig;
  const [visible, setVisible] = useState(() => !sessionStorage_safeGet());

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setVisible(false);
      try {
        window.sessionStorage.setItem('amplify-intro-seen', '1');
      } catch {
        /* sessionStorage unavailable — fine, intro just replays */
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [visible]);

  function sessionStorage_safeGet(): boolean {
    try {
      return window.sessionStorage.getItem('amplify-intro-seen') === '1';
    } catch {
      return false;
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ backgroundColor: colors.primary }}
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="font-display text-2xl sm:text-4xl font-semibold tracking-wide"
            style={{ color: colors.background }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {identity.name}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
