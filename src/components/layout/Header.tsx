import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { brandConfig } from '../../config/brand.config';
import { BasketIcon } from '../ui/BasketIcon';
import { useCart } from '../cart/CartContext';
import type { Language } from '../../types';

// No `identity.logoSrc` in this component at all — that's deliberate. A
// client-supplied logo file varies wildly in quality (badly cropped,
// low-res, wrong aspect ratio) and the moment one of those sits in an
// otherwise considered typographic system, it drags the whole header back
// down to "generic restaurant site". So the studio's identity mark is
// ALWAYS typography, never a raster file — same quality on every client,
// no dependency on what gets uploaded. Pure wordmark, no icon: the first
// letter gets a slightly bolder/accent treatment (a quiet lettrine, not a
// separate graphic element) instead of adding a new shape to the header.

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LANG_LABEL: Record<Language, string> = { fr: 'FR', ar: 'AR', en: 'EN' };

// Fixed engine component.
//
// v2 — "minimal wordmark bar". The previous version (logo in a circle,
// language in a filled pill, cart in a bordered/filled pill with a stock
// shopping-bag icon) is the single most common restaurant-site header
// pattern that exists. No amount of recoloring made it feel bespoke,
// because the STRUCTURE was generic, not the color. This version removes
// every circle, pill and color-block from the chrome itself: logo is a
// plain text monogram (no ring), language is a bare text control, and the
// cart is icon+total as plain text with a custom-drawn basket glyph
// instead of the generic lucide ShoppingBag — no icon-in-a-circle left
// anywhere. The header is now just type and line-icons on the bar, nothing
// competing for attention with the actual content below it.
//
// Mobile-overflow contract unchanged: fixed row height, flex-nowrap on the
// main row, min-w-0 + truncate on the brand name, shrink-0 on every
// control, single compact language control on mobile instead of 3 spelled
// out options.
export const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const { count, totalMAD, openDrawer, bumpTrigger } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangMenuOpen(false);
    };
    if (langMenuOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [langMenuOpen]);

  const { identity, colors, languages } = brandConfig;
  const multiLang = languages.enabled.length > 1;

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      style={{ backgroundColor: `${colors.surface}F2`, borderBottom: `1px solid ${colors.border}` }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 sm:h-20 flex items-center justify-between gap-2 flex-nowrap">
        <a
          href="#top"
          className="flex items-baseline min-w-0 shrink"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {/* Lettrine: the first letter set larger, in the accent color —
              a quiet typographic mark instead of a separate icon/logo. */}
          <span className="font-display font-bold text-2xl sm:text-[1.75rem] leading-none shrink-0" style={{ color: colors.accent }}>
            {identity.name.charAt(0).toUpperCase()}
          </span>
          <span
            className="font-display font-semibold text-base sm:text-lg truncate ml-0.5"
            style={{ color: colors.textPrimary }}
          >
            {identity.name.slice(1)}
          </span>
        </a>

        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {multiLang && (
            <div className="relative shrink-0" ref={langRef}>
              <button
                onClick={() => setLangMenuOpen((v) => !v)}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide"
                style={{ color: colors.textPrimary }}
              >
                {LANG_LABEL[language]}
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {langMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-32 rounded-xl shadow-xl py-1 z-50 animate-fadeIn"
                  style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
                >
                  {languages.enabled.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between"
                      style={{ color: language === lang ? colors.accent : colors.textMuted }}
                    >
                      {LANG_LABEL[lang]}
                      {language === lang && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart: plain icon + total as text, no pill/border/fill at rest.
              The custom basket glyph (not the stock lucide bag) is what
              actually addresses "I don't like that icon" — recoloring the
              old one wasn't going to fix that, it needed to be a different
              icon. A small bump animation on add is the only motion. */}
          <motion.button
            key={bumpTrigger}
            whileTap={{ scale: 0.92 }}
            initial={bumpTrigger > 0 ? { scale: 1.25 } : false}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 12 }}
            onClick={openDrawer}
            className="relative flex items-center gap-2 font-bold shrink-0"
            style={{ color: colors.accent }}
          >
            <div className="relative">
              <BasketIcon className="w-5 h-5" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-2 -right-2 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent, color: colors.background }}
                >
                  {count}
                </motion.span>
              )}
            </div>
            <span className="hidden sm:inline text-sm whitespace-nowrap" style={{ color: colors.textPrimary }}>
              {totalMAD} {brandConfig.ordering.currency}
            </span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
