import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { brandConfig } from '../../config/brand.config';
import { motionTokens } from '../../config/theme';
import { OrnamentDivider } from '../ui/OrnamentDivider';
import type { Language, MenuItem } from '../../types';

interface ItemCardProps {
  item: MenuItem;
  language: Language;
  onOpen: (item: MenuItem) => void;
  // Signature items span 2 cols/2 rows in the grid (see MenuSection) —
  // `large` switches the image to fill that taller space and bumps the
  // type scale slightly instead of just stretching the same small layout.
  large?: boolean;
  // A regular (non-signature) card that MenuSection has picked to run a
  // taller image on — see the comment there for why. Keeps the grid from
  // reading as a flat, uniform table of equal boxes on categories that
  // don't happen to have a signature item.
  tall?: boolean;
}

// Fixed engine component. Every menu item on every client site renders
// through this exact card. Two deliberate "professional, not flat" details:
// a visible elevation (real shadow + a faint top-highlight border so the
// card lifts off a dark page instead of blending into it), and the price
// rendered in the brand's accent color so it reads as a distinct, designed
// element rather than plain body text.
export const ItemCard: React.FC<ItemCardProps> = ({ item, language, onOpen, large = false, tall = false }) => {
  const { colors, ordering } = brandConfig;
  const name = item.name[language] ?? item.name.fr;
  const description = item.description?.[language] ?? item.description?.fr;

  return (
    <motion.button
      onClick={() => onOpen(item)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: motionTokens.base, ease: motionTokens.easeOut }}
      className="text-left rounded-2xl overflow-hidden flex flex-col w-full h-full"
      style={{
        backgroundColor: colors.surface,
        boxShadow: `0 1px 0 ${colors.textPrimary}14 inset, 0 16px 32px -12px rgba(0,0,0,0.55)`,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className={`w-full overflow-hidden relative ${large ? 'flex-1 min-h-[10rem]' : tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        {/* object-position: center keeps every card's crop anchored the same
            way regardless of how the source photo itself is composed, so a
            tightly-cropped ingredient shot and a wide plated shot still line
            up the same across a row instead of looking randomly offset. */}
        <img
          src={item.image}
          alt={name}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(0deg, ${colors.surface}CC 0%, transparent 35%)` }}
        />
        {item.signature && (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
            style={{ backgroundColor: colors.accent, color: colors.background }}
          >
            Signature
          </span>
        )}
        {/* Secondary tag badge (e.g. "Populaire", "Épicé") — gives EVERY
            category some visual variation, not just the one with a
            signature dish. Opposite corner from Signature so both can
            appear together without colliding. Outline style (not filled)
            so it reads as a lighter-weight callout than Signature. */}
        {item.tags?.[0] && (
          <span
            className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full backdrop-blur-sm"
            style={{ color: colors.textPrimary, border: `1px solid ${colors.textPrimary}55`, backgroundColor: `${colors.background}66` }}
          >
            {item.tags[0]}
          </span>
        )}
      </div>
      <div className={`flex flex-col gap-1.5 ${large ? 'p-5' : 'p-4'}`}>
        {/* The studio's one ornamental detail also marks the signature dish
            card, at small scale — the second (and last) place it appears. */}
        {large && <OrnamentDivider color={colors.accent} height={9} opacity={0.75} className="mb-0.5 max-w-[7rem]" />}
        <h3
          className={`font-display font-semibold leading-tight ${large ? 'text-xl sm:text-2xl' : 'text-[15px]'}`}
          style={{ color: colors.textPrimary }}
        >
          {name}
        </h3>
        {description && (
          <p className={`leading-relaxed ${large ? 'text-sm line-clamp-2 max-w-md' : 'text-xs line-clamp-2'}`} style={{ color: colors.textMuted }}>
            {description}
          </p>
        )}
        {/* Fixed-height row so the price text and the round + button sit on
            the exact same visual center line. A plain `items-center` still
            drifts a px or two because the text's line-box is taller than the
            circle, which reads as "not straight" next to each other. */}
        <div className={`mt-auto pt-2.5 flex items-center justify-between ${large ? 'h-10' : 'h-8'}`}>
          <span
            className={`font-bold leading-none flex items-center h-full ${large ? 'text-lg' : 'text-sm'}`}
            style={{ color: colors.accent }}
          >
            {item.priceMAD} {ordering.currency}
          </span>
          <span
            className={`rounded-full flex items-center justify-center shrink-0 transition-transform ${large ? 'w-10 h-10' : 'w-8 h-8'}`}
            style={{ backgroundColor: colors.accent, color: colors.background }}
          >
            <Plus className={large ? 'w-5 h-5' : 'w-4 h-4'} />
          </span>
        </div>
      </div>
    </motion.button>
  );
};
