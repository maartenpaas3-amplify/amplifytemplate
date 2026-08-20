import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ItemCard } from './ItemCard';
import { brandConfig } from '../../config/brand.config';
import type { Language, MenuCategory, MenuItem } from '../../types';

interface MenuSectionProps {
  category: MenuCategory;
  items: MenuItem[];
  language: Language;
  onOpenItem: (item: MenuItem) => void;
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

// Fixed engine component. Renders ONE category at a time (filtered by
// App.tsx's activeCategoryId) instead of a long scrollable stack of every
// category — tapping a tab reflows the grid in place, closer to a native
// app than a webpage you scroll through. AnimatePresence crossfades the
// outgoing/incoming category; each card staggers in on a grid entrance.
//
// The grid is deliberately NOT uniform: the category's signature item (if
// present) spans 2 columns/2 rows so the layout has rhythm instead of a
// flat rows-of-equal-boxes grid, which is the single most generic pattern
// a food menu can use.
export const MenuSection: React.FC<MenuSectionProps> = ({ category, items, language, onOpenItem }) => {
  const { colors } = brandConfig;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[50vh]">
      <div className="flex items-baseline justify-between mb-5 pb-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: colors.accent }}>
            Menu
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold" style={{ color: colors.textPrimary }}>
            {category.label[language] ?? category.label.fr}
          </h2>
        </div>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
          {String(items.length).padStart(2, '0')}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={category.id}
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 auto-rows-[1fr]"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className={item.signature ? 'col-span-2 row-span-2' : undefined}
            >
              {/* Every 3rd non-signature card runs a taller image (see
                  ItemCard's `tall` prop) — a deterministic-but-not-uniform
                  rhythm so a category WITHOUT a signature item still has
                  visual variation instead of a flat grid of equal boxes. */}
              <ItemCard
                item={item}
                language={language}
                onOpen={onOpenItem}
                large={item.signature}
                tall={!item.signature && index % 3 === 1}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
