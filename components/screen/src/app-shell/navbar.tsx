/**
 * Renders the panel on the start side, for the application's navigation.
 *
 * @remarks
 *   The element is a `div` with no landmark role. A sidebar inside it renders the navigation
 *   landmarks, one per nav block, each named by its label.
 */

import { type ReactElement } from "react";

import { Panel, type PanelProps } from "#app-shell/panel.tsx";

/**
 * Describes the props of `Navbar`: a panel's props without `side`.
 */
export type NavbarProps = Omit<PanelProps, "side">;

/**
 * Renders a panel on the start side.
 *
 * @param props - How the panel folds and closes, and its content.
 * @returns The panel.
 */
export function Navbar(props: NavbarProps): ReactElement {
  return <Panel side="start" {...props} />;
}
