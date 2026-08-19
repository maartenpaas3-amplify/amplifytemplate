import React from 'react';
import { motion } from 'motion/react';
import { brandConfig } from '../../config/brand.config';
import type { Language, MenuCategory } from '../../types';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
  language: Language;
}

// Fixed engine component. Sticky under the header, horizontally scrollable
// on mobile. Same on every client site — only the category list (from
// src/data/menu.ts) changes.
//
// Underline tabs instead of filled pills — reserves the studio's "filled
// pill" shape language for primary action buttons only (see
// MagneticButton / theme.ts cutCornerClipPath), so category selection
// reads as navigation, not as another button competing for attention.
// The underline itself is a single shared element (motion layoutId) that
// slides between tabs instead of popping.
export const CategoryNav: React.FC<CategoryNavProps> = ({ categories, activeCategoryId, onSelect, language }) => {
  const { colors } = brandConfig;

  return (
    <nav
      // Offsets must match Header.tsx's real rendered height: h-16 (4rem) on
      // mobile where the status strip is hidden, h-20 (5rem) + the ~1.5rem
      // status strip on desktop. Update both together if Header's height
      // classes ever change.
      className="sticky z-30 top-16 sm:top-[6.5rem] relative"
      style={{ backgroundColor: colors.background, borderBottom: `1px solid ${colors.border}` }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const active = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="relative py-3.5 text-sm font-semibold whitespace-nowrap transition-colors shrink-0"
              style={{ color: active ? colors.textPrimary : colors.textMuted }}
            >
              {cat.label[language] ?? cat.label.fr}
              {active && (
                <motion.span
                  layoutId="category-underline"
                  className="absolute left-0 right-0 -bottom-px h-[2.5px] rounded-full"
                  style={{ backgroundColor: colors.accent }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Scroll affordance: a soft fade on the right edge so a cut-off tab
          reads as "swipe for more" instead of "this is broken". Fixed
          engine detail, applies to every client automatically. */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-10"
        style={{ background: `linear-gradient(90deg, transparent, ${colors.background})` }}
      />
    </nav>
  );
};
