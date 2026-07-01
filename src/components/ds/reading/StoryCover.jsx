import React from 'react';
import { FoilVolume } from './covers/FoilVolume.jsx';
import { Monogram } from './covers/Monogram.jsx';
import { Isobar } from './covers/Isobar.jsx';
import { Astrolabe } from './covers/Astrolabe.jsx';
import { Riso } from './covers/Riso.jsx';
import { Deco } from './covers/Deco.jsx';
import { BigTop } from './covers/BigTop.jsx';
import { Salvage } from './covers/Salvage.jsx';

/**
 * StoryCover — procedural placeholder cover, selectable per story.
 *
 * Each variant renders an absolutely-positioned fill generated deterministically
 * from a hash of (id || title), so it is SSR-safe and every story looks distinct
 * even when several share one `coverColor`. Pick the look with `coverStyle`
 * (story metadata); unknown/empty falls back to Foil Volume.
 *
 * `COVER_STYLES` is the picker menu for the admin story form.
 */

const VARIANTS = {
  foil: FoilVolume,
  monogram: Monogram,
  isobar: Isobar,
  sigil: Astrolabe,
  riso: Riso,
  deco: Deco,
  circus: BigTop,
  wreck: Salvage,
};

export const DEFAULT_COVER_STYLE = 'sigil';

export const COVER_STYLES = [
  { key: 'sigil', label: 'Astrolabe — constellation' },
  { key: 'foil', label: 'Foil Volume — bound book' },
  { key: 'monogram', label: 'Ex Libris — big monogram' },
  { key: 'isobar', label: 'Isobar — contour lines' },
  { key: 'riso', label: 'Misregister — halftone print' },
  { key: 'deco', label: 'Radiant — art-deco poster' },
  { key: 'circus', label: 'Big Top — circus tent' },
  { key: 'wreck', label: 'Salvage — sea & witch-light' },
];

export function StoryCover({ coverStyle, ...props }) {
  const Variant = VARIANTS[coverStyle] || VARIANTS[DEFAULT_COVER_STYLE];
  return <Variant {...props} />;
}
