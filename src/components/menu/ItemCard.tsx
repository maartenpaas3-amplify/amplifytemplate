import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { brandConfig } from '../../config/brand.config';
import { motionTokens } from '../../config/theme';
import type { Language, MenuItem } from '../../types';

interface ItemCardProps {
  item: MenuItem;
  language: Language;
  onOpen: (item: MenuItem) => void;
}

// Fixed engine component. Every menu item on every client site renders
// through this exact card. Two deliberate "professional, not flat" details:
// a visible elevation (real shadow + a faint top-highlight border so the
// card lifts off a dark page instead of blending into it), and the price
// rendered in the brand's accent color so it reads as a distinct, designed
// element rather than plain body text.
export const ItemCard: React.FC<ItemCardProps> = ({ item, language, onOpen }) => {
  const { colors, ordering } = brandConfig;
  const name = item.name[language] ?? item.name.fr;
  const description = item.description?.[language] ?? item.description?.fr;

  return (
    <motion.button
      onClick={() => onOpen(item)}
      whileHover={{ y: -5 }}
      transition={{ duration: motionTokens.base, ease: motionTokens.easeOut }}
      className="text-left rounded-2xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: colors.surface,
        boxShadow: `0 1px 0 ${colors.textPrimary}14 inset, 0 16px 32px -12px rgba(0,0,0,0.55)`,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img src={item.image} alt={name} className="w-full h-full object-cover" loading="lazy" />
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
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-display font-semibold text-[15px] leading-tight" style={{ color: colors.textPrimary }}>
          {name}
        </h3>
        {description && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: colors.textMuted }}>
            {description}
          </p>
        )}
        <div className="mt-auto pt-2.5 flex items-center justify-between">
          <span className="font-bold text-sm" style={{ color: colors.accent }}>
            {item.priceMAD} {ordering.currency}
          </span>
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform"
            style={{ backgroundColor: colors.primary, color: colors.background }}
          >
            <Plus className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.button>
  );
};
