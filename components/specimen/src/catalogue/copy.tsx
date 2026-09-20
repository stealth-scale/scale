/**
 * Draws the glyph a control that copies code holds: two sheets, one over the other.
 */

import { type ReactElement } from "react";

/**
 * Draws two sheets at the size of the text around them.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the control needs one
 *   mark. It is hidden from a screen reader, which the control around it already names.
 */
export function Copy(): ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 16 16" width="1em">
      <rect height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" width="9" x="5.5" y="5.5" />
      <path
        d="M3 10.5A1.5 1.5 0 0 1 1.5 9V3A1.5 1.5 0 0 1 3 1.5h6A1.5 1.5 0 0 1 10.5 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
