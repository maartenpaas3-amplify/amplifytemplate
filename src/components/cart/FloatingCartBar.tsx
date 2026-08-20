import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { brandConfig } from '../../config/brand.config';
import { BasketIcon } from '../ui/BasketIcon';
import { useCart } from './CartContext';
import type { Language } from '../../types';

interface FloatingCartBarProps {
  language: Language;
}

// Fixed engine component, mobile only. The single biggest functional gap
// in the ordering flow: adding a dish had no persistent confirmation on
// screen — you had to scroll back up to the header to see what was in
// your cart. This bar appears the moment the cart goes from empty to
// non-empty, stays pinned above the thumb at all times while there's
// something to order, and disappears the moment the cart is emptied.
// Tapping it opens the same CartDrawer the header cart icon opens — one
// checkout flow, just two ways to reach it.
export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ language }) => {
  const { count, totalMAD, openDrawer, isDrawerOpen } = useCart();
  const { colors, ordering } = brandConfig;

  const label = language === 'fr' ? 'Voir la commande' : language === 'ar' ? 'عرض الطلب' : 'View order';
  const itemsLabel =
    language === 'fr'
      ? `${count} ${count > 1 ? 'articles' : 'article'}`
      : language === 'ar'
        ? `${count} ${count > 1 ? 'عناصر' : 'عنصر'}`
        : `${count} ${count > 1 ? 'items' : 'item'}`;

  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 px-3 pointer-events-none" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      <AnimatePresence>
        {count > 0 && !isDrawerOpen && (
          <motion.button
            key="floating-cart"
            onClick={openDrawer}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="pointer-events-auto w-full max-w-md mx-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5"
            style={{
              backgroundColor: colors.accent,
              color: colors.background,
              boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)',
            }}
          >
            <span className="flex items-center gap-2.5 font-bold text-sm">
              <span className="relative">
                <BasketIcon className="w-5 h-5" />
                <span
                  className="absolute -top-2 -right-2 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.background, color: colors.accent }}
                >
                  {count}
                </span>
              </span>
              {itemsLabel} · {totalMAD} {ordering.currency}
            </span>
            <span className="font-bold text-sm whitespace-nowrap">{label} →</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
