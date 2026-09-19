/**
 * Draws the glyph on the control that opens and closes the navigation: a page with a panel down
 * its start side.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";

/**
 * Draws a panel glyph at the size the control states.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the bar needs one
 *   mark. The icon is hidden from a screen reader, and the control around it carries the name.
 */
export function Panel(): ReactElement {
  return (
    <Icon viewBox="0 0 24 24">
      <rect
        fill="none"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        width="18"
        x="3"
        y="3"
      />
      <path d="M9 3v18" fill="none" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}
