/**
 * Writes the axes a component offers for how its words are set: the role and step they are read
 * at, the ink they are drawn in, their weight, and what a line cut to its box does.
 *
 * @remarks
 *   Each helper offers what the theme states where a recipe names no part of it, so a component
 *   adds nothing to the vocabulary and a theme that moves a role reaches every component through
 *   it.
 */

import { type Axis, axis } from "#authoring/recipes/axis.ts";
import { ROLE_SIZES, type Scale, type TextRole } from "#draw/type.ts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { recordOf } from "#record.ts";

/**
 * Selects one of the inks a component's words are drawn in: four of the foreground family, and
 * the four statuses.
 */
export type Tone =
  | "default"
  | "error"
  | "info"
  | "inverted"
  | "muted"
  | "subtle"
  | "success"
  | "warning";

/**
 * Maps each ink to the foreground role that draws it.
 *
 * @remarks
 *   The family's `muted` is secondary text at the text ratio, and its `subtle` is tertiary text
 *   at the ratio a caption, a timestamp or a counter reads at. `link` is a state a component draws
 *   itself rather than an ink a caller picks.
 */
const INKS: Readonly<Record<Tone, string>> = {
  default: "fg",
  error: "fg.error",
  info: "fg.info",
  inverted: "fg.inverted",
  muted: "fg.muted",
  subtle: "fg.subtle",
  success: "fg.success",
  warning: "fg.warning",
};

/**
 * Lists the inks in the order a README reads them: the family, then the statuses.
 */
export const TONES: readonly Tone[] = [
  "default",
  "muted",
  "subtle",
  "inverted",
  "info",
  "success",
  "warning",
  "error",
];

/**
 * Selects one of the weights a component offers.
 */
export type Weight = "bold" | "medium" | "normal" | "semibold";

/**
 * Lists the weights in the order they grow.
 */
export const WEIGHTS: readonly Weight[] = ["normal", "medium", "semibold", "bold"];

/**
 * Writes the `size` axis of a component whose words are read at one role, each value a step of
 * that role.
 *
 * @remarks
 *   A role states the steps it offers, so a paragraph reading the body role offers the five the
 *   body role has and a heading the eight the heading role has, and neither states a list of its
 *   own.
 * @typeParam Role - The role the component's words are read at.
 */
export function textSizes<const Role extends TextRole>(
  role: Role,
): Record<(typeof ROLE_SIZES)[Role][number], SystemStyleObject>;

/**
 * Writes the `size` axis for the steps a recipe names.
 *
 * @typeParam Offered - The steps the recipe offers.
 */
export function textSizes<const Offered extends Scale>(
  role: TextRole,
  sizes: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per step, each reading the text style of the role and step.
 */
export function textSizes(
  role: TextRole,
  sizes: readonly Scale[] = ROLE_SIZES[role],
): Record<string, SystemStyleObject> {
  return recordOf(sizes, (size) => ({ textStyle: `${role}.${size}` }));
}

/**
 * Writes the `tone` axis of a component, each value reading the foreground role that draws it.
 */
export const toneVariants: Axis<Tone> = axis(TONES, (tone) => ({ color: INKS[tone] }));

/**
 * Writes the `weight` axis of a component, each value reading the weight token of the same name.
 */
export const weightVariants: Axis<Weight> = axis(WEIGHTS, (weight) => ({ fontWeight: weight }));

/**
 * Writes what a line cut to its box does: one line, clipped, ending in an ellipsis.
 */
export function truncate(): SystemStyleObject {
  return { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
}
