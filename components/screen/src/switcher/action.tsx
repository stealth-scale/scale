/**
 * Renders a row of the switcher's menu that does something other than switch: create a workspace,
 * open its settings.
 *
 * @remarks
 *   The row is the menu's item, so it takes the menu's keys and closes the menu when chosen. It
 *   generates the value the menu identifies it by unless the caller passes one. `Switcher.Root`
 *   renders these rows after a separator under the items.
 */

import { type ComponentProps, type ReactElement, type ReactNode, useId } from "react";

import { Menu } from "@stealthscale/component-disclosure";

/**
 * Describes the props of `Action`: its icon, an optional value and the menu item's props.
 */
export interface ActionProps extends Omit<ComponentProps<typeof Menu.Item>, "value"> {
  /**
   * Mark before the words.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Value the menu identifies the row by. A generated one when absent.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the row with its icon before its words.
 *
 * @param props - The icon, the value and the menu item's props.
 * @returns The menu item.
 */
export function Action({ children, icon, value, ...rest }: ActionProps): ReactElement {
  const generated = useId();

  return (
    <Menu.Item {...rest} value={value ?? generated}>
      {icon}
      {children}
    </Menu.Item>
  );
}
