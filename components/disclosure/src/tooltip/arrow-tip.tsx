/**
 * Renders the arrow's tip: a square rotated 45 degrees, one corner past the content's edge.
 *
 * @remarks
 *   The tip reads `--tooltip-surface`, so it shares the content's fill.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTooltip } from "#tooltip/machine.ts";

/**
 * Renders the `div` with the tooltip's arrow tip class.
 */
const Turned = withContext("div", "arrowTip");

/**
 * Describes the props of the arrow tip: the props of a `div`.
 */
export type ArrowTipProps = ComponentProps<typeof Turned>;

/**
 * Renders the arrow tip with the machine's arrow tip props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function ArrowTip(props: ArrowTipProps): ReactElement {
  const api = useTooltip();

  return <Turned {...mergeProps(api.getArrowTipProps(), props)} />;
}
