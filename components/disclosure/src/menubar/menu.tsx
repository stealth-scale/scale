/**
 * Renders one menu of the bar: a name and the panel it opens.
 *
 * @remarks
 *   The bar decides whether the menu is open, so a menu that opens closes the one open. The menu
 *   takes the bar's size, look, palette, highlight and direction. In the folded bar's menu it is a
 *   submenu of the fold, which opens and closes by the menu's own rules.
 */

import { type ReactElement } from "react";

import { Root as MenuRoot, type RootProps as MenuRootProps } from "#menu/root.tsx";
import { MenuValueProvider, useBar, useFolded } from "#menubar/bar.ts";

/**
 * Describes the props of a menu: its value and the props of a menu root, whose open state the bar
 * keeps.
 */
export interface MenuProps extends Omit<MenuRootProps, "defaultOpen" | "onOpenChange" | "open"> {
  /**
   * Value of the menu, which the bar reports while the menu is open.
   */
  readonly value: string;
}

/**
 * Renders the menu's root, opened and closed by the bar outside the folded bar's menu.
 *
 * @param props - The value, the name, the panel and the props of a menu root.
 * @returns The menu root inside the value's provider.
 */
export function Menu({ value, ...props }: MenuProps): ReactElement {
  const { closeValue, menus, setValue, value: open } = useBar();
  const folded = useFolded();

  /**
   * Reports to the bar that the menu opened or closed.
   */
  const changed: MenuRootProps["onOpenChange"] = (details) => {
    if (details.open) setValue(value);
    else closeValue(value);
  };
  const driven = folded === undefined ? { onOpenChange: changed, open: open === value } : {};

  return (
    <MenuValueProvider value={value}>
      <MenuRoot {...menus} {...driven} {...props} />
    </MenuValueProvider>
  );
}
