/**
 * Renders the arrow's tip: a square rotated 45 degrees, one corner past the panel's edge.
 *
 * @remarks
 *   The tip reads `--popover-surface`, so it shares the panel's fill.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Renders the `div` with the popover's arrow tip class.
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
  const api = usePopover();

  return <Drawn {...mergeProps(api.getArrowTipProps(), props)} />;
}
