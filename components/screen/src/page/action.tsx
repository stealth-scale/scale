/**
 * Renders one action in the header: the library's button, which folds as the page narrows.
 *
 * @remarks
 *   The action renders the library's button, `outline`, or `solid` when `primary`, at the button
 *   size the page sets. On a narrow page an action with an icon shows the icon alone, a primary
 *   action without one keeps its words, and any other action renders nothing and runs from the
 *   menu `Page.Actions` renders. `priority` overrides that choice. `as` renders another control in
 *   the action's place, such as a menu's trigger, and the caller sets its look. `when` renders the
 *   action at one width of the page alone, and a hidden action takes no row in the menu.
 */

import { type ComponentProps, type MouseEvent, type ReactElement, type ReactNode } from "react";

import { Button } from "@stealthscale/component-actions";

import { NARROW, PRIORITY, type Priority, priorityOf, useFoldable } from "#folding/index.ts";
import { withContext } from "#page/context.ts";
import { buttonSizeOf, usePage, useShown, type WhenProps } from "#page/state.ts";

/**
 * Renders the library's button with the recipe's action class.
 */
const Acted = withContext(Button, "action");

/**
 * Describes the props of an action: its icon, whether it is primary, its priority, `when` and the
 * props of the library's button.
 */
export interface ActionProps extends Omit<ComponentProps<typeof Acted>, "onClick">, WhenProps {
  /**
   * Icon before the words, which a narrow page shows alone.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Handler the button or the menu row calls when a reader presses it.
   */
  readonly onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;

  /**
   * Whether the action is the page's primary action, which renders solid and keeps its words.
   */
  readonly primary?: boolean | undefined;

  /**
   * Priority that decides how a narrow page folds the action, in place of the one `icon` and
   * `primary` imply.
   */
  readonly priority?: Priority | undefined;
}

/**
 * Renders the action, or nothing while the page folds it into the menu or `when` hides it.
 *
 * @param props - The icon, the primary flag, the priority, the width and the props of the
 *   library's button.
 * @returns The `button` element, or nothing on a narrow page that folds it and at the other width.
 */
export function Action({
  as,
  children,
  disabled,
  icon,
  onClick,
  primary = false,
  priority,
  when,
  ...rest
}: ActionProps): null | ReactElement {
  const page = usePage();
  const visible = useShown(when);
  const ranked = priorityOf(priority, icon !== undefined, primary);
  const folded = visible && page.narrow && ranked === "tertiary";
  const look =
    as === undefined
      ? ({ size: buttonSizeOf(page), variant: primary ? "solid" : "outline" } as const)
      : {};

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

  if (!visible || folded) return null;

  return (
    <Acted
      as={as}
      disabled={disabled}
      onClick={onClick}
      {...look}
      {...rest}
      {...{ [NARROW]: page.narrow ? "" : undefined, [PRIORITY]: ranked }}
    >
      {icon}
      {icon === undefined ? children : <span>{children}</span>}
    </Acted>
  );
}
