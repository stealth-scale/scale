/**
 * Renders the window the marquee's copies move through.
 *
 * @remarks
 *   The machine lays the copies out inline in a row or a column, reversed for the `end` and
 *   `bottom` sides so a copy enters from the side it moves away from, and reports a loop and the
 *   last loop from the first copy's animation. The recipe clips the copies to the viewport.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#marquee/context.ts";
import { useMarquee } from "#marquee/machine.ts";

/**
 * Renders the `div` with the marquee's viewport class.
 */
const Drawn = withContext("div", "viewport");

/**
 * Describes the props of the viewport: the props of a `div`.
 */
export type ViewportProps = ComponentProps<typeof Drawn>;

/**
 * Renders the viewport with the machine's viewport props merged under the caller's.
 *
 * @param props - The content and the props of a `div`.
 * @returns The `div` element.
 */
export function Viewport(props: ViewportProps): ReactElement {
  const { api } = useMarquee();

  return <Drawn {...mergeProps(api.getViewportProps(), props)} />;
}
