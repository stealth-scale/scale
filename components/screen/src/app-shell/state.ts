/**
 * Provides the shell's state to its parts, and a panel's state to its content.
 *
 * @remarks
 *   The module has two contexts. The shell context is available to every part and provides the
 *   panel store and the root element the panels measure. The panel context is available only to
 *   that panel's content, so a part inside a panel reads its panel without a prop.
 */

import { type RefObject, useMemo } from "react";

import { createRequiredContext } from "@stealthscale/hooks";

import { type Panel, type PanelStore, usePanels } from "#app-shell/panels.ts";

/**
 * Selects the side of the page a panel is on.
 */
export type Side = "end" | "start";

/**
 * Selects what closing a panel in the body leaves: nothing, or a rail wide enough for its icons.
 */
export type Collapse = "hide" | "icons";

/**
 * Every `Collapse` value.
 */
export const COLLAPSES: readonly Collapse[] = ["hide", "icons"];

/**
 * Selects where a panel goes when the shell is too narrow to fit it beside the page.
 *
 * @remarks
 *   `over` lays it over the page behind a backdrop, the usual navigation on a phone. `under` drops
 *   it under the page as a block that is always shown, the usual detail panel on a phone.
 */
export type Fold = "over" | "under";

/**
 * Every `Fold` value.
 */
export const FOLDS: readonly Fold[] = ["over", "under"];

/**
 * Selects the widths of the shell a bar renders at: below the width the navigation folds at, or
 * from it.
 */
export type ShellWidth = "narrow" | "wide";

/**
 * Describes the state every part of a shell reads.
 */
export interface ShellState {
  /**
   * Store the panels publish their state to.
   */
  readonly panels: PanelStore;

  /**
   * The root element, which each panel measures.
   *
   * @remarks
   *   A panel measures the root and not the window, so a shell in a frame or a catalogue folds on
   *   its own width. The root is as wide as the shell whatever the panels do, so opening a panel
   *   never changes the measurement that allowed it.
   */
  readonly root: RefObject<HTMLDivElement | null>;
}

/**
 * Provides the shell's state and reads it, throwing outside `AppShell.Root`.
 */
export const [ShellProvider, useShell] = createRequiredContext<ShellState>("AppShell.Root");

/**
 * Provides a panel's state to its content and reads it, throwing outside a panel or returning
 * `undefined` there.
 */
export const [PanelProvider, useNearestPanel, useEnclosingPanel] =
  createRequiredContext<Panel>("an AppShell panel");

/**
 * Reads one panel of the shell by name.
 *
 * @remarks
 *   An application uses it to close its navigation when a destination is pressed. It returns
 *   `undefined` when no panel has the name, and on a panel's first render, because a panel
 *   publishes itself in a layout effect.
 * @param name - The `name` the panel was rendered with, `navbar` or `aside` by default.
 * @returns The panel's state, or `undefined`.
 */
export function useAppShellPanel(name: string): Panel | undefined {
  return usePanels(useShell().panels)[name];
}

/**
 * Returns the panels that are open over the page, which the backdrop and every inert part read.
 *
 * @returns The open panels over the page, or an empty array.
 */
export function useOverlaid(): readonly Panel[] {
  const panels = usePanels(useShell().panels);

  return useMemo(
    () => Object.values(panels).filter((panel) => panel.open && panel.overlaid),
    [panels],
  );
}
