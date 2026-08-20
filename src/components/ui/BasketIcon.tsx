import React from 'react';

interface BasketIconProps {
  className?: string;
}

// A bespoke line-art mandje/basket glyph, replacing the generic lucide
// ShoppingBag everywhere in the header. Stroke-based to match the weight of
// the other icons (Phone, MapPin, etc.), but the woven cross-lines and the
// gently tapered trapezoid body are drawn to feel handmade rather than a
// stock app icon — no amount of recoloring fixes a generic icon, it needs
// to actually be a different shape.
export const BasketIcon: React.FC<BasketIconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5.5 10 L7 20.5 a1.4 1.4 0 0 0 1.4 1.2 h7.2 a1.4 1.4 0 0 0 1.4-1.2 L18.5 10" />
    <path d="M4.5 10 H19.5" />
    <path d="M8.5 10 C8.5 6.5 10 4.5 12 4.5 C14 4.5 15.5 6.5 15.5 10" />
    <path d="M9.3 13 L10 18" />
    <path d="M14.7 13 L14 18" />
    <path d="M12 13 V18.5" />
  </svg>
);
