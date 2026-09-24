/**
 * Renders one tab.
 *
 * @remarks
 *   The tab takes the `value` of the panel it shows. The machine sets `role="tab"`,
 *   `aria-selected`, `aria-controls` and the tab index. Only the selected tab is in the tab order,
 *   so Tab reaches the list once and the arrow keys move inside it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tabs/context.ts";
import { useTabs } from "#tabs/machine.ts";

/**
 * Renders the `button` with the tabs' trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of a tab: its value, whether it is disabled and the props of a `button`.
 */
export interface TriggerProps extends ComponentProps<typeof Pressed> {
  /**
   * Whether the tab is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Value of the panel the tab shows.
   */
  readonly value: string;
}

/**
 * Renders a tab with the machine's trigger props merged over the caller's.
 *
 * @param props - The panel's value, the disabled flag and the props of a `button`.
 * @returns The `button` element.
 */
export function Trigger({ disabled, value, ...rest }: TriggerProps): ReactElement {
  const api = useTabs();
  const stated = { ...(disabled === undefined ? {} : { disabled }), value };

  return <Pressed {...mergeProps(api.getTriggerProps(stated), rest)} />;
}
