/**
 * Provides the item a part renders in, the viewport's alignment, and whether a panel closes once
 * the pointer leaves it, to the parts that read them.
 *
 * @remarks
 *   A trigger, a panel and a link read the value of the item they belong to, and the viewport reads
 *   the alignment its positioner states. `useItem` throws for a part rendered outside an item.
 */

import { createContext, useContext } from "react";

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the item a part belongs to.
 */
export interface ItemScope {
  /**
   * Whether the item takes no pointer or key input.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Value of the item, which the machine reports while the item is open.
   */
  readonly value: string;
}

/**
 * Describes where the viewport is placed against the open trigger.
 */
export type Align = "center" | "end" | "start";

/**
 * Provides the item to the parts inside `NavigationMenu.Item`, and reads it back.
 */
export const [ItemProvider, useItem] = createRequiredContext<ItemScope>("NavigationMenu.Item");

/**
 * Carries the alignment `NavigationMenu.ViewportPositioner` states to the viewport inside it.
 */
const Aligned = createContext<Align | undefined>(undefined);

/**
 * Provides the positioner's alignment to the viewport.
 */
export const AlignProvider = Aligned.Provider;

/**
 * Returns the alignment of the positioner around the calling part.
 *
 * @returns The alignment, or nothing outside a positioner.
 */
export function useAlign(): Align | undefined {
  return useContext(Aligned);
}

/**
 * Carries whether a panel closes once the pointer leaves it.
 */
const Leaving = createContext(true);

/**
 * Provides whether a panel closes once the pointer leaves it to the panels, which the root sets
 * from `disablePointerLeaveClose`.
 */
export const LeavingProvider = Leaving.Provider;

/**
 * Returns whether a panel closes once the pointer leaves it.
 *
 * @returns False under a root with `disablePointerLeaveClose`, and true otherwise.
 */
export function useClosesOnLeave(): boolean {
  return useContext(Leaving);
}
