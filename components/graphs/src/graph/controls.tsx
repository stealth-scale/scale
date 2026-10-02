/**
 * Renders a graph's controls: a toolbar above the canvas, one tab stop, whose arrows move between
 * its controls.
 *
 * @remarks
 *   The toolbar renders in `Graph.Root` beside `Graph.Canvas`, so it covers no node, and acts on
 *   the canvas through React Flow's store, which the root provides. It is the a11y package's
 *   `RovingFocus` in the `toolbar` role, named by `label`, and renders `Graph.Control` and
 *   `Graph.ZoomLevel`. Its buttons are the actions `IconButton` at the small size and the ghost
 *   look. React Flow removes the selection on Delete from anywhere on the page but an input. The
 *   toolbar has React Flow's `nokey` class, so React Flow ignores a key pressed on a control.
 */

import { type ReactElement } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";
import { ButtonPropsProvider } from "@stealthscale/component-actions";

import { withContext } from "#graph/context.ts";

/**
 * Renders the roving focus group with the recipe's controls class.
 */
const Bar: (props: RovingFocus.RootProps) => ReactElement = withContext(
  RovingFocus.Root,
  "controls",
);

/**
 * Describes the props of the controls: their name and the roving focus group's props.
 */
export interface ControlsProps extends Omit<RovingFocus.RootProps, "aria-label" | "role"> {
  /**
   * Accessible name of the toolbar. `Canvas` unless stated.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the toolbar with small ghost buttons.
 *
 * @param props - The name and the group's props.
 */
export function Controls({ label = "Canvas", ...props }: ControlsProps): ReactElement {
  return (
    <ButtonPropsProvider value={{ size: "sm", variant: "ghost" }}>
      <Bar aria-label={label} className="nokey" role="toolbar" {...props} />
    </ButtonPropsProvider>
  );
}
