/**
 * Checks that an axis drawn from one of the shared vocabularies lists its values in that
 * vocabulary's order.
 *
 * @remarks
 *   A scale runs from the smallest step up and a set of looks runs from the loudest down. A
 *   specimen page compares two components along those orders, and a plain object loses both: the
 *   sorting rule the repository lints with is alphabetical, so a scale of four steps comes out
 *   large, medium, small, extra large. The authoring helpers build the record in the order
 *   declared here, so an axis a helper covers is declared through the helper.
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
 * Places a child takes across the flow, in the short spelling used by every recipe that has no
 * `justify` axis to collide with.
 *
 * @remarks
 *   A class encodes the value a caller picked and not the axis it was picked on, so a recipe
 *   offering both `align` and `justify` cannot offer one value on both. The three layout
 *   primitives that offer both spell the cross axis as CSS does, `flex-start` against `start`.
 *   Both spellings run in the same order.
 */
const PLACES: readonly string[] = ["start", "center", "end", "stretch", "baseline"];

/**
 * Statuses, followed by the value a component of no status takes.
 *
 * @remarks
 *   A button, a badge and an alert each offer `neutral` alongside the four statuses, because those
 *   three still render when there is nothing to report. A form field offers no such value, because
 *   a field with nothing to report declares no status at all.
 */
const VOICES: readonly string[] = [...STATUSES, "neutral"];

/**
 * Tones, followed by the value a mark inherits from the surrounding text.
 */
const INKS: readonly string[] = [...TONES, "current"];

/**
 * Each axis checked here, against the vocabulary orders its values may follow.
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
 * Reports every axis whose values all come from a shared vocabulary but are not in its order.
 *
 * @remarks
 *   An axis with a value no vocabulary names is skipped, because a recipe may offer looks or steps
 *   the vocabularies do not cover: the tabs offer `enclosed` and `line`, which no set of looks
 *   names. An axis of one value is skipped, because one value satisfies every order. An axis
 *   offered in more than one spelling is read against whichever spelling covers its values, so the
 *   cross axis keeps one order under both spellings.
 * @param recipe - Recipe to read.
 * @returns Each axis out of order, or an empty array where every axis is in order.
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
