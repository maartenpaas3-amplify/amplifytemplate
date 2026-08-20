// ============================================================================
// AMPLIFY MENU ENGINE — brand.config.ts
//
// THIS IS THE ONLY FILE YOU EDIT PER CLIENT.
// Every value a new restaurant needs — identity, colors, fonts, hero, menu
// reference, contact, active wow module — lives here. Layer 1 components
// (src/components/layout, src/components/menu, src/components/cart) must
// never contain a hardcoded color, phone number or piece of copy: they all
// read from this object. Change a restaurant's entire look and content by
// editing this one file and swapping src/data/menu.ts — nothing else.
//
// Workflow for a new client:
//   1. Fork the boilerplate repo, import into Google AI Studio.
//   2. Duplicate src/data/menu.example.ts -> src/data/menu.ts, fill it in.
//   3. Fill in every field below with the client's real info.
//   4. Pick ONE, at most TWO, wowModules — that's the "twist" for this client.
//   5. Do not touch anything under src/components/layout|menu|cart.
// ============================================================================

import type { Language, WowModuleId } from '../types';

export interface BrandConfig {
  identity: {
    name: string;
    tagline: LocalizedTagline;
    logoSrc: string;
    faviconSrc: string;
    city: string;
    country: string;
    // Optional: the live URL once the client is published (e.g. the Cloud
    // Run URL from AI Studio, or a custom domain). Used to make the SEO/
    // Open Graph tags (see vite-plugins/seo-html.ts) absolute instead of
    // relative — WhatsApp/Facebook link previews need an absolute image
    // URL to reliably render a preview card. Leave empty until the site is
    // actually published; tags degrade gracefully (relative URLs) without it.
    siteUrl?: string;
  };

  colors: {
    // Full token scale, not just "a primary color" — this is what keeps
    // every project feeling designed instead of default-Tailwind-blue.
    primary: string; // brand's dominant color, used for CTAs, active states
    primaryDark: string;
    accent: string; // secondary highlight color, used sparingly
    background: string; // page base
    surface: string; // cards, drawers, modals
    surfaceMuted: string;
    textPrimary: string;
    textMuted: string;
    border: string;
    success: string;
    danger: string;
  };

  typography: {
    // Exactly two fonts. More than two is how "high-end" turns into "busy".
    displayFont: string; // headlines, hero, editorial moments
    bodyFont: string; // everything else
    displayWeight: number;
  };

  hero: {
    headline: LocalizedTagline;
    subheadline: LocalizedTagline;
    ctaLabel: LocalizedTagline;
    backgroundType: 'image' | 'video';
    backgroundSrc: string;
    backgroundSrcMobile?: string;
  };

  languages: {
    default: Language;
    enabled: Language[];
  };

  contact: {
    whatsappNumber: string; // digits only, country code, no + or spaces e.g. "212612345678"
    phoneDisplay: string;
    address: string;
    mapsUrl?: string;
    openingHours: LocalizedTagline;
    instagramUrl?: string;
  };

  ordering: {
    diningOptionsEnabled: ('dine_in' | 'takeaway' | 'delivery')[];
    currency: string; // e.g. "MAD", "EUR"
  };

  // Layer 3 — pick 1, max 2. This is the deliberate constraint that keeps
  // every client site feeling distinct without the engine ever forking.
  wowModules: WowModuleId[];
}

interface LocalizedTagline {
  fr: string;
  ar?: string;
  en?: string;
}

// ----------------------------------------------------------------------------
// EXAMPLE VALUES — replace entirely per client. Kept realistic (Moroccan
// restaurant, WhatsApp ordering) so a new project starts from a working
// reference instead of a blank/placeholder set of values.
// ----------------------------------------------------------------------------
export const brandConfig: BrandConfig = {
  identity: {
    name: 'Nom du Restaurant',
    tagline: { fr: 'Une expérience culinaire', ar: 'تجربة طهي', en: 'A culinary experience' },
    logoSrc: '/brand/logo.svg',
    faviconSrc: '/brand/favicon.svg',
    city: 'Casablanca',
    country: 'Maroc',
    siteUrl: '', // e.g. 'https://indian-spice-rabat.a.run.app' once published
  },

  colors: {
    primary: '#C8102E',
    primaryDark: '#8F0B20',
    accent: '#C9A15A',
    background: '#0B0B0C',
    surface: '#131315',
    surfaceMuted: '#1A1A1E',
    textPrimary: '#F3ECDD',
    textMuted: '#9A9490',
    border: 'rgba(243, 236, 221, 0.12)',
    success: '#3FA34D',
    danger: '#C8102E',
  },

  typography: {
    displayFont: "'Bodoni Moda', serif",
    bodyFont: "'Inter', sans-serif",
    displayWeight: 700,
  },

  hero: {
    headline: { fr: 'Le goût, sans compromis.', en: 'Flavor, without compromise.' },
    subheadline: {
      fr: 'Commandez directement, ça arrive sur notre écran en cuisine.',
      en: 'Order directly — it lands straight on our kitchen screen.',
    },
    ctaLabel: { fr: 'Voir le menu', en: 'View menu' },
    backgroundType: 'image',
    backgroundSrc: '/brand/hero-desktop.jpg',
    backgroundSrcMobile: '/brand/hero-mobile.jpg',
  },

  languages: {
    default: 'fr',
    enabled: ['fr', 'ar', 'en'],
  },

  contact: {
    whatsappNumber: '212600000000', // ⚠ REPLACE with the real restaurant number before going live
    phoneDisplay: '+212 6 00 00 00 00',
    address: 'Casablanca, Maroc',
    openingHours: { fr: 'Ouvert 12:00 - 23:30', en: 'Open 12:00 PM - 11:30 PM' },
  },

  ordering: {
    diningOptionsEnabled: ['dine_in', 'takeaway', 'delivery'],
    currency: 'MAD',
  },

  wowModules: ['parallaxHero', 'editorialMoment'],
};
