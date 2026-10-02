/**
 * Renders the layer that places the floating panel in the window.
 *
 * @remarks
 *   The machine fixes the positioner to the window and writes its place and size inline, and the
 *   panel's place in the stack of open panels as `--z-index`. The positioner drops the machine's
 *   inline `z-index`, the stack index alone, which would put the panel under the page's sticky
 *   bands, and the recipe stacks it at `banner` plus that index. A caller renders it in a portal,
 *   out of any clipping or stacking ancestor. The positioner renders nothing while the panel is out
 *   of the document.
 */

import { type ComponentProps, type CSSProperties, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#floating-panel/context.ts";
import { useFloatingPanel, usePanelPresence } from "#floating-panel/machine.ts";

/**
 * Renders the `div` with the floating panel's positioner class.
 */
const Drawn = withContext("div", "positioner");

/**
 * Describes the props of the positioner: the props of a `div`.
 */
export type PositionerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the positioner with the machine's positioner props, but its inline `z-index`, merged
 * under the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element, or nothing while the panel is out of the document.
 */
export function Positioner(props: PositionerProps): null | ReactElement {
  const { api } = useFloatingPanel();
  const { unmounted } = usePanelPresence();
  const { style, ...machine } = api.getPositionerProps();
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine always writes the positioner's style
  const { zIndex: _stacked, ...placed } = style as CSSProperties;

  if (unmounted) return null;

  return <Drawn {...mergeProps(machine, { style: placed }, props)} />;
}
