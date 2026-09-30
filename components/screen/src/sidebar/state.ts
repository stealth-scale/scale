/**
 * Provides the sidebar's state to its parts, and a nav block's label identifier to its `NavLabel`.
 *
 * @remarks
 *   The root provides whether the sidebar is a rail and how to open the panel it is in, which the
 *   search reads to open the panel before it takes focus. A block creates its label identifier and
 *   the label reads it, so the two always match without an identifier from the caller. A
 *   `NavLabel` outside a block throws.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the state the sidebar's root provides.
 */
export interface SidebarState {
  /**
   * Opens the app shell panel the sidebar is in, and does nothing outside one.
   */
  readonly expand: () => void;

  /**
   * Whether the sidebar is in an app shell panel that `expand` opens.
   */
  readonly expandable: boolean;

  /**
   * Whether the sidebar is a rail of icons.
   */
  readonly iconic: boolean;

  /**
   * Whether the app shell panel the sidebar is in is open, and `true` outside a panel.
   */
  readonly open: boolean;

  /**
   * Size of the sidebar, which its search field renders one size smaller than, down to `sm`.
   */
  readonly size: SidebarSize;
}

/**
 * Size of a sidebar.
 */
export type SidebarSize = "lg" | "md" | "sm";

/**
 * Size of the search field and the rail's search button per sidebar size.
 */
const FIELDS: Readonly<Record<SidebarSize, "md" | "sm">> = { lg: "md", md: "sm", sm: "sm" };

/**
 * Returns the size of a sidebar's search field and of the rail's search button.
 *
 * @param size - The sidebar's size.
 * @returns The field's size, one smaller than the sidebar, down to `sm`.
 */
export function fieldSizeOf(size: SidebarSize): "md" | "sm" {
  return FIELDS[size];
}

/**
 * Provides the sidebar's state and reads it, throwing outside `Sidebar.Root` or returning
 * `undefined` there.
 */
export const [SidebarProvider, useSidebar, useEnclosingSidebar] =
  createRequiredContext<SidebarState>("Sidebar.Root");

/**
 * Describes the state a nav block provides.
 */
export interface NavState {
  /**
   * Identifier of the label, which the block's `aria-labelledby` points at.
   */
  labelId: string;
}

/**
 * Provides the block's state and reads it, throwing outside a `Sidebar.Nav`.
 */
export const [NavProvider, useNav] = createRequiredContext<NavState>("Sidebar.Nav");
