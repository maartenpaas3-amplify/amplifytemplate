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

// v1 of the primary-button signature was this cut-corner silhouette. It's
// kept here (unused by MagneticButton now) in case a future client brand
// wants an alternate shape — the current signature move for primary CTAs
// (hero, footer, add-to-cart, checkout) is the page-fold press effect in
// MagneticButton.tsx: a calm button at rest, one deliberate motion on tap,
// instead of stacking a glow + ring + particles + nudge on top of a shape.
export const cutCornerClipPath = 'polygon(0% 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%)';

// Grain texture as an inline SVG data-uri (feTurbulence) — no image asset
// needed, works for every client. Shared by ParallaxHero's film-grain layer
// AND the global PaperTexture overlay, so both use the exact same noise
// rather than two similar-but-different textures.
export const grainSvgDataUri =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

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
// instead of importing brand.config directly everywhere. Also sets the
// `--font-display-runtime` / `--font-body-runtime` vars that index.css'
// `--font-display` / `--font-body` read from — without this, changing
// typography.displayFont/bodyFont in brand.config.ts silently did nothing,
// because nothing ever wrote those runtime vars. Call with both colors and
// typography (see App.tsx) to keep font changes a one-file edit.
export function cssVarsFromBrand(
  colors: Record<string, string>,
  typography?: { displayFont: string; bodyFont: string }
): Record<string, string> {
  const vars: Record<string, string> = {};
  if (typography) {
    vars['--font-display-runtime'] = typography.displayFont;
    vars['--font-body-runtime'] = typography.bodyFont;
  }
  for (const [key, value] of Object.entries(colors)) {
    const kebab = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    vars[`--color-${kebab}`] = value;
  }
  return vars;
}
