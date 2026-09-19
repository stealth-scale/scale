/**
 * Draws the glyph a switcher's indicator shows: a chevron each way, which is the mark of a control
 * that opens a list to pick from.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";

/**
 * Draws the two chevrons at the small icon size.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the bar needs one
 *   mark. It is hidden from a screen reader, which the control around it already tells whether
 *   the list is open.
 */
export function Chevron(): ReactElement {
  return (
    <Icon size="sm" viewBox="0 0 24 24">
      <path
        d="m7 15 5 5 5-5M7 9l5-5 5 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
}
