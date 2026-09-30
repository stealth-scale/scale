/**
 * Builds the switchers the specifications render inside a sidebar and inside a toolbar.
 */

import { type ComponentProps, type ReactElement } from "react";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Root as Sidebar, type RootProps as SidebarProps } from "#sidebar/root.tsx";
import { type RootProps } from "#switcher/root.tsx";
import { chosen } from "#switcher/switcher.fixtures.tsx";
import { Root as Toolbar } from "#toolbar/root.tsx";

/**
 * Renders the workspaces switcher at the head of a sidebar.
 *
 * @param sidebar - The sidebar's props.
 * @param props - The switcher's props.
 * @returns The sidebar with the switcher inside it.
 */
export function inSidebar(sidebar: SidebarProps = {}, props: RootProps = {}): ReactElement {
  return <Sidebar {...sidebar}>{chosen(props)}</Sidebar>;
}

/**
 * Renders the workspaces switcher in a toolbar.
 *
 * @param size - The toolbar's size.
 * @param props - The switcher's props.
 * @returns The toolbar with the switcher inside it.
 */
export function inToolbar(
  size: ComponentProps<typeof Toolbar>["size"] = "md",
  props: RootProps = {},
): ReactElement {
  return (
    <Toolbar aria-label="Application" size={size}>
      {chosen(props)}
    </Toolbar>
  );
}

/**
 * Renders the workspaces switcher in a toolbar at a phone's width.
 *
 * @returns The toolbar in a 375px viewport.
 */
export function inNarrowToolbar(): ReactElement {
  return narrowed(inToolbar());
}
