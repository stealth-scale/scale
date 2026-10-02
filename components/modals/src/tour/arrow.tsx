/**
 * Renders the element the machine places against the card's edge for the arrow.
 *
 * @remarks
 *   The arrow shows on a tooltip step whose step sets `arrow`, which a tooltip step does by
 *   default, once the machine has placed the card. It is two elements: this one, which the machine
 *   places, and the tip inside it, which is the rotated square. Neither has text, so a screen
 *   reader announces neither.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tour/context.ts";
import { useTourContext } from "#tour/machine.ts";

/**
 * Renders the `div` with the tour's arrow class.
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
 * @returns The `div` element, hidden while the step has no arrow.
 */
export function Arrow(props: ArrowProps): ReactElement {
  const api = useTourContext();
  const hidden = api.step?.arrow === true ? {} : { hidden: true };

  return <Drawn {...mergeProps(api.getArrowProps(), hidden, props)} />;
}
