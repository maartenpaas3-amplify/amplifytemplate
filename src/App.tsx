import React, { useState } from 'react';
import { brandConfig } from './config/brand.config';
import { cssVarsFromBrand } from './config/theme';
import { CartProvider } from './components/cart/CartContext';
import { Header } from './components/layout/Header';
import { CategoryNav } from './components/layout/CategoryNav';
import { MenuSection } from './components/menu/MenuSection';
import { ItemModal } from './components/menu/ItemModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { Footer } from './components/layout/Footer';
import { ParallaxHero } from './components/wow/ParallaxHero';
import { EditorialMoment } from './components/wow/EditorialMoment';
import { CustomCursor } from './components/wow/CustomCursor';
import { IntroTransition } from './components/wow/IntroTransition';
import { SignatureSpotlight } from './components/wow/SignatureSpotlight';
import { categories, menuItems } from './data/menu.example'; // -> switch to './data/menu' per client
import type { Language, MenuItem } from './types';

// App.tsx wires Layer 1 (fixed) + Layer 2 (brand.config data) + Layer 3
// (the wow modules picked in brand.config.wowModules) together. This file
// may need small edits when adding/removing wow modules for a client, but
// the component implementations it imports never change.
export default function App() {
  const [language, setLanguage] = useState<Language>(brandConfig.languages.default);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [openItem, setOpenItem] = useState<MenuItem | null>(null);

  const signatureItem = menuItems.find((i) => i.signature);
  const wow = brandConfig.wowModules;

  // Guard, not just a comment: parallaxHero and signatureSpotlight are both
  // full-bleed "big photo + big headline" blocks. Stacking them reads as
  // two hero sections in a row — heavy and repetitive. If a client's config
  // has both, parallaxHero wins (it's the page opener) and signatureSpotlight
  // is skipped automatically instead of silently producing a bloated page.
  const showParallaxHero = wow.includes('parallaxHero');
  const showSignatureSpotlight = wow.includes('signatureSpotlight') && !showParallaxHero;

  const scrollToMenu = () => {
    document.getElementById(`cat-${categories[0]?.id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div style={cssVarsFromBrand(brandConfig.colors) as React.CSSProperties}>
        {wow.includes('introTransition') && <IntroTransition />}
        {wow.includes('customCursor') && <CustomCursor />}

        <Header language={language} setLanguage={setLanguage} />

        {showParallaxHero && <ParallaxHero language={language} onCtaClick={scrollToMenu} />}

        {showSignatureSpotlight && signatureItem && (
          <SignatureSpotlight item={signatureItem} language={language} onAdd={() => setOpenItem(signatureItem)} />
        )}

        <CategoryNav
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelect={(id) => {
            setActiveCategoryId(id);
            document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth' });
          }}
          language={language}
        />

        <MenuSection categories={categories.slice(0, 1)} items={menuItems} language={language} onOpenItem={setOpenItem} />

        {wow.includes('editorialMoment') && <EditorialMoment language={language} signatureItem={signatureItem} />}

        <MenuSection categories={categories.slice(1)} items={menuItems} language={language} onOpenItem={setOpenItem} />

        <Footer language={language} onViewMenuClick={scrollToMenu} />

        <ItemModal item={openItem} language={language} onClose={() => setOpenItem(null)} />
        <CartDrawer language={language} />
      </div>
    </CartProvider>
  );
}
