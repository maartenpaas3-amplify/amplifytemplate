import React, { useState } from 'react';
import { brandConfig } from './config/brand.config';
import { cssVarsFromBrand } from './config/theme';
import { CartProvider } from './components/cart/CartContext';
import { Header } from './components/layout/Header';
import { CategoryNav } from './components/layout/CategoryNav';
import { MenuSection } from './components/menu/MenuSection';
import { ItemModal } from './components/menu/ItemModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { FloatingCartBar } from './components/cart/FloatingCartBar';
import { Footer } from './components/layout/Footer';
import { ParallaxHero } from './components/wow/ParallaxHero';
import { EditorialMoment } from './components/wow/EditorialMoment';
import { CustomCursor } from './components/wow/CustomCursor';
import { IntroTransition } from './components/wow/IntroTransition';
import { SignatureSpotlight } from './components/wow/SignatureSpotlight';
import { PaperTexture } from './components/ui/PaperTexture';
import { OrnamentDivider } from './components/ui/OrnamentDivider';
import { categories, menuItems } from './data/menu.example'; // -> switch to './data/menu' per client
import type { Language, MenuItem } from './types';

// App.tsx wires Layer 1 (fixed) + Layer 2 (brand.config data) + Layer 3
// (the wow modules picked in brand.config.wowModules) together. This file
// may need small edits when adding/removing wow modules for a client, but
// the component implementations it imports never change.
//
// Menu browsing model: ONE category filtered at a time (tap a tab, the
// grid reflows) instead of one long page stacking every category — see
// CategoryNav + MenuSection. EditorialMoment therefore sits once, right
// after the hero, rather than sandwiched mid-scroll between categories.
export default function App() {
  const [language, setLanguage] = useState<Language>(brandConfig.languages.default);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [openItem, setOpenItem] = useState<MenuItem | null>(null);

  const signatureItem = menuItems.find((i) => i.signature);
  const wow = brandConfig.wowModules;
  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? categories[0];
  const activeItems = menuItems.filter((i) => i.categoryId === activeCategory?.id);

  // Guard, not just a comment: parallaxHero and signatureSpotlight are both
  // full-bleed "big photo + big headline" blocks. Stacking them reads as
  // two hero sections in a row — heavy and repetitive. If a client's config
  // has both, parallaxHero wins (it's the page opener) and signatureSpotlight
  // is skipped automatically instead of silently producing a bloated page.
  const showParallaxHero = wow.includes('parallaxHero');
  const showSignatureSpotlight = wow.includes('signatureSpotlight') && !showParallaxHero;

  const menuAnchorRef = React.useRef<HTMLDivElement>(null);
  const scrollToMenu = () => menuAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <CartProvider>
      <div style={cssVarsFromBrand(brandConfig.colors, brandConfig.typography) as React.CSSProperties}>
        <PaperTexture />
        {wow.includes('introTransition') && <IntroTransition />}
        {wow.includes('customCursor') && <CustomCursor />}

        <Header language={language} setLanguage={setLanguage} />

        {showParallaxHero && <ParallaxHero language={language} onCtaClick={scrollToMenu} />}

        {showSignatureSpotlight && signatureItem && (
          <SignatureSpotlight item={signatureItem} language={language} onAdd={() => setOpenItem(signatureItem)} />
        )}

        {wow.includes('editorialMoment') && <EditorialMoment language={language} signatureItem={signatureItem} />}

        <div ref={menuAnchorRef} />
        <CategoryNav
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={setActiveCategoryId}
          language={language}
        />

        {activeCategory && (
          <MenuSection category={activeCategory} items={activeItems} language={language} onOpenItem={setOpenItem} />
        )}

        <OrnamentDivider color={brandConfig.colors.accent} height={16} opacity={0.8} />
        <Footer language={language} onViewMenuClick={scrollToMenu} />

        <ItemModal item={openItem} language={language} onClose={() => setOpenItem(null)} />
        <CartDrawer language={language} />
        <FloatingCartBar language={language} />
      </div>
    </CartProvider>
  );
}
