/**
 * Assembles the reference tokens: the values the vocabulary states outright, which do not change
 * with the color mode, and the faces and font sizes the foundation's statement draws.
 *
 * @remarks
 *   One file per category, and every category the compiler reads is filled here rather than
 *   taken from the compiler's own preset, so each token is defined once and the manifest names
 *   one package fewer.
 */

import { type Tokens } from "#pandacss.ts";
import { drawn } from "#preset/statement.ts";
import { animations } from "#preset/tokens/animations.ts";
import { aspectRatios } from "#preset/tokens/aspect-ratios.ts";
import { blurs } from "#preset/tokens/blurs.ts";
import { borders, borderWidths } from "#preset/tokens/border-widths.ts";
import { colors } from "#preset/tokens/colors.ts";
import { cursor } from "#preset/tokens/cursor.ts";
import { durations } from "#preset/tokens/durations.ts";
import { easings } from "#preset/tokens/easings.ts";
import { fontWeights } from "#preset/tokens/font-weights.ts";
import { letterSpacings } from "#preset/tokens/letter-spacings.ts";
import { lineHeights } from "#preset/tokens/line-heights.ts";
import { opacity } from "#preset/tokens/opacity.ts";
import { radii } from "#preset/tokens/radii.ts";
import { sizes } from "#preset/tokens/sizes.ts";
import { spacing } from "#preset/tokens/spacing.ts";
import { zIndex } from "#preset/tokens/z-index.ts";

/**
 * Lists every reference token, by category.
 */
export const tokens: Tokens = {
  ...drawn.tokens,
  animations,
  aspectRatios,
  blurs,
  borders,
  borderWidths,
  colors,
  cursor,
  durations,
  easings,
  fontWeights,
  letterSpacings,
  lineHeights,
  opacity,
  radii,
  sizes,
  spacing,
  zIndex,
};
