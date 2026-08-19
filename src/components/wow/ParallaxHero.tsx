import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
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
//   2. An opening reveal: the photo wipes into view once on mount instead
//      of just fading/zooming in.
//   3. The CTA uses the studio's cut-corner shape (MagneticButton
//      shape="cut"), not a generic pill.
//   4. A designed scroll cue — a thin traveling dot on a vertical line —
//      instead of a stock chevron icon.
//   5. A subtle film-grain overlay for texture, tied to scroll position.
//   6. Finger-following warm light: touch/drag the photo and a soft warm
//      glow follows your finger, like lighting the dish with a match in a
//      dark room. A real touch-driven interaction, not an ambient loop.
//   7. Drifting steam layer: 3 soft blurred shapes that drift upward and
//      sideways on their own independent loops, giving the photo a sense
//      of depth/life instead of being one flat static layer.
export const ParallaxHero: React.FC<WowHeroProps> = ({ language, onCtaClick }) => {
  const { hero, colors, identity } = brandConfig;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 140]);
  const grainOpacity = useTransform(scrollY, [0, 400], [0.06, 0.02]);
  const [revealed, setRevealed] = useState(false);

  // Finger/cursor-following spotlight. Percent-based (0-100) so the glow
  // stays correctly positioned regardless of the media container's size.
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(40);
  const springLightX = useSpring(lightX, { stiffness: 120, damping: 20 });
  const springLightY = useSpring(lightY, { stiffness: 120, damping: 20 });
  const [lightActive, setLightActive] = useState(false);
  const lightIdleTimer = useRef<number | undefined>(undefined);

  const updateLight = (clientX: number, clientY: number, rect: DOMRect) => {
    lightX.set(((clientX - rect.left) / rect.width) * 100);
    lightY.set(((clientY - rect.top) / rect.height) * 100);
    setLightActive(true);
    window.clearTimeout(lightIdleTimer.current);
    lightIdleTimer.current = window.setTimeout(() => setLightActive(false), 1400);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateLight(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
  };

  const headline = hero.headline[language] ?? hero.headline.fr;
  const subheadline = hero.subheadline[language] ?? hero.subheadline.fr;
  const cta = hero.ctaLabel[language] ?? hero.ctaLabel.fr;
  const words = headline.split(' ');

  const Media = (
    <motion.div
      className="absolute inset-0 overflow-hidden touch-pan-y"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
    >
      {/* Opening reveal: photo wipes in from the edge on first mount */}
      <motion.div
        initial={{ clipPath: 'inset(0 0 0 100%)' }}
        animate={{ clipPath: 'inset(0 0 0 0%)' }}
        onAnimationComplete={() => setRevealed(true)}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0"
      >
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

          {/* Drifting steam: three soft blurred blobs, each on its own slow,
              independent loop (different duration/direction) so together
              they never look mechanically synced — the photo feels alive
              even when nobody is touching the screen. */}
          <div className="absolute inset-0 pointer-events-none mix-blend-screen" style={{ opacity: 0.35 }}>
            <motion.div
              className="absolute rounded-full"
              style={{ width: '55%', height: '55%', left: '10%', top: '15%', background: `radial-gradient(circle, ${colors.background}CC 0%, transparent 70%)`, filter: 'blur(28px)' }}
              animate={{ x: [0, 30, -10, 0], y: [0, -40, -20, 0], opacity: [0.5, 0.8, 0.5, 0.5] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{ width: '40%', height: '40%', right: '8%', top: '30%', background: `radial-gradient(circle, ${colors.background}B3 0%, transparent 70%)`, filter: 'blur(24px)' }}
              animate={{ x: [0, -25, 15, 0], y: [0, -30, -10, 0], opacity: [0.4, 0.7, 0.4, 0.4] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{ width: '35%', height: '35%', left: '35%', bottom: '10%', background: `radial-gradient(circle, ${colors.background}99 0%, transparent 70%)`, filter: 'blur(22px)' }}
              animate={{ x: [0, 20, -15, 0], y: [0, -25, -5, 0], opacity: [0.3, 0.6, 0.3, 0.3] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            />
          </div>

          {/* Finger-following warm light — drag/touch the photo and a soft
              glow follows the exact point of contact, like lighting the
              dish with a match. Fades out ~1.4s after the finger lifts. */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light"
            style={{
              opacity: lightActive ? 0.9 : 0,
              transition: 'opacity 0.5s ease',
              background: useTransform(
                [springLightX, springLightY],
                ([lx, ly]: number[]) =>
                  `radial-gradient(circle 220px at ${lx}% ${ly}%, ${colors.accent} 0%, transparent 70%)`
              ),
            }}
          />

          {/* Film grain, subtly fading as you scroll past the hero */}
          <motion.div
            className="absolute inset-0 mix-blend-overlay"
            style={{ backgroundImage: `url("${grainSvgDataUri}")`, opacity: grainOpacity }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
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
      <MagneticButton
        onClick={onCtaClick}
        glowColor={colors.accent}
        shape="cut"
        className="px-8 py-4 font-bold text-sm tracking-wide"
        style={{
          backgroundColor: colors.primary,
          color: colors.background,
          boxShadow: `0 0 0 1px ${colors.textPrimary}26 inset, 0 12px 30px -8px ${colors.primaryDark}CC`,
        }}
      >
        {cta}
      </MagneticButton>
    </div>
  </motion.div>
);
