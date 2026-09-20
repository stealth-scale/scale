/**
 * Publishes the engine a theme is drawn by: one function per axis, the ladders and ratios behind
 * the colors, the reference ramps, the foundation's own statement, and the color arithmetic a
 * statement may need.
 */

export {
  type Axes,
  drawAxes,
  type Drawn,
  type DrawnRoot,
  type Faces,
  faces,
  type RootAxes,
} from "#draw/axes.ts";
export { coded } from "#draw/code.ts";
export {
  atChroma,
  inGamut,
  lightened,
  lightnessOf,
  mixed,
  oklch,
  polar,
  type Polar,
  referenced,
  stated,
} from "#draw/color.ts";
export { inked } from "#draw/colors.ts";
export {
  contrast,
  type Level,
  linear,
  type Linear,
  luminance,
  oklab,
  type Oklab,
  readable,
} from "#draw/contrast.ts";
export { type Depth, depth, shadows } from "#draw/depth.ts";
export { FOUNDATION, PAGES } from "#draw/foundation.ts";
export { type Intents, intents, STATUS_HUES } from "#draw/intents.ts";
export {
  type DrawOptions,
  FLOOR,
  HAIRLINES,
  type Inked,
  isDark,
  type Ladder,
  ladderOf,
  type Ratios,
  RATIOS,
  ratiosOf,
  type Side,
  type Written,
} from "#draw/ladder.ts";
export {
  controls,
  gaps,
  icons,
  insets,
  type Metrics,
  metrics,
  SCALE,
  tags,
  type Width,
  WIDTHS,
} from "#draw/metrics.ts";
export { slides } from "#draw/motion.ts";
export { canonical, drawn, hues, sideOf, type Solid } from "#draw/palette.ts";
export { alphaScale, colorScale, RAMPS, scaleOf, stepOf } from "#draw/ramps.ts";
export { type BodyRole, type HeadingRole, type LabelRole, type Roles, roles } from "#draw/roles.ts";
export {
  ASPECT_RATIOS,
  type Corner,
  CORNERS,
  radii,
  type Ratio,
  type Shape,
  shape,
  type Stroke,
  strokes,
} from "#draw/shape.ts";
export { type Colors, drawColors } from "#draw/statement.ts";
export { type Pace, type Tempo, tempo } from "#draw/tempo.ts";
export {
  fontSizes,
  ROLE_SIZES,
  type Scale,
  type TextRole,
  type Type,
  typeScale,
  type TypeScale,
  typography,
} from "#draw/type.ts";
