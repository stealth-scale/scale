/**
 * Checks that an axis drawn from one of the shared vocabularies lists its values in that
 * vocabulary's order.
 *
 * @remarks
 *   A scale runs from the smallest step up and a set of looks runs from the loudest down. Both
 *   orders are what a reader of a specimen page compares two components by, and both are lost when
 *   an axis is written as a plain object: the sorting rule the repository lints with is
 *   alphabetical, so a scale of four steps comes out large, medium, small, extra large. The
 *   authoring helpers build the record in the order stated here, which is why an axis a helper
 *   covers is written through the helper rather than by hand.
 */

import {
  ALIGNMENTS,
  CORNERS,
  DISTRIBUTIONS,
  FLATS,
  MOTIONS,
  SCALE,
  STATUSES,
  TONES,
  WEIGHTS,
} from "@stealthscale/theme/authoring";

import { type Declared } from "#recipe.ts";

/**
 * The places a child takes across the flow, spelled the way the axes that do not collide with a
 * `justify` axis spell them.
 *
 * @remarks
 *   A class carries the value a caller picked and not the axis it was picked on, so a recipe
 *   offering both `align` and `justify` cannot offer one value on both. The three layout primitives
 *   that offer both spell the cross axis the way CSS does, `flex-start` against `start`, and every
 *   other recipe is free to take the short words. Both spellings run in the same order.
 */
const PLACES: readonly string[] = ["start", "center", "end", "stretch", "baseline"];

/**
 * The statuses, with the one a component of no status takes after them.
 *
 * @remarks
 *   A button, a badge and an alert each offer `neutral` beside the four statuses, because a voice
 *   with nothing to report is a voice those three still have to speak in. A form field offers no
 *   such value: a field with nothing to report states no status at all.
 */
const VOICES: readonly string[] = [...STATUSES, "neutral"];

/**
 * The inks, with the one a mark takes from the words around it after them.
 */
const INKS: readonly string[] = [...TONES, "current"];

/**
 * The order each shared vocabulary is read in, against the axis that offers it.
 */
const ORDERS: ReadonlyArray<readonly [axis: string, orders: ReadonlyArray<readonly string[]>]> = [
  ["align", [ALIGNMENTS, PLACES]],
  ["justify", [DISTRIBUTIONS]],
  ["motion", [MOTIONS]],
  ["radius", [CORNERS]],
  ["size", [SCALE]],
  ["status", [STATUSES, VOICES]],
  ["tone", [TONES, INKS]],
  ["variant", [FLATS]],
  ["weight", [WEIGHTS]],
];

/**
 * Reports an axis whose values all come from a shared vocabulary and are not in its order.
 *
 * @remarks
 *   An axis holding a value the vocabulary does not name is left alone. A recipe is free to offer
 *   looks or steps of its own, and there is no order to hold it to once it does: the tabs offer
 *   `enclosed` and `line`, which no set of looks names.
 *   An axis of one value is left alone as well, because one value is in every order there is.
 *   An axis offered in more than one spelling is read against whichever of them covers its values,
 *   which is how the cross axis is held to one order under both of its spellings.
 * @param recipe - The recipe to read.
 * @returns Each axis out of order, or an empty array for a recipe whose axes are all in order.
 */
export function orderViolations(recipe: Declared): readonly string[] {
  return ORDERS.flatMap(([axis, orders]) => {
    const offered = Object.keys(recipe.variants?.[axis] ?? {});
    const order = orders.find((one) => offered.every((value) => one.includes(value)));

    if (offered.length < 2 || order === undefined) return [];

    const wanted = order.filter((value) => offered.includes(value));

    if (offered.join() === wanted.join()) return [];

    return [
      `${recipe.className} offers ${axis} as ${offered.join(", ")} rather than ${wanted.join(", ")}`,
    ];
  });
}
