import React from 'react';
import { motion } from 'motion/react';
import { brandConfig } from '../../config/brand.config';
import type { Language, MenuItem } from '../../types';

interface SignatureSpotlightProps {
  item: MenuItem;
  language: Language;
  onAdd: (item: MenuItem) => void;
}

// Wow module (Layer 3): "signatureSpotlight". Full-bleed, dramatic feature
// for the one dish a restaurant wants to sell hardest — big image, floating
// price tag, direct add action.
//
// ⚠ PAIRING RULE: never combine this with "parallaxHero". Both are
// full-bleed "big photo + big headline" blocks — stacked back to back they
// read as two hero sections in a row (heavy, repetitive), which is exactly
// the "too big / too much" feeling a client will flag. Pick ONE big visual
// statement (parallaxHero OR signatureSpotlight), and pair it with a
// different-flavor module (editorialMoment, customCursor, introTransition)
// if a second one is wanted.
export const SignatureSpotlight: React.FC<SignatureSpotlightProps> = ({ item, language, onAdd }) => {
  const { colors, ordering } = brandConfig;
  const name = item.name[language] ?? item.name.fr;
  const description = item.description?.[language] ?? item.description?.fr;

  return (
    <section className="relative w-full h-[50vh] min-h-[340px] max-h-[440px] overflow-hidden flex items-center">
      <img src={item.image} alt={name} className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, ${colors.background}F2 25%, ${colors.background}33 70%)` }}
      />

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md px-6 sm:px-12"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: colors.accent }}>
          Signature
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-[1.05] mt-2" style={{ color: colors.textPrimary }}>
          {name}
        </h2>
        {description && (
          <p className="mt-3 text-sm sm:text-base" style={{ color: colors.textMuted }}>
            {description}
          </p>
        )}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            {item.priceMAD} {ordering.currency}
          </span>
          <button
            onClick={() => onAdd(item)}
            className="px-6 py-3 rounded-full font-bold text-sm"
            style={{ backgroundColor: colors.accent, color: colors.background }}
          >
            {language === 'fr' ? 'Ajouter au panier' : language === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}
          </button>
        </div>
      </motion.div>
    </section>
  );
};
