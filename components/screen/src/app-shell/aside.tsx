/**
 * Renders the panel on the end side, for content that goes with the page.
 *
 * @remarks
 *   The element is `aside`, the `complementary` landmark. Name it with `aria-label` when the
 *   application renders more than one, so each landmark has a distinct name.
 */

import { type ReactElement } from "react";

import { Panel, type PanelProps } from "#app-shell/panel.tsx";

/**
 * Describes the props of `Aside`: a panel's props without `side`.
 */
export type AsideProps = Omit<PanelProps, "side">;

/**
 * Renders a panel on the end side.
 *
 * @param props - How the panel folds and closes, and its content.
 * @returns The panel.
 */
export function Aside(props: AsideProps): ReactElement {
  return <Panel side="end" {...props} />;
}
