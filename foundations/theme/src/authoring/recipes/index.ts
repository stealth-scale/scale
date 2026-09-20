/**
 * Publishes the helpers a recipe is built from, so a recipe states what a component is rather than
 * how each of its states is drawn.
 *
 * @remarks
 *   Each helper returns a plain style object that reads semantic tokens, layer styles, text
 *   styles and animation styles, and nothing a recipe may not write: no color, no pixel length,
 *   no color mode.
 */

export { type Axis, axis } from "#authoring/recipes/axis.ts";
export { dense } from "#authoring/recipes/density.ts";
export { field } from "#authoring/recipes/field.ts";
export { floating, overlay } from "#authoring/recipes/floating.ts";
export {
  type Align,
  ALIGNMENTS,
  alignVariants,
  columnCounts,
  type Count,
  COUNTS,
  DISTRIBUTIONS,
  filledColumns,
  fittedColumns,
  gapSizes,
  type Justify,
  justifyVariants,
  spanCounts,
  widthSizes,
} from "#authoring/recipes/flow.ts";
export { interactive, link, row } from "#authoring/recipes/interactive.ts";
export {
  type Field,
  FIELDS,
  fieldVariants,
  type Flat,
  FLATS,
  flatVariants,
  type Highlight,
  HIGHLIGHTS,
  highlightVariants,
  type Look,
  LOOKS,
  lookVariants,
  type Marked,
} from "#authoring/recipes/looks.ts";
export { motion, type Motion, MOTIONS, motionVariants } from "#authoring/recipes/motion.ts";
export { cornerVariants, ratioVariants } from "#authoring/recipes/shape.ts";
export {
  below,
  CONTROL_INSET_END,
  CONTROL_INSET_START,
  controlSizes,
  iconOnly,
  iconSizes,
  insetSizes,
  sizeVariants,
  tagSizes,
  touchTarget,
} from "#authoring/recipes/sizes.ts";
export { type Anatomy, onSlot, onSlots, slotsOf } from "#authoring/recipes/slots.ts";
export { fieldStatusVariants, statusEmitted, statusVariants } from "#authoring/recipes/status.ts";
export {
  divider,
  type Elevation,
  type Lift,
  LIFTED,
  liftVariants,
  surface,
} from "#authoring/recipes/surface.ts";
export {
  textSizes,
  type Tone,
  TONES,
  toneVariants,
  truncate,
  type Weight,
  WEIGHTS,
  weightVariants,
} from "#authoring/recipes/text.ts";
