/**
 * Draws the glyph the control that empties the rail's search holds: a cross.
 */

import { type ReactElement } from "react";

/**
 * Draws a cross at the size of the text around it.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the control needs one
 *   mark. It is hidden from a screen reader, which the control around it already names.
 */
export function Cross(): ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
