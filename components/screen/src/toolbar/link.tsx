/**
 * Renders one link in the row: an anchor in the look of the library's ghost button, which folds as
 * the row narrows.
 *
 * @remarks
 *   The link is a roving focus item, so it has the row's tab stop and its arrow keys. `current`
 *   marks the reader's page with `aria-current="page"`, which the button's look fills. On a narrow
 *   row a link with an icon shows the icon alone, and a link without one renders nothing and is a
 *   link in the row's menu. `priority` overrides that choice. A router takes the press through
 *   `onClick`, which the menu row calls too.
 */

import { type MouseEventHandler, type ReactElement, type ReactNode } from "react";

import { NARROW, PRIORITY, type Priority, priorityOf, useFoldable } from "#folding/index.ts";
import { Anchor } from "#toolbar/anchor.tsx";
import { withContext } from "#toolbar/context.ts";
import { Item, type ItemProps } from "#toolbar/item.tsx";
import { useToolbar } from "#toolbar/state.ts";

/**
 * Renders the anchor with the recipe's action class.
 */
const Linked = withContext(Anchor, "action");

/**
 * Describes the props of a link: its target, whether it is the current page, its icon, its
 * priority and the props of the library's button.
 */
export interface LinkProps extends Omit<ItemProps<typeof Linked>, "as" | "href" | "onClick"> {
  /**
   * Whether the link is the reader's current page.
   */
  readonly current?: boolean | undefined;

  /**
   * Target of the link.
   */
  readonly href: string;

  /**
   * Icon before the words, which a narrow row shows alone.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Handler the link or the menu row calls when a reader presses it. React's handler type accepts
   * a router's anchor handler.
   */
  readonly onClick?: MouseEventHandler<HTMLElement> | undefined;

  /**
   * Priority that decides how a narrow row folds the link, in place of the one `icon` implies.
   */
  readonly priority?: Priority | undefined;
}

/**
 * Renders the link, or nothing while the row folds it into its menu.
 *
 * @param props - The target, the current flag, the icon, the priority and the button's props.
 * @returns The `a` element, or nothing on a narrow row that folds it.
 */
export function Link({
  children,
  current = false,
  href,
  icon,
  onClick,
  priority,
  ...rest
}: LinkProps): null | ReactElement {
  const { narrow, size } = useToolbar();
  const ranked = priorityOf(priority, icon !== undefined, false);
  const folded = narrow && ranked === "tertiary";

  useFoldable(folded, {
    current,
    href,
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
      aria-current={current ? "page" : undefined}
      as={Linked}
      href={href}
      onClick={onClick}
      size={size}
      variant="ghost"
      {...rest}
      {...{ [NARROW]: narrow ? "" : undefined, [PRIORITY]: ranked }}
    >
      {icon}
      {icon === undefined ? children : <span>{children}</span>}
    </Item>
  );
}
