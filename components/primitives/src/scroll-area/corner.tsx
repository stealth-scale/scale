/**
 * Renders the square where the two bars meet.
 *
 * @remarks
 *   The machine sizes the corner to the two bars' thicknesses while both axes overflow, and to
 *   nothing otherwise. Each bar ends where the corner begins, so the two bars do not cross.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#scroll-area/context.ts";
import { useScrollArea } from "#scroll-area/machine.ts";

/**
 * Renders the `div` with the scroll area's corner class.
 */
const Drawn = withContext("div", "corner");

/**
 * Describes the props of the corner: the props of a `div`.
 */
export type CornerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the corner with the machine's props merged under the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Corner(props: CornerProps): ReactElement {
  const api = useScrollArea();

  return <Drawn {...mergeProps(api.getCornerProps(), props)} />;
}
