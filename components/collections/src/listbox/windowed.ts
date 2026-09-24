/**
 * Passes a window's scroll function up to the root, which gives it to the machine.
 *
 * @remarks
 *   The machine takes `scrollToIndexFn` on the root, and the window renders inside the content. The
 *   window passes its function up through this context, so a caller renders the window once. The
 *   root stores the function in state, because the machine reads its options while rendering and a
 *   ref set after the first render is empty at that point.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the slot a window passes its scroll function through.
 */
export interface Windowed {
  /**
   * Stores the function that scrolls a row into view, or clears it when the window unmounts.
   */
  hold: (scroll: ((index: number) => void) | null) => void;
}

/**
 * Provides the slot to a window, and reads it back.
 */
export const [WindowedProvider, useWindowed] = createRequiredContext<Windowed>("Listbox");

/**
 * Describes the details the machine passes to `scrollToIndexFn`.
 */
export interface Reached {
  /**
   * Index of the row in the collection, rendered or not.
   */
  index: number;
}

/**
 * Returns the machine's `scrollToIndexFn`, which passes the machine's row index to a window's
 * scroll function.
 *
 * @param scroll - The window's function, which converts a row index to a scroll position from its
 *   row height.
 * @returns The function the machine's option takes.
 */
export function scrolledBy(scroll: (index: number) => void): (reached: Reached) => void {
  return (reached) => {
    scroll(reached.index);
  };
}
