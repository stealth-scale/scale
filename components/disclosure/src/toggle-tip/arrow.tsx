/**
 * Renders the element the machine positions against the note's edge for the arrow.
 *
 * @remarks
 *   The arrow is two elements: this one, which the machine places, and the tip inside it, which is
 *   the rotated square. Neither has text, so a screen reader announces neither.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toggle-tip/context.ts";
import { useToggleTip } from "#toggle-tip/machine.ts";

/**
 * Renders the `div` with the toggle tip's arrow class.
 */
const Drawn = withContext("div", "arrow");

/**
 * Describes the props of the arrow: the props of a `div`.
 */
export type ArrowProps = ComponentProps<typeof Drawn>;

/**
 * Renders the arrow with the machine's arrow props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Arrow(props: ArrowProps): ReactElement {
  const api = useToggleTip();

  return <Drawn {...mergeProps(api.getArrowProps(), props)} />;
}
