import React from 'react';
import { motion } from 'motion/react';
import { brandConfig } from '../../config/brand.config';
import type { Language, MenuItem } from '../../types';

interface EditorialMomentProps {
  language: Language;
  signatureItem?: MenuItem;
}

// Wow module (Layer 3): "editorialMoment". One oversized-typography section
// placed between menu categories to break the grid rhythm — the "magazine
// spread" moment referenced by the inspiration images. Purely a visual
// anchor; if a signature item is passed it doubles as a soft upsell.
export const EditorialMoment: React.FC<EditorialMomentProps> = ({ language, signatureItem }) => {
  const { colors, identity } = brandConfig;

  return (
    // Not touching the hero itself, but this section directly follows it —
    // the old `py-16` top padding plus a whileInView reveal that only fires
    // once you'd scrolled it 80px into view meant this section could sit
    // fully rendered but still invisible right after the hero, reading as
    // dead black space instead of content. Tighter top padding on mobile
    // + firing the reveal as soon as any part is on screen (no negative
    // margin) fixes that without changing anything above this point.
    <section className="max-w-7xl mx-auto px-4 pt-8 pb-16 sm:py-16 grid sm:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: colors.accent }}>
          {identity.city}
        </span>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.05] mt-2" style={{ color: colors.textPrimary }}>
          {signatureItem?.name[language] ?? signatureItem?.name.fr ?? identity.name}
        </h2>
        {signatureItem?.description && (
          <p className="mt-4 text-sm sm:text-base max-w-md" style={{ color: colors.textMuted }}>
            {signatureItem.description[language] ?? signatureItem.description.fr}
          </p>
        )}
      </motion.div>

      {signatureItem && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl overflow-hidden aspect-[4/3]"
        >
          <img src={signatureItem.image} alt="" className="w-full h-full object-cover" />
        </motion.div>
      )}
    </section>
  );
};
