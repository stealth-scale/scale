/**
 * Draws what a specimen wrote with nothing round it, for a framed document.
 */

import { createElement, Fragment, type ReactElement, type ReactNode } from "react";

/**
 * Returns what a specimen wrote, bare.
 *
 * @remarks
 *   A fragment built by hand rather than written as JSX, because a fragment holding one expression
 *   is what the lint reads as useless, and here it is the point: a sample, a board and a matrix in
 *   a framed document each draw what the specimen wrote and add no element of their own round it,
 *   so the frame shows the component as a window of that size would.
 * @param drawn - The specimen's own drawing.
 * @returns The same, as one element.
 */
export function bare(drawn: ReactNode): ReactElement {
  return createElement(Fragment, null, drawn);
}
