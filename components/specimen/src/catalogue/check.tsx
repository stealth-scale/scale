/**
 * Draws the glyph a control shows once it has copied: a check mark.
 */

import { type ReactElement } from "react";

/**
 * Draws a check mark at the size of the text around it.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the control needs one
 *   mark. It is hidden from a screen reader, which the control around it already names.
 */
export function Check(): ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
      <path
        d="M3 8.5l3 3 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
