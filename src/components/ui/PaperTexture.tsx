import React from 'react';
import { grainSvgDataUri } from '../../config/theme';

// Fixed engine component, always on for every client (not a wow-module
// toggle) — a near-invisible grain texture over the whole page. The
// difference it makes is subtle on purpose: it's the thing that separates
// "flat dark background" from "surface with material feel", the same way
// a printed menu has paper texture and a PDF export of it doesn't. Uses the
// same noise data-uri as ParallaxHero's film grain so the whole site shares
// one texture instead of two similar-but-different ones.
export const PaperTexture: React.FC = () => (
  <div
    aria-hidden
    className="fixed inset-0 pointer-events-none z-[1]"
    style={{
      backgroundImage: `url("${grainSvgDataUri}")`,
      opacity: 0.035,
      mixBlendMode: 'overlay',
    }}
  />
);
