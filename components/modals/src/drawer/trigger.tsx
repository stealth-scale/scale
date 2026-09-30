/**
 * Renders a button that opens the drawer.
 *
 * @remarks
 *   The element is a `button`, so a keyboard focuses it. The machine sets `aria-haspopup`,
 *   `aria-expanded`, `aria-controls` and the press handler. More than one trigger can open a
 *   drawer. Each passes its own `value`, and the machine reports the value of the one pressed as
 *   the root's `triggerValue`. Focus returns to that trigger when the drawer closes.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#drawer/context.ts";
import { useDrawer } from "#drawer/machine.ts";

/**
 * Renders the `button` with the drawer's trigger class.
 */
const Drawn = withContext("button", "trigger");

/**
 * Describes the props of the trigger: the props of a `button`, and the value that tells this
 * trigger apart from the drawer's other triggers.
 */
export interface TriggerProps extends Omit<ComponentProps<typeof Drawn>, "value"> {
  /**
   * The value the root reports as `triggerValue` while this trigger opened the drawer. Absent for a
   * drawer with one trigger.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the trigger with the machine's trigger props merged over the caller's.
 *
 * @param props - The value and the props of a `button`.
 * @returns The `button` element.
 */
export function Trigger({ value, ...props }: TriggerProps): ReactElement {
  const api = useDrawer();

  return (
    <Drawn {...mergeProps(api.getTriggerProps(value === undefined ? {} : { value }), props)} />
  );
}
