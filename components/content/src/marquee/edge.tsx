/**
 * Renders the fade at one end of the marquee, where items enter or leave.
 *
 * @remarks
 *   The edge is an empty element the machine places inline over the viewport's end, with pointer
 *   events off. Its presence makes the viewport mask that end of the strip from transparent to
 *   opaque over a fifth of the marquee, so the items fade into whatever the marquee sits on: a
 *   page, a panel or a picture. `start` and `end` follow the writing direction.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type Side } from "@zag-js/marquee";
import { mergeProps } from "@zag-js/react";

import { withContext } from "#marquee/context.ts";
import { useMarquee } from "#marquee/machine.ts";

/**
 * Renders the `div` with the marquee's edge class.
 */
const Drawn = withContext("div", "edge");

/**
 * Describes the props of an edge: the side and the props of a `div`.
 */
export interface EdgeProps extends ComponentProps<typeof Drawn> {
  /**
   * End of the marquee the edge fades: `start` or `end` across, `top` or `bottom` down.
   */
  readonly side: Side;
}

/**
 * Renders the edge with the machine's edge props merged under the caller's.
 *
 * @param props - The side and the props of a `div`.
 * @returns The `div` element.
 */
export function Edge({ side, ...props }: EdgeProps): ReactElement {
  const { api } = useMarquee();

  return <Drawn {...mergeProps(api.getEdgeProps({ side }), props)} />;
}
