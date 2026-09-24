/**
 * Renders the element the machine positions against the content's edge for the arrow.
 *
 * @remarks
 *   The arrow is two elements: this one, which the machine places, and the tip inside it, which is
 *   the rotated square. Neither has text, so a screen reader announces neither.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTooltip } from "#tooltip/machine.ts";

/**
 * Renders the `div` with the tooltip's arrow class.
 */
const Placed = withContext("div", "arrow");

/**
 * Describes the props of the arrow: the props of a `div`.
 */
export type ArrowProps = ComponentProps<typeof Placed>;

/**
 * Renders the arrow with the machine's arrow props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Arrow(props: ArrowProps): ReactElement {
  const api = useTooltip();

  return <Placed {...mergeProps(api.getArrowProps(), props)} />;
}
