/**
 * Draws the row the bands sit in, moves one tab stop across the controls inside it, and measures
 * its own width.
 *
 * @remarks
 *   The element carries `role="toolbar"`, which is what tells a screen reader that the arrow keys
 *   move between the controls and that Tab leaves the row rather than walking it. The roving focus
 *   group behind it is the accessibility package's, so the keyboard behaviour is written once.
 *   Name the row. A screen holds more than one toolbar, and an unnamed one is announced as
 *   `toolbar` with nothing to say what it acts on.
 *   The row measures itself rather than the window and writes `data-narrow` below the small
 *   breakpoint, which is what the recipe folds the actions on. A row beside an open sidebar is
 *   narrow while the window is wide, and a consumer writes no breakpoint.
 */

import { type ComponentProps, type ReactElement, useRef } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";
import { useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { withProvider } from "#toolbar/context.ts";

/**
 * The breakpoint whose width the row folds its actions below.
 */
const FOLDS_BELOW = "sm";

/**
 * Draws the row under both the toolbar's slot and the roving focus group's own.
 */
const Rowed = withProvider(RovingFocus.Root, "root");

/**
 * Describes what the row takes.
 */
export interface RootProps extends ComponentProps<typeof Rowed> {
  /**
   * The words naming what the toolbar acts on.
   */
  readonly "aria-label": string;
}

/**
 * Gathers the controls that act on what is beside them, under one tab stop.
 *
 * @param props - The recipe's variants, the group's options and the element's props together.
 * @returns The row, holding the bands and carrying whether it is narrow.
 */
export function Root(props: RootProps): ReactElement {
  const measured = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(measured, widthOf(FOLDS_BELOW), FOLDS_BELOW);

  return <Rowed role="toolbar" {...props} data-narrow={narrow ? "" : undefined} ref={measured} />;
}
