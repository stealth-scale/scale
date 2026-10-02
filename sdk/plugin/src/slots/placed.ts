/**
 * Applies a person's placement of one slot over the extensions the build placed in it.
 */

import {
  type ResolvedExtension,
  type ResolvedSlot,
  type SlotPlacement,
} from "@stealthscale/sdk-core";

/**
 * Returns the extensions placed in a slot after a person's placement, in order.
 *
 * @remarks
 *   The build placed the manifests' extensions and applied the product's placements. The person's
 *   `remove` takes an extension out unless it is `required`. The person's `add` puts an extension
 *   in where the slot is a region, because a region renders without props. An added extension
 *   follows the placed ones, by its own rank and then in install order. The person's `order` lists
 *   extensions first, in that order. An id no extension has is skipped.
 * @param slot - The slot as the build resolved it.
 * @param extensions - Every extension of the product, in install order.
 * @param person - The person's placement of the slot.
 */
export function placedIn(
  slot: ResolvedSlot,
  extensions: readonly ResolvedExtension[],
  person: SlotPlacement = {},
): readonly ResolvedExtension[] {
  const removed = new Set(person.remove);
  const added = new Set(slot.region ? person.add : []);
  const listed = person.order ?? [];
  const kept = extensions
    .filter((one) => slot.extensions.includes(one.id))
    .filter((one) => !removed.has(one.id) || one.required === true)
    .toSorted((one, other) => slot.extensions.indexOf(one.id) - slot.extensions.indexOf(other.id));
  const joined = extensions
    .filter((one) => added.has(one.id) && !one.disabled && !slot.extensions.includes(one.id))
    .toSorted(
      (one, other) =>
        (one.order ?? Number.MAX_SAFE_INTEGER) - (other.order ?? Number.MAX_SAFE_INTEGER),
    );

  /**
   * Ranks an extension by its place in the person's order, after every listed one where absent.
   */
  const rank = (extension: ResolvedExtension): number =>
    listed.includes(extension.id) ? listed.indexOf(extension.id) : listed.length;

  return [...kept, ...joined].toSorted((one, other) => rank(one) - rank(other));
}
