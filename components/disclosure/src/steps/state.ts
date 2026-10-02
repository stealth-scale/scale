/**
 * Provides a step's index to the parts inside its item.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what an item provides to its parts.
 */
export interface ItemState {
  /**
   * Index of the step, from zero.
   */
  readonly index: number;
}

/**
 * Creates the context through which an item provides its index to its parts.
 *
 * @remarks
 *   `useItem` throws when no `Steps.Item` is mounted above the calling part.
 */
export const [ItemProvider, useItem] = createRequiredContext<ItemState>("Steps.Item");
