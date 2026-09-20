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

import { CORNERS, FLATS, SCALE, STATUSES, TONES, WEIGHTS } from "@stealthscale/theme/authoring";

import { type Declared } from "#recipe.ts";

/**
 * The order each shared vocabulary is read in, against the axis that offers it.
 */
const ORDERS: ReadonlyArray<readonly [axis: string, order: readonly string[]]> = [
  ["size", SCALE],
  ["radius", CORNERS],
  ["status", STATUSES],
  ["tone", TONES],
  ["variant", FLATS],
  ["weight", WEIGHTS],
];

/**
 * Reports an axis whose values all come from a shared vocabulary and are not in its order.
 *
 * @remarks
 *   An axis holding a value the vocabulary does not name is left alone. A recipe is free to offer
 *   looks or steps of its own, and there is no order to hold it to once it does: the tabs offer
 *   `enclosed` and `line`, which no set of looks names.
 *   An axis of one value is left alone as well, because one value is in every order there is.
 * @param recipe - The recipe to read.
 * @returns Each axis out of order, or an empty array for a recipe whose axes are all in order.
 */
export function orderViolations(recipe: Declared): readonly string[] {
  return ORDERS.flatMap(([axis, order]) => {
    const offered = Object.keys(recipe.variants?.[axis] ?? {});

    if (offered.length < 2 || offered.some((value) => !order.includes(value))) return [];

    const wanted = order.filter((value) => offered.includes(value));

    if (offered.join() === wanted.join()) return [];

    return [
      `${recipe.className} offers ${axis} as ${offered.join(", ")} rather than ${wanted.join(", ")}`,
    ];
  });
}
