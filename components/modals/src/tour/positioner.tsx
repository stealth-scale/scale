/**
 * Renders the layer that places a step's card.
 *
 * @remarks
 *   On a tooltip step the machine places the positioner against the target and writes the position
 *   inline, flipping to the side with room. On a dialog step the positioner covers the window and
 *   centres the card, and on a floating step it is fixed to the edge of the window the step's
 *   placement names, `bottom-end` by default. A caller renders it in a portal. The positioner
 *   renders nothing while the card is out of the document.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { usePanelPresence, useTourContext } from "#tour/machine.ts";

/**
 * Renders the `div` with the tour's positioner class.
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
 * @returns The `div` element, or nothing while the card is out of the document.
 */
export function Positioner(props: PositionerProps): null | ReactElement {
  const api = useTourContext();
  const { unmounted } = usePanelPresence();

  if (unmounted) return null;

  return <Drawn {...mergeProps(api.getPositionerProps(), props)} />;
}
