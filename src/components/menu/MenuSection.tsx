import React from 'react';
import { ItemCard } from './ItemCard';
import { brandConfig } from '../../config/brand.config';
import type { Language, MenuCategory, MenuItem } from '../../types';

interface MenuSectionProps {
  categories: MenuCategory[];
  items: MenuItem[];
  language: Language;
  onOpenItem: (item: MenuItem) => void;
}

// Fixed engine component. Groups items by category and renders the grid.
// Category order and item order come straight from src/data/menu.ts.
// Each category heading gets a small accent-colored eyebrow + item count —
// the same two-tone editorial pattern used in the hero — so the menu reads
// as designed rather than a plain list dump.
export const MenuSection: React.FC<MenuSectionProps> = ({ categories, items, language, onOpenItem }) => {
  const { colors } = brandConfig;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">
      {categories.map((cat) => {
        const catItems = items.filter((i) => i.categoryId === cat.id);
        if (catItems.length === 0) return null;
        return (
          <section key={cat.id} id={`cat-${cat.id}`}>
            <div className="flex items-baseline justify-between mb-5 pb-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
              <div>
                <span
                  className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-1"
                  style={{ color: colors.accent }}
                >
                  Menu
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold" style={{ color: colors.textPrimary }}>
                  {cat.label[language] ?? cat.label.fr}
                </h2>
              </div>
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
                {String(catItems.length).padStart(2, '0')}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {catItems.map((item) => (
                <ItemCard key={item.id} item={item} language={language} onOpen={onOpenItem} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
