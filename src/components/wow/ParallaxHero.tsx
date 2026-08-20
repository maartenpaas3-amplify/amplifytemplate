import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { brandConfig } from '../../config/brand.config';
import { grainSvgDataUri } from '../../config/theme';
import { MagneticButton } from '../ui/MagneticButton';
import type { Language } from '../../types';

interface WowHeroProps {
  language: Language;
  onCtaClick: () => void;
}

const headlineVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.35 } },
};
const wordVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

// Wow module (Layer 3): "parallaxHero", now a genuinely distinct layout
// rather than a polished version of the most generic hero pattern that
// exists (centered text over a photo). Deliberate departures:
//   1. Asymmetric split on larger screens — a solid text panel + a photo
//      panel bleeding to the edge, instead of everything centered.
//   2. An opening reveal: two solid doors, meeting at the center, slide
//      apart to reveal the photo — instead of a flat directional wipe or
//      a plain fade/zoom. One bold, clean cinematic moment on load, then
//      completely still. (v2 tried finger-following light + drifting
//      steam here — reverted: both were too subtle to read as "wow" in a
//      static screenshot and added an ongoing gimmick instead of one
//      strong moment. This is deliberately the opposite: bold, then calm.)
//   3. The CTA is the studio's outline button (MagneticButton), not a
//      generic filled pill.
//   4. A designed scroll cue — a thin traveling dot on a vertical line —
//      instead of a stock chevron icon.
//   5. A subtle film-grain overlay for texture, tied to scroll position.
export const ParallaxHero: React.FC<WowHeroProps> = ({ language, onCtaClick }) => {
  const { hero, colors, identity } = brandConfig;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 140]);
  const grainOpacity = useTransform(scrollY, [0, 400], [0.06, 0.02]);
  const [revealed, setRevealed] = useState(false);

  const headline = hero.headline[language] ?? hero.headline.fr;
  const subheadline = hero.subheadline[language] ?? hero.subheadline.fr;
  const cta = hero.ctaLabel[language] ?? hero.ctaLabel.fr;
  const words = headline.split(' ');

  const doorTransition = { duration: 1.0, ease: [0.76, 0, 0.24, 1] as const, delay: 0.15 };

  const Media = (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -top-16 -bottom-16">
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          {hero.backgroundType === 'video' ? (
            <video src={hero.backgroundSrc} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={hero.backgroundSrc} alt="" className="w-full h-full object-cover" />
          )}
        </motion.div>

        {/* Edge-only brand vignette — center stays true-color/appetizing */}
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, ${colors.primaryDark} 145%)`,
            opacity: 0.5,
          }}
        />
        <div className="absolute inset-0" style={{ background: `${colors.background}22` }} />

        {/* Film grain, subtly fading as you scroll past the hero */}
        <motion.div
          className="absolute inset-0 mix-blend-overlay"
          style={{ backgroundImage: `url("${grainSvgDataUri}")`, opacity: grainOpacity }}
        />
      </motion.div>

      {/* Opening reveal: two solid doors meet at the center on mount, then
          slide apart to reveal the photo underneath — a single bold
          cinematic moment instead of a directional wipe. */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/2 z-10"
        style={{ backgroundColor: colors.background }}
        initial={{ x: '0%' }}
        animate={{ x: '-100%' }}
        onAnimationComplete={() => setRevealed(true)}
        transition={doorTransition}
      >
        <div className="absolute inset-y-0 right-0 w-px" style={{ backgroundColor: colors.accent, opacity: 0.6 }} />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 z-10"
        style={{ backgroundColor: colors.background }}
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={doorTransition}
      >
        <div className="absolute inset-y-0 left-0 w-px" style={{ backgroundColor: colors.accent, opacity: 0.6 }} />
      </motion.div>
    </div>
  );

  return (
    <section id="top" className="relative min-h-[600px] sm:h-[88vh] flex flex-col sm:flex-row overflow-hidden">
      {/* Desktop: left text panel on solid background */}
      <div
        className="hidden sm:flex sm:w-[44%] shrink-0 items-center px-10 lg:px-14 relative z-10"
        style={{ backgroundColor: colors.background }}
      >
        <HeroCopy
          words={words}
          subheadline={subheadline}
          cta={cta}
          identity={identity}
          colors={colors}
          onCtaClick={onCtaClick}
          align="left"
        />
      </div>

      {/* Desktop: right photo panel, bleeding to the edge */}
      <div className="hidden sm:block relative flex-1 min-h-full">{Media}</div>

      {/* Mobile: photo as full-bleed background, text overlaid bottom-left */}
      <div className="sm:hidden relative h-[80vh] min-h-[540px] flex items-end">
        {Media}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(0deg, ${colors.background} 8%, ${colors.background}00 60%)` }}
        />
        <div className="relative z-10 px-5 pb-14 text-left">
          <HeroCopy
            words={words}
            subheadline={subheadline}
            cta={cta}
            identity={identity}
            colors={colors}
            onCtaClick={onCtaClick}
            align="left"
          />
        </div>
      </div>

      {/* Designed scroll cue: traveling dot on a thin line, not a stock chevron */}
      {revealed && (
        <div
          className="absolute bottom-6 left-5 sm:left-[calc(44%+2.5rem)] z-10 h-10 w-px overflow-hidden"
          style={{ backgroundColor: `${colors.textMuted}40` }}
        >
          <motion.div
            className="w-px h-3"
            style={{ backgroundColor: colors.accent }}
            animate={{ y: [0, 28, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}
    </section>
  );
};

interface HeroCopyProps {
  words: string[];
  subheadline: string;
  cta: string;
  identity: typeof brandConfig.identity;
  colors: typeof brandConfig.colors;
  onCtaClick: () => void;
  align: 'left' | 'center';
}

const HeroCopy: React.FC<HeroCopyProps> = ({ words, subheadline, cta, identity, colors, onCtaClick }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
    <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: colors.accent }}>
      {identity.city} · {identity.country}
    </span>

    <motion.h1
      variants={headlineVariants}
      initial="hidden"
      animate="visible"
      className="font-display text-[2.4rem] leading-[1.03] sm:text-5xl lg:text-6xl font-semibold tracking-tight"
      style={{ color: colors.textPrimary }}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.28em]">
          {word}
        </motion.span>
      ))}
    </motion.h1>

    <p className="mt-5 text-base max-w-sm" style={{ color: colors.textMuted }}>
      {subheadline}
    </p>

    <div className="mt-8">
      <MagneticButton onClick={onCtaClick} glowColor={colors.accent} shape="cut" className="px-8 py-4 font-bold text-sm tracking-wide">
        {cta}
      </MagneticButton>
    </div>
  </motion.div>
);
