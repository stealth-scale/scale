/**
 * Renders the arrow's tip: a square rotated 45 degrees, one corner past the note's edge.
 *
 * @remarks
 *   The tip reads `--toggle-tip-surface`, so it shares the note's fill.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toggle-tip/context.ts";
import { useToggleTip } from "#toggle-tip/machine.ts";

/**
 * Renders the `div` with the toggle tip's arrow tip class.
 */
const Drawn = withContext("div", "arrowTip");

/**
 * Describes the props of the arrow tip: the props of a `div`.
 */
export type ArrowTipProps = ComponentProps<typeof Drawn>;

/**
 * Renders the arrow tip with the machine's arrow tip props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function ArrowTip(props: ArrowTipProps): ReactElement {
  const api = useToggleTip();

  return <Drawn {...mergeProps(api.getArrowTipProps(), props)} />;
}
