/**
 * Renders the layer that holds the drawer's panel against an edge of the window.
 *
 * @remarks
 *   The positioner covers the window above the backdrop and aligns the panel to the edge the root's
 *   `placement` names. The machine sets `pointer-events: none` on it while the drawer is closed or
 *   not modal. A caller who renders the drawer outside a clipping or stacking ancestor wraps this
 *   part in a portal. The positioner renders nothing while the panel is out of the document.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#drawer/context.ts";
import { useDrawer, usePanelPresence } from "#drawer/machine.ts";

/**
 * Renders the `div` with the drawer's positioner class.
 */
const Drawn = withContext("div", "positioner");

/**
 * Describes the props of the positioner: the props of a `div`.
 */
export type PositionerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the positioner with the machine's positioner props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element, or nothing while the panel is out of the document.
 */
export function Positioner(props: PositionerProps): null | ReactElement {
  const api = useDrawer();
  const { unmounted } = usePanelPresence();

  if (unmounted) return null;

  return <Drawn {...mergeProps(api.getPositionerProps(), props)} />;
}
