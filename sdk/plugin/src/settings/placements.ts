/**
 * Reads and writes the person's placements in a component, for a plugin that offers a layout
 * editor.
 */

import { type SlotPlacement } from "@stealthscale/sdk-core";

import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";

/**
 * Describes the person's placements as a component reads them.
 */
export interface Placements {
  /**
   * Removes every placement the person made.
   */
  readonly reset: () => void;

  /**
   * The person's placements, by slot.
   */
  readonly slots: Readonly<Record<string, SlotPlacement>>;

  /**
   * Replaces the person's placements of the slots the change names, and writes the result.
   */
  readonly update: (change: Readonly<Record<string, SlotPlacement>>) => void;
}

/**
 * Returns the person's placements, and renders again when they change in this tab or another.
 *
 * @remarks
 *   The host checks a placement when it reads it: an id no installed plugin declares is dropped,
 *   and an `add` to a slot that is not a region is ignored. Each is reported.
 */
export function usePlacements(): Placements {
  const { placements } = useHost("usePlacements").stores;
  const slots = useSelector([placements], () => placements.get());

  return { reset: placements.reset, slots, update: placements.update };
}
