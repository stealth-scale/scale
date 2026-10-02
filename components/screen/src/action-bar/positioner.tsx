/**
 * Renders the layer that fixes the bar to the bottom of the window.
 *
 * @remarks
 *   The positioner spans the window inside the inset, above the safe area, and places the bar by
 *   the root's `placement`. It takes no pointer events, so the page beside the bar remains
 *   pressable. Render it where the bar belongs in the tab order, after the list whose selection it
 *   acts on: fixed positioning takes it out of the layout, not out of the order. The positioner
 *   renders nothing while the bar is out of the document.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#action-bar/context.ts";
import { useBarPresence } from "#action-bar/state.ts";

/**
 * Renders the `div` with the action bar's positioner class.
 */
const Drawn = withContext("div", "positioner");

/**
 * Describes the props of the positioner: the props of a `div`.
 */
export type PositionerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the positioner while the bar is in the document.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element, or nothing while the bar is out of the document.
 */
export function Positioner(props: PositionerProps): null | ReactElement {
  const { unmounted } = useBarPresence();

  if (unmounted) return null;

  return <Drawn {...props} />;
}
