/**
 * Draws the glyph on the control that opens and closes the navigation: a page with a panel down
 * its start side, and an arrow into the panel while it is open.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";

/**
 * Describes what the glyph takes.
 */
export interface PanelProps {
  /**
   * Whether the navigation is open, which draws the arrow that closes it.
   */
  readonly open: boolean;
}

/**
 * Draws a panel glyph at the small icon size, which is the mark a bar's control holds.
 *
 * @remarks
 *   Inline rather than from an icon set, because the library ships none and the bar needs one
 *   mark. The icon is hidden from a screen reader, and the control around it carries the name and
 *   the state.
 * @param props - Whether the navigation is open.
 * @returns The glyph.
 */
export function Panel({ open }: PanelProps): ReactElement {
  return (
    <Icon size="sm" viewBox="0 0 24 24">
      <rect
        fill="none"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        width="18"
        x="3"
        y="3"
      />
      <path
        d="M9 3v18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      {open ? (
        <path
          d="m16 15-3-3 3-3"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ) : null}
    </Icon>
  );
}
