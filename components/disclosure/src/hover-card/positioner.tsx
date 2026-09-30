/**
 * Renders the element the machine positions beside the trigger.
 *
 * @remarks
 *   The machine measures the trigger that opened the card and writes the position inline. A caller
 *   who needs the card outside a clipping or stacking ancestor wraps this part in a portal. The
 *   positioner renders nothing while the panel is out of the document.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#hover-card/context.ts";
import { useCardPresence, useHoverCard } from "#hover-card/machine.ts";

/**
 * Renders the `div` with the hover card's positioner class.
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
  const api = useHoverCard();
  const { unmounted } = useCardPresence();

  if (unmounted) return null;

  return <Drawn {...mergeProps(api.getPositionerProps(), props)} />;
}
