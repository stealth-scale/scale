/**
 * Derives where a switcher renders from the sidebar or the toolbar around it, and provides it to
 * the switcher's parts.
 *
 * @remarks
 *   A switcher in a sidebar is a row at the sidebar's size, and its mark alone while the sidebar
 *   is a rail. A switcher in a toolbar is one of the row's controls at the toolbar's size, and a
 *   switcher with a mark hides its name while the toolbar is narrow. Anywhere else it is one line
 *   at its own size. A caller's `placement` or `size` applies over the derived one.
 */

import { createRequiredContext } from "@stealthscale/hooks";
import { type Scale } from "@stealthscale/theme/authoring";

import { type SidebarState, useEnclosingSidebar } from "#sidebar/state.ts";
import { type ToolbarState, useEnclosingToolbar } from "#toolbar/state.ts";

/**
 * Selects where a switcher renders.
 */
export type Placement = "alone" | "sidebar" | "toolbar";

/**
 * Selects the size of a switcher.
 */
export type SwitcherSize = "lg" | "md" | "sm";

/**
 * Maps a toolbar's size to the nearest switcher size: `sm` up to `sm`, and `lg` from `lg`.
 */
const SIZES: Readonly<Record<Scale, SwitcherSize>> = {
  "2xl": "lg",
  "3xl": "lg",
  "4xl": "lg",
  lg: "lg",
  md: "md",
  sm: "sm",
  xl: "lg",
  xs: "sm",
};

/**
 * Describes where a switcher renders and what that decides.
 */
export interface SwitcherState {
  /**
   * Whether the switcher renders its mark alone, in a sidebar closed to a rail.
   */
  readonly iconic: boolean;

  /**
   * Whether the switcher hides its name, in a narrow toolbar.
   */
  readonly narrow: boolean;

  /**
   * Where the switcher renders.
   */
  readonly placement: Placement;

  /**
   * Whether a toolbar is around the switcher, whose arrow keys reach its trigger.
   */
  readonly roving: boolean;

  /**
   * Size of the switcher.
   */
  readonly size: SwitcherSize;
}

/**
 * Provides the switcher's state and reads it, throwing outside `Switcher.Root`.
 */
export const [SwitcherProvider, useSwitcher] =
  createRequiredContext<SwitcherState>("Switcher.Root");

/**
 * Returns the placement a switcher takes from what is around it.
 *
 * @param inSidebar - Whether a sidebar is around the switcher.
 * @param inToolbar - Whether a toolbar is around the switcher.
 * @returns `sidebar`, `toolbar` or `alone`, the nearest sidebar first.
 */
function placementOf(inSidebar: boolean, inToolbar: boolean): Placement {
  if (inSidebar) return "sidebar";
  if (inToolbar) return "toolbar";

  return "alone";
}

/**
 * Returns the state of a switcher in a sidebar: a row at the sidebar's size, iconic on a rail.
 *
 * @param sidebar - The sidebar around the switcher, if any.
 * @param size - The caller's size.
 * @returns The state.
 */
function rowOf(sidebar: SidebarState | undefined, size?: SwitcherSize): SwitcherState {
  return {
    iconic: sidebar?.iconic ?? false,
    narrow: false,
    placement: "sidebar",
    roving: false,
    size: size ?? sidebar?.size ?? "md",
  };
}

/**
 * Returns the state of a switcher in a toolbar: a control at the toolbar's size, narrow with it.
 *
 * @param toolbar - The toolbar around the switcher, if any.
 * @param size - The caller's size.
 * @returns The state.
 */
function controlOf(toolbar: ToolbarState | undefined, size?: SwitcherSize): SwitcherState {
  return {
    iconic: false,
    narrow: toolbar?.narrow ?? false,
    placement: "toolbar",
    roving: toolbar !== undefined,
    size: size ?? SIZES[toolbar?.size ?? "md"],
  };
}

/**
 * Returns where a switcher renders, from the caller's settings and the sidebar or toolbar around
 * it.
 *
 * @param placement - The caller's placement, which applies over the derived one.
 * @param size - The caller's size, which applies over the derived one.
 * @returns The placement, the size, and whether the switcher is iconic or narrow.
 */
export function usePlaced(placement?: Placement, size?: SwitcherSize): SwitcherState {
  const sidebar = useEnclosingSidebar();
  const toolbar = useEnclosingToolbar();
  const placed = placement ?? placementOf(sidebar !== undefined, toolbar !== undefined);

  if (placed === "sidebar") return rowOf(sidebar, size);
  if (placed === "toolbar") return controlOf(toolbar, size);

  return { iconic: false, narrow: false, placement: placed, roving: false, size: size ?? "md" };
}
