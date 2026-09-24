/**
 * Renders the frame that contains the field, the select-all row, the list and the empty text.
 *
 * @remarks
 *   The surface is on the frame, because the element with `role="listbox"` allows only options and
 *   groups as children. The field renders inside the frame and outside the list. The frame clips
 *   its overflow to its corners, and the rows scroll inside the content. The label and the summary
 *   render outside the frame.
 */

import { type ComponentProps } from "react";

import { withContext } from "#listbox/context.ts";

/**
 * Renders the `div` with the listbox's frame class.
 */
export const Frame = withContext("div", "frame");

/**
 * Describes the props of the frame: the props of a `div`.
 */
export type FrameProps = ComponentProps<typeof Frame>;
