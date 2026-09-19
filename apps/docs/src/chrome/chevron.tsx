/**
 * Draws the glyph a switcher's indicator shows: a chevron pointing the way its list opens.
 */

import { type ReactElement } from "react";

/**
 * Draws a chevron at the size of the text around it.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the bar needs one
 *   mark. It is hidden from a screen reader, which the control around it already tells whether
 *   the list is open.
 */
export function Chevron(): ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
