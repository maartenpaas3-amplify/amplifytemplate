import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Globe, ChevronDown, Check } from 'lucide-react';
import { brandConfig } from '../../config/brand.config';
import { useCart } from '../cart/CartContext';
import type { Language } from '../../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LANG_LABEL: Record<Language, string> = { fr: 'FR', ar: 'AR', en: 'EN' };

// Fixed engine component. Merges the strongest patterns seen across the
// legacy projects (Japoneza's top status bar + language dropdown, Caribou's
// mobile/desktop split, Tempo's config-driven cart total) into ONE
// canonical version. Do not fork this per client — everything that should
// differ per client (colors, name, logo, languages) already comes from
// brand.config.ts.
//
// Mobile-overflow contract: this header must NEVER let its content wrap
// onto a second line, at any name length or any of the 3 languages active.
// That is enforced here by: (1) a fixed row height, (2) flex-nowrap on the
// main row, (3) min-w-0 + truncate on the brand name so IT shrinks first,
// (4) shrink-0 on every control, (5) a single compact language button with
// a dropdown on mobile instead of always showing 3 separate pills.
export const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const { count, totalMAD, openDrawer, bumpTrigger } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
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

  const { identity, colors, contact, languages } = brandConfig;
  const multiLang = languages.enabled.length > 1;

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      style={{ backgroundColor: `${colors.surface}F2`, borderBottom: `1px solid ${colors.border}` }}
    >
      {/* Status strip — desktop only, hidden on mobile so it never competes
          for width with the main row. */}
      <div
        className="hidden sm:flex justify-between items-center text-[11px] font-medium py-1 px-4 tracking-wide"
        style={{ backgroundColor: colors.primary, color: colors.background }}
      >
        <span className="uppercase tracking-wider text-[10px] font-semibold truncate">
          {identity.name} · {identity.city}
        </span>
        <span className="font-mono shrink-0">{contact.phoneDisplay}</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 sm:h-20 flex items-center justify-between gap-2 flex-nowrap">
        <a
          href="#top"
          className="flex items-center gap-2 min-w-0 shrink"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {/* A missing/broken logoSrc must NEVER show the browser's default
              broken-image icon + alt text — that eats width and pushed the
              restaurant name into a truncated "Indian Sp..." Fall back to a
              simple initial badge in the brand colors instead. This matters
              in practice: a client's real logo often isn't uploaded yet
              during the first build pass. */}
          {!logoFailed ? (
            <img
              src={identity.logoSrc}
              alt={identity.name}
              onError={() => setLogoFailed(true)}
              className="h-8 sm:h-9 w-8 sm:w-9 object-contain shrink-0"
            />
          ) : (
            <span
              className="h-8 sm:h-9 w-8 sm:w-9 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
              style={{ backgroundColor: colors.primary, color: colors.background }}
            >
              {identity.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span
            className="font-display font-semibold text-base sm:text-lg truncate"
            style={{ color: colors.textPrimary }}
          >
            {identity.name}
          </span>
        </a>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {multiLang && (
            <>
              {/* Mobile: single compact dropdown trigger, never 3 pills */}
              <div className="relative sm:hidden shrink-0" ref={langRef}>
                <button
                  onClick={() => setLangMenuOpen((v) => !v)}
                  className="h-9 px-2.5 rounded-full flex items-center gap-1 text-xs font-bold uppercase"
                  style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, border: `1px solid ${colors.border}` }}
                >
                  {LANG_LABEL[language]}
                  <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {langMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-32 rounded-xl shadow-xl py-1 z-50 animate-fadeIn"
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
                        style={{ color: language === lang ? colors.primary : colors.textMuted }}
                      >
                        {LANG_LABEL[lang]}
                        {language === lang && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop: full pill switcher, room for it here */}
              <div
                className="hidden sm:flex items-center rounded-full p-1 gap-0.5 shrink-0"
                style={{ backgroundColor: colors.surfaceMuted, border: `1px solid ${colors.border}` }}
              >
                <Globe className="w-3.5 h-3.5 ml-1.5" style={{ color: colors.textMuted }} />
                {languages.enabled.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className="px-2.5 py-1 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: language === lang ? colors.primary : 'transparent',
                      color: language === lang ? colors.background : colors.textMuted,
                    }}
                  >
                    {LANG_LABEL[lang]}
                  </button>
                ))}
              </div>
            </>
          )}

          <motion.button
            key={bumpTrigger}
            whileTap={{ scale: 0.95 }}
            initial={bumpTrigger > 0 ? { scale: 1.22 } : false}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 12 }}
            onClick={openDrawer}
            className="relative flex items-center gap-2 font-bold px-3 sm:px-4 py-2.5 rounded-full shadow-md shrink-0"
            style={{ backgroundColor: colors.primary, color: colors.background }}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-2 -right-2 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.background, color: colors.primary, border: `2px solid ${colors.primary}` }}
                >
                  {count}
                </motion.span>
              )}
            </div>
            <span className="hidden sm:inline text-sm whitespace-nowrap">
              {totalMAD} {brandConfig.ordering.currency}
            </span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
