/**
 * Renders one panel.
 *
 * @remarks
 *   The panel takes the `value` of the tab that shows it. The machine sets `role="tabpanel"`,
 *   `aria-labelledby` and `hidden` on a panel that is not selected. A panel takes `tabIndex={0}`,
 *   so Tab from the list lands on the selected panel.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tabs/context.ts";
import { useTabs } from "#tabs/machine.ts";

/**
 * Renders the `div` with the tabs' content class.
 */
const Shown = withContext("div", "content");

/**
 * Describes the props of a panel: its value and the props of a `div`.
 */
export interface ContentProps extends ComponentProps<typeof Shown> {
  /**
   * Value of the tab that shows the panel.
   */
  readonly value: string;
}

/**
 * Renders a panel with the machine's content props merged over the caller's.
 *
 * @param props - The tab's value and the props of a `div`.
 * @returns The `div` element.
 */
export function Content({ value, ...rest }: ContentProps): ReactElement {
  const api = useTabs();

  return <Shown {...mergeProps(api.getContentProps({ value }), rest)} />;
}
