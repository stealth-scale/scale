/**
 * Renders one control of a graph's toolbar: zoom in, zoom out, or fit the graph in view.
 *
 * @remarks
 *   The control is the actions `IconButton` as an item of the toolbar's roving focus group, named
 *   by `label`, with the caller's glyph. It acts on the canvas through React Flow's store, which
 *   the root provides. Fitting frames the whole graph as the canvas does on its first render.
 */

import { type ReactElement } from "react";

import { useReactFlow } from "@xyflow/react";

import { RovingFocus } from "@stealthscale/component-a11y";
import { IconButton } from "@stealthscale/component-actions";

import { FIT } from "#graph/fit.ts";

/**
 * Describes what a control does to the view.
 */
export type ControlAction = "fit" | "zoomIn" | "zoomOut";

/**
 * Describes the props of a control: what it does, its name, and a roving item's props.
 */
export interface ControlProps extends Omit<RovingFocus.ItemProps, "aria-label" | "as" | "onClick"> {
  /**
   * Action the control takes on the view: zoom in, zoom out, or fit the graph in view.
   */
  readonly action: ControlAction;

  /**
   * Accessible name of the control, such as `Zoom in`.
   */
  readonly label: string;
}

/**
 * Renders the control as a toolbar item that zooms or fits the view when pressed.
 *
 * @param props - The action, the name and the item's props.
 */
export function Control({ action, label, ...props }: ControlProps): ReactElement {
  const flow = useReactFlow();

  /**
   * Zooms or fits the view by the control's action.
   */
  function act(): void {
    if (action === "fit") void flow.fitView(FIT);
    else if (action === "zoomIn") void flow.zoomIn();
    else void flow.zoomOut();
  }

  return <RovingFocus.Item aria-label={label} as={IconButton} onClick={act} {...props} />;
}
