import type { Plugin } from 'vite';
import { brandConfig } from '../src/config/brand.config';
// NOTE: keep this import in sync with src/App.tsx's menu import. When you
// switch App.tsx from './data/menu.example' to the real './data/menu' for
// a client, update this import too — otherwise the SEO/structured-data tags
// will describe the placeholder menu instead of the real one.
import { categories, menuItems } from '../src/data/menu.example';

// Fixed engine piece, not something you touch per client (everything it
// needs already comes from brand.config.ts + the menu data). Runs at BUILD
// time (transformIndexHtml), not in the browser — this matters because
// link-preview bots (WhatsApp, Facebook, Twitter/X) and some search
// crawlers do NOT execute JavaScript, they only read the static HTML that
// gets served. Injecting these tags via React at runtime would make them
// invisible to exactly the bots that matter most for a WhatsApp-ordering
// restaurant site. Doing it here means they're present in the actual
// deployed index.html, no JS execution required.
//
// Adds three things, all generated, nothing hand-written per client:
//   1. <title> + meta description — what shows in a Google result.
//   2. Open Graph + Twitter Card tags — what shows in a WhatsApp/Facebook/
//      X link preview when someone shares the restaurant's link.
//   3. schema.org Restaurant + Menu JSON-LD structured data — lets Google
//      show rich results (menu, price range, address) directly in search,
//      not just a blue link.
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function toAbsolute(siteUrl: string | undefined, path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (!siteUrl) return path; // degrades to relative — still valid, just not ideal for link previews
  return `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function seoHtmlPlugin(): Plugin {
  return {
    name: 'amplify-seo-html',
    // Also emit robots.txt + sitemap.xml at build time instead of committing
    // static files under public/ — this way they always match whatever
    // identity.siteUrl currently is in brand.config.ts instead of silently
    // going stale after the client's real domain is set.
    generateBundle() {
      const { identity } = brandConfig;
      const siteUrl = identity.siteUrl || '';

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml\n` : ''}`,
      });

      if (siteUrl) {
        const loc = siteUrl.replace(/\/$/, '') + '/';
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${loc}</loc></url></urlset>\n`,
        });
      }
      // No siteUrl yet (fresh/demo project): robots.txt still gets written
      // (harmless, allows crawling), sitemap.xml is skipped rather than
      // emitted with a wrong/relative loc — a sitemap needs an absolute URL
      // to mean anything.
    },
    transformIndexHtml(html) {
      const { identity, hero, contact, ordering } = brandConfig;
      const title = `${identity.name} — ${identity.city}`;
      const description = (hero.subheadline.fr || identity.tagline.fr).slice(0, 160);
      const heroImage = toAbsolute(identity.siteUrl, hero.backgroundSrc);
      const pageUrl = identity.siteUrl || '';

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: identity.name,
        image: heroImage,
        telephone: contact.phoneDisplay,
        address: {
          '@type': 'PostalAddress',
          streetAddress: contact.address,
          addressLocality: identity.city,
          addressCountry: identity.country,
        },
        servesCuisine: identity.tagline.fr,
        priceRange: ordering.currency,
        ...(pageUrl ? { url: pageUrl } : {}),
        hasMenu: {
          '@type': 'Menu',
          hasMenuSection: categories.map((category) => ({
            '@type': 'MenuSection',
            name: category.label.fr,
            hasMenuItem: menuItems
              .filter((item) => item.categoryId === category.id)
              .map((item) => ({
                '@type': 'MenuItem',
                name: item.name.fr,
                description: item.description?.fr,
                offers: {
                  '@type': 'Offer',
                  price: item.priceMAD,
                  priceCurrency: ordering.currency,
                },
              })),
          })),
        },
      };

      const injected = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="icon" href="${identity.faviconSrc}" />
    ${pageUrl ? `<link rel="canonical" href="${escapeHtml(pageUrl)}" />` : ''}

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(heroImage)}" />
    ${pageUrl ? `<meta property="og:url" content="${escapeHtml(pageUrl)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(heroImage)}" />

    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
`;

      return html.replace('<title>Amplify Menu Engine</title>', injected);
    },
  };
}
