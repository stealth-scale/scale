/**
 * Renders the row with `role="toolbar"`, one tab stop across its controls, and its measured width.
 *
 * @remarks
 *   `role="toolbar"` tells a screen reader that the arrow keys move between the controls and Tab
 *   leaves the row. The roving focus group is the accessibility package's. Name the row with
 *   `aria-label`, because a screen reader announces an unnamed one as "toolbar". The row measures
 *   its own width and sets `data-narrow` below the `sm` breakpoint, and the recipe folds the
 *   actions on it, so a row beside an open sidebar folds on its own width.
 */

import { type ComponentProps, type ReactElement, useRef } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";
import { useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { withProvider } from "#toolbar/context.ts";

/**
 * Breakpoint whose start width the row compares its own width against.
 */
const FOLDS_BELOW = "sm";

/**
 * Renders the roving focus root with the recipe's root class.
 */
const Rowed = withProvider(RovingFocus.Root, "root");

/**
 * Describes the props of the toolbar: its accessible name, the recipe's variants, the roving focus
 * options and the props of a `div`.
 */
export interface RootProps extends ComponentProps<typeof Rowed> {
  /**
   * The accessible name of the row.
   */
  readonly "aria-label": string;
}

/**
 * Renders the row with its measured width.
 *
 * @param props - The name, the variants, the roving focus options and the props of a `div`.
 * @returns The `div` element with `role="toolbar"`.
 */
export function Root(props: RootProps): ReactElement {
  const measured = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(measured, widthOf(FOLDS_BELOW), FOLDS_BELOW);

  return <Rowed role="toolbar" {...props} data-narrow={narrow ? "" : undefined} ref={measured} />;
}
