/**
 * Provides the swap's state from the root to its indicators.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what the root provides: which mark shows, and whether a mark renders while it does not.
 */
export interface SwapState {
  /**
   * Whether a mark renders nothing until it first shows.
   */
  readonly lazyMount: boolean;

  /**
   * Whether the `on` mark shows. The `off` mark shows while it is false.
   */
  readonly swap: boolean;

  /**
   * Whether a mark renders nothing once its exit motion ends.
   */
  readonly unmountOnExit: boolean;
}

/**
 * Creates the context through which the root provides the state to its indicators.
 *
 * @remarks
 *   `useSwapState` throws when no `Swap.Root` is mounted above the calling indicator.
 */
export const [StateProvider, useSwapState] = createRequiredContext<SwapState>("Swap");
