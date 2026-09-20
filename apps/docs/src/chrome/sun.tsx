/**
 * Draws the glyph for the light mode: a sun.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";

/**
 * Draws a sun at the small icon size, which is the mark a bar's control holds.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the bar needs one
 *   mark. It is hidden from a screen reader, and the control around it carries the name.
 */
export function Sun(): ReactElement {
  return (
    <Icon size="sm" viewBox="0 0 24 24">
      <circle cx="12" cy="12" fill="none" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
}
