/**
 * Draws the glyph a control that shows source holds: two angle brackets.
 */

import { type ReactElement } from "react";

/**
 * Draws two angle brackets at the size of the text around them.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the control needs one
 *   mark. It is hidden from a screen reader, which the control around it already names.
 */
export function CodeGlyph(): ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
      <path
        d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
