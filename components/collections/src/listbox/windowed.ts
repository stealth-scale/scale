/**
 * Carries the way a windowed list scrolls to a row, from the window up to the root that runs the
 * machine.
 *
 * @remarks
 *   The machine takes the function as an option on the root, and the window that knows how to
 *   scroll sits inside the list. The window hands its function up through here and the root passes
 *   it on, so a caller states the window once where the rows are drawn rather than wiring two
 *   props at two levels.
 *   The root holds it as state rather than in a ref, because the machine reads its options as it
 *   renders. A ref filled after the first render would still be empty when the machine read it,
 *   and the list would scroll by the machine's own means for as long as that lasted.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what a window tells the list it belongs to.
 */
export interface Windowed {
  /**
   * Takes the function that scrolls a row into view, or drops it when the window goes.
   */
  hold: (scroll: ((index: number) => void) | null) => void;
}

/**
 * Hands a window's scrolling up to the root, and reads it back.
 */
export const [WindowedProvider, useWindowed] = createRequiredContext<Windowed>("Listbox");

/**
 * Describes how the machine asks for a row to be scrolled into view.
 */
export interface Reached {
  /**
   * Where the row sits in the collection, drawn or not.
   */
  index: number;
}

/**
 * Writes the option the machine scrolls a row by, out of the function a window handed up.
 *
 * @remarks
 *   The machine reports the row's position in the collection and the window turns that into a
 *   distance, because only the window knows how tall a row is.
 * @param scroll - The window's way of scrolling to a row at a given position.
 * @returns A function the machine's option takes.
 */
export function scrolledBy(scroll: (index: number) => void): (reached: Reached) => void {
  return (reached) => {
    scroll(reached.index);
  };
}
