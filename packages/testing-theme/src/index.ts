/**
 * Checks a theme, a recipe and a preset against the theme contract, and reads the classes a recipe
 * declares and a rendered component applies.
 *
 * @remarks
 *   Each gate returns an array of violations, so one assertion can report which role, pair or file
 *   failed the contract. No reader calls `getComputedStyle`, because a unit test runs without the
 *   compiled stylesheet.
 * @packageDocumentation
 */

export {
  type BoundChecks,
  boundMachineViolations,
  boundViolations,
  type Draw,
  type DrawAsync,
} from "#bound.ts";
export { compoundClass, recipeClass, slotClass, slotVariantClass, variantClass } from "#classes.ts";
export { type Measured, type Pair, THRESHOLDS, type Thresholds } from "#contrast.ts";
export { type PresetCheck, type PresetChecks, presetViolations } from "#preset-checks.ts";
export { gamut, outsideGamut, type Ramp, rampsOf } from "#ramp.ts";
export { type RecipeCheck, type RecipeChecks, recipeViolations } from "#recipe-checks.ts";
export {
  axesOf,
  byStep,
  type Declared,
  defaultsOf,
  scaleOf,
  slotsOf,
  type Slotted,
  valuesOf,
} from "#recipe.ts";
export { classesOf, recipeClasses, recipeElement, slotClasses, slotElement } from "#rendered.ts";
export {
  formatReport,
  type Margin,
  report,
  type StatusApart,
  type Steps,
  type ThemeReport,
} from "#report.ts";
export { type StatusPair, statusPairs } from "#status.ts";
export {
  colorAt,
  extendedRecipes,
  fontsOf,
  palettesOf,
  publishedRecipes,
  resolved,
  type Resolving,
} from "#theme.ts";
export { type ThemeCheck, type ThemeChecks, violations } from "#violations.ts";
export {
  DEFICIENCIES,
  type Deficiency,
  distance,
  distanceFor,
  simulated,
  written,
} from "#vision.ts";
