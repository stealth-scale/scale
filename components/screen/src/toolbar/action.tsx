/**
 * Renders one action in the row: the library's button, which folds as the row narrows.
 *
 * @remarks
 *   The action is a roving focus item, so it has the row's tab stop and its arrow keys. It renders
 *   the library's button at the toolbar's size, `ghost`, or `solid` when `primary`. On a narrow row
 *   an action with an icon shows the icon alone, a primary action without one keeps its words, and
 *   any other action renders nothing and runs from the row's menu. `priority` overrides that
 *   choice. A disabled action has `aria-disabled`, the arrow keys step past it, and it calls no
 *   handler. A control of another kind, such as a menu's trigger, renders through `Toolbar.Item`.
 */

import { type MouseEvent, type ReactElement, type ReactNode } from "react";

import { Button } from "@stealthscale/component-actions";

import { NARROW, PRIORITY, type Priority, priorityOf, useFoldable } from "#folding/index.ts";
import { withContext } from "#toolbar/context.ts";
import { Item, type ItemProps } from "#toolbar/item.tsx";
import { useToolbar } from "#toolbar/state.ts";

/**
 * Renders the library's button with the recipe's action class.
 */
const Acted = withContext(Button, "action");

/**
 * Describes the props of an action: its icon, whether it is primary, its priority and the props of
 * the library's button.
 */
export interface ActionProps extends Omit<ItemProps<typeof Acted>, "as" | "href" | "onClick"> {
  /**
   * Icon before the words, which a narrow row shows alone.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Handler the button or the menu row calls when a reader presses it.
   */
  readonly onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;

  /**
   * Whether the action is the row's primary action, which renders solid and keeps its words.
   */
  readonly primary?: boolean | undefined;

  /**
   * Priority that decides how a narrow row folds the action, in place of the one `icon` and
   * `primary` imply.
   */
  readonly priority?: Priority | undefined;
}

/**
 * Renders the action, or nothing while the row folds it into its menu.
 *
 * @param props - The icon, the primary flag, the priority and the props of the library's button.
 * @returns The `button` element, or nothing on a narrow row that folds it.
 */
export function Action({
  children,
  disabled,
  icon,
  onClick,
  primary = false,
  priority,
  ...rest
}: ActionProps): null | ReactElement {
  const { narrow, size } = useToolbar();
  const ranked = priorityOf(priority, icon !== undefined, primary);
  const folded = narrow && ranked === "tertiary";

  useFoldable(folded, {
    disabled,
    label: (
      <>
        {icon}
        {children}
      </>
    ),
    onClick,
  });

  if (folded) return null;

  return (
    <Item
      as={Acted}
      disabled={disabled}
      onClick={disabled === true ? undefined : onClick}
      size={size}
      variant={primary ? "solid" : "ghost"}
      {...rest}
      {...{ [NARROW]: narrow ? "" : undefined, [PRIORITY]: ranked }}
    >
      {icon}
      {icon === undefined ? children : <span>{children}</span>}
    </Item>
  );
}
