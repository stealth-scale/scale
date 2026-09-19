/**
 * Publishes the scales a theme is written with: the ramps, the families, the palettes, the
 * corners, the shadows, the geometry, the motion and the type.
 */

export {
  alphaScale,
  backgrounds,
  BORDER_STEPS,
  borders,
  colorScale,
  FOREGROUND_STEPS,
  foregrounds,
  neutralFills,
  oklch,
  type PageLightness,
  paletteAlias,
  paletteRoles,
  ramp,
  ROLE_STEPS,
  type RoleSteps,
  type Step,
  stepOf,
  stepped,
  type Steps,
  surfaces,
  type SurfaceSteps,
} from "#scales/color.ts";
export { radii, shadows } from "#scales/depth.ts";
export { drawn, hues, type Solid } from "#scales/drawn.ts";
export {
  controls,
  type Corner,
  CORNERS,
  gaps,
  icons,
  insets,
  type Ratio,
  RATIOS,
  SCALE,
  type Scale,
  type Width,
  WIDTHS,
} from "#scales/geometry.ts";
export { type Inked, inked, mixed, scaleOf, stated, type Written } from "#scales/inked.ts";
export { slides } from "#scales/motion.ts";
export {
  families,
  type Families,
  type PaletteAliases,
  palettes,
  type Palettes,
} from "#scales/palettes.ts";
export { fontSizes, ROLE_SIZES, type TextRole, typography } from "#scales/type.ts";
