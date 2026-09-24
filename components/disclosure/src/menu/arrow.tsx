/**
 * Renders the element the machine positions against the panel's edge for the arrow.
 *
 * @remarks
 *   The machine places it on the side the panel opened on and sizes it from `--arrow-size`. The
 *   tip inside it is the rotated square, because one element cannot draw an edge on two sides.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `div` with the menu's arrow class.
 */
const Pointed = withContext("div", "arrow");

/**
 * Describes the props of the arrow: the props of a `div`.
 */
export type ArrowProps = ComponentProps<typeof Pointed>;

/**
 * Renders the arrow with the machine's arrow props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Arrow(props: ArrowProps): ReactElement {
  const { api } = useMenu();

  return <Pointed {...mergeProps(api.getArrowProps(), props)} />;
}
