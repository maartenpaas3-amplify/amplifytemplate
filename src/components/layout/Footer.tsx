import React from 'react';
import { MapPin, Phone, Instagram, Clock } from 'lucide-react';
import { brandConfig } from '../../config/brand.config';
import { MagneticButton } from '../ui/MagneticButton';
import type { Language } from '../../types';

interface FooterProps {
  language: Language;
  onViewMenuClick: () => void;
}

// Fixed engine component. Same skeleton and visual language on every client
// site — icon badges match the "circle accent" language used in ItemCard's
// add button, so the footer reads as part of the same design system instead
// of a bare afterthought.
//
// Deliberately NO direct WhatsApp button here. The only correct order flow
// is: browse menu -> add items to cart -> checkout drawer -> WhatsApp. A
// shortcut that opens WhatsApp straight from the footer skips dish
// selection, which breaks how the restaurant wants orders to arrive. The
// footer CTA only ever scrolls back to the menu.
export const Footer: React.FC<FooterProps> = ({ language, onViewMenuClick }) => {
  const { identity, colors, contact } = brandConfig;

  const IconBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: colors.surfaceMuted, color: colors.accent }}
    >
      {children}
    </span>
  );

  return (
    <footer style={{ backgroundColor: colors.surface, borderTop: `1px solid ${colors.border}` }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid sm:grid-cols-3 gap-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: colors.accent }}>
            {identity.city}
          </span>
          <h3 className="font-display text-2xl font-semibold mt-1.5" style={{ color: colors.textPrimary }}>
            {identity.name}
          </h3>
          <p className="text-sm mt-2 max-w-xs" style={{ color: colors.textMuted }}>
            {identity.tagline[language] ?? identity.tagline.fr}
          </p>

          <div className="mt-5 inline-block">
            <MagneticButton
              onClick={onViewMenuClick}
              glowColor={colors.accent}
              showArrow={false}
              className="px-4 py-2.5 text-sm font-bold"
            >
              {language === 'fr' ? 'Voir le menu' : language === 'ar' ? 'شاهد القائمة' : 'View menu'}
            </MagneticButton>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <IconBadge>
              <MapPin className="w-4 h-4" />
            </IconBadge>
            <span className="text-sm pt-1.5" style={{ color: colors.textMuted }}>
              {contact.address}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <IconBadge>
              <Phone className="w-4 h-4" />
            </IconBadge>
            <span className="text-sm pt-1.5 font-mono" style={{ color: colors.textMuted }}>
              {contact.phoneDisplay}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <IconBadge>
              <Clock className="w-4 h-4" />
            </IconBadge>
            <span className="text-sm pt-1.5" style={{ color: colors.textMuted }}>
              {contact.openingHours[language] ?? contact.openingHours.fr}
            </span>
          </div>
        </div>

        <div className="flex sm:flex-col sm:items-end items-start gap-3">
          {contact.instagramUrl && (
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={{ backgroundColor: colors.surfaceMuted, color: colors.textMuted }}
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${colors.border}` }}>
        <p className="text-center text-[11px] py-4" style={{ color: colors.textMuted }}>
          {identity.name} · {new Date().getFullYear()} · Built by Amplify Growth Studio
        </p>
      </div>
    </footer>
  );
};
