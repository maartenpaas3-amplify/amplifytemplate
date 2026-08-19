// ============================================================================
// theme.ts — the "same system, every time" contract for motion & spacing.
// Colors/fonts come from brand.config.ts (they vary per client). Everything
// in here stays fixed across every project — it's what makes a Japoneza site
// and a Café Crème site feel like they came from the same studio even though
// they look completely different.
// ============================================================================

export const motionTokens = {
  fast: 0.18,
  base: 0.32,
  slow: 0.56,
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: 'spring' as const, stiffness: 260, damping: 24 },
};

export const radiusTokens = {
  sm: '0.375rem',
  md: '0.75rem',
  lg: '1.25rem',
  pill: '999px',
};

// The studio's signature shape for PRIMARY action buttons (hero CTA, "add
// to cart", "view menu"). Every generic template uses a plain rounded pill
// for everything — this cut corner is what makes the action button
// recognizably "Amplify" instead of "default UI library" at a glance, and
// doubles as a visual cue: "this specific shape = the thing that moves you
// forward". Icon-only controls (cart icon, language switch) stay circular
// on purpose — the cut shape is reserved for primary actions so it keeps
// its meaning instead of being applied everywhere and becoming noise.
export const cutCornerClipPath = 'polygon(0% 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%)';

export const shadowTokens = {
  card: '0 10px 40px rgba(0,0,0,0.35)',
  drawer: '0 10px 40px rgba(0,0,0,0.9)',
  floating: '0 8px 24px rgba(0,0,0,0.45)',
};

export const layoutTokens = {
  maxWidth: '80rem', // 7xl
  headerHeightMobile: '4rem',
  headerHeightDesktop: '5rem',
};

// CSS custom properties injected at runtime from brand.config.ts, so
// components can use `var(--color-primary)` in Tailwind arbitrary values
// instead of importing brand.config directly everywhere.
export function cssVarsFromBrand(colors: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    const kebab = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    vars[`--color-${kebab}`] = value;
  }
  return vars;
}
