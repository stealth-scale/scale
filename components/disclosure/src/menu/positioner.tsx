/**
 * Renders the element the machine positions beside the trigger.
 *
 * @remarks
 *   The machine writes the position inline, with `--available-height` and `--available-width`,
 *   and the panel caps its height at the first. A caller who needs the menu outside a clipping
 *   ancestor wraps this part in a portal.
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
 * @returns The `div` element.
 */
export function Positioner(props: PositionerProps): ReactElement {
  const { api } = useMenu();

  return <Placed {...mergeProps(api.getPositionerProps(), props)} />;
}
