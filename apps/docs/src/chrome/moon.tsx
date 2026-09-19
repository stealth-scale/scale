/**
 * Draws the glyph for the dark mode: a moon.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";

/**
 * Draws a moon at the small icon size, which is the mark a bar's control holds.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the bar needs one
 *   mark. It is hidden from a screen reader, and the control around it carries the name.
 */
export function Moon(): ReactElement {
  return (
    <Icon size="sm" viewBox="0 0 24 24">
      <path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
}
