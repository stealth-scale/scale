/**
 * Renders the element the machine positions beside the trigger.
 *
 * @remarks
 *   The machine writes the position inline, with `--available-height` and `--available-width`,
 *   and the panel caps its height at the first. A caller who needs the menu outside a clipping
 *   ancestor wraps this part in a portal. The positioner renders nothing while the panel is out of
 *   the document.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `div` with the menu's positioner class.
 */
const Placed = withContext("div", "positioner");

/**
 * Describes the props of the positioner: the props of a `div`.
 */
export type PositionerProps = ComponentProps<typeof Placed>;

/**
 * Renders the positioner with the machine's positioner props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element, or nothing while the panel is out of the document.
 */
export function Positioner(props: PositionerProps): null | ReactElement {
  const { api, presence } = useMenu();
  const { unmounted } = presence;

  if (unmounted) return null;

  return <Placed {...mergeProps(api.getPositionerProps(), props)} />;
}
