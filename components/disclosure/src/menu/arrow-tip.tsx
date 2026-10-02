/**
 * Renders the arrow's tip: a square rotated 45 degrees with an edge on two sides.
 *
 * @remarks
 *   The two sides past the panel continue the panel's edge, and the panel covers the other two.
 *   The tip reads `--menu-surface`, so it shares the panel's fill in every look.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `div` with the menu's arrow tip class.
 */
const Tipped = withContext("div", "arrowTip");

/**
 * Describes the props of the arrow tip: the props of a `div`.
 */
export type ArrowTipProps = ComponentProps<typeof Tipped>;

/**
 * Renders the arrow tip with the machine's arrow tip props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function ArrowTip(props: ArrowTipProps): ReactElement {
  const { api } = useMenu();

  return <Tipped {...mergeProps(api.getArrowTipProps(), props)} />;
}
