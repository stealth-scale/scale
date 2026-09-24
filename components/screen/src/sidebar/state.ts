/**
 * Provides a nav block's label identifier to its `NavLabel`.
 *
 * @remarks
 *   The block creates the identifier and the label reads it, so the two always match without an
 *   identifier from the caller. A `NavLabel` outside a block throws.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the state a nav block provides.
 */
export interface NavState {
  /**
   * Identifier of the label, which the block's `aria-labelledby` points at.
   */
  labelId: string;
}

/**
 * Provides the block's state and reads it, throwing outside a `Sidebar.Nav`.
 */
export const [NavProvider, useNav] = createRequiredContext<NavState>("Sidebar.Nav");
