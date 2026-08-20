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
// v3 — "minimal wordmark bar, with weight from behavior instead of a mark".
// v2 stripped every circle/pill/logo from the chrome, which was the right
// call — but left in a static, always-solid bar that read as flat/bare
// against the rest of the site. v3 keeps the exact same content (no logo,
// no icon returns) and instead gives the header presence through how it
// BEHAVES in the page: it starts fully transparent, sitting directly on
// top of the hero photo with no bar at all, then gains a soft blurred
// surface + hairline the moment you scroll past it — the header earns its
// materiality instead of it being printed on statically. A thin gold
// scroll-progress line under the bar is the one other addition: it fills
// left-to-right as you move through the page, a quiet functional detail
// rather than decoration.
//
// Mobile-overflow contract unchanged: fixed row height, flex-nowrap on the
// main row, min-w-0 + truncate on the brand name, shrink-0 on every
// control, single compact language control on mobile instead of 3 spelled
// out options.
export const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const { count, totalMAD, openDrawer, bumpTrigger } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
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
      className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'backdrop-blur-md shadow-lg' : ''}`}
      style={{
        backgroundColor: scrolled ? `${colors.surface}F2` : 'transparent',
        borderBottom: `1px solid ${scrolled ? colors.border : 'transparent'}`,
      }}
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

      {/* Scroll-progress hairline: fills left-to-right with how far you are
          into the page. Purely functional, but it's also the one bit of
          motion the header owns at all times — a quiet reward for
          engagement instead of a static bar that never changes. */}
      <div className="h-px w-full transition-colors duration-300" style={{ backgroundColor: scrolled ? colors.border : 'transparent' }}>
        <div
          className="h-full"
          style={{ width: `${scrollPct * 100}%`, backgroundColor: colors.accent, transition: 'width 100ms linear' }}
        />
      </div>
    </header>
  );
};
