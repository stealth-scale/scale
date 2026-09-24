/**
 * Renders the button that opens the menu.
 *
 * @remarks
 *   The machine sets `aria-haspopup`, `aria-expanded` and `aria-controls`. A trigger with a `value`
 *   is one of several triggers that share one menu, and the machine places the panel against the
 *   one that opened it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `button` with the menu's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: its value and the props of a `button`.
 */
export interface TriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * Value that identifies the trigger, for a menu opened from several.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the trigger with the machine's trigger props merged over the caller's.
 *
 * @param props - The trigger's value and the props of a `button`.
 * @returns The `button` element.
 */
export function Trigger({ value, ...rest }: TriggerProps): ReactElement {
  const { api } = useMenu();
  const named = value === undefined ? {} : { value };

  return <Pressed {...mergeProps(api.getTriggerProps(named), rest)} />;
}
