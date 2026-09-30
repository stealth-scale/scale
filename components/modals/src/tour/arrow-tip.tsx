/**
 * Renders the arrow's tip: a square rotated 45 degrees, one corner past the card's edge.
 *
 * @remarks
 *   The tip reads the card's surface, so it shares the card's fill, and renders the card's edge on
 *   its two outer sides.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { useTourContext } from "#tour/machine.ts";

/**
 * Renders the `div` with the tour's arrow tip class.
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
  const api = useTourContext();

  return <Drawn {...mergeProps(api.getArrowTipProps(), props)} />;
}
