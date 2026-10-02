/**
 * Renders the thumb inside a bar, whose length and position show the part of the content in view.
 *
 * @remarks
 *   The machine writes the thumb's length through a custom property on the root and moves it with
 *   an inline transform. The thumb takes the orientation of the bar it is rendered in.
 */

import { type ComponentProps, type ReactElement, use } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#scroll-area/context.ts";
import { useScrollArea } from "#scroll-area/machine.ts";
import { OrientationContext } from "#scroll-area/orientation.ts";

/**
 * Renders the `div` with the scroll area's thumb class.
 */
const Drawn = withContext("div", "thumb");

/**
 * Describes the props of the thumb: the props of a `div`.
 */
export type ThumbProps = ComponentProps<typeof Drawn>;

/**
 * Renders the thumb with the machine's props merged under the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Thumb(props: ThumbProps): ReactElement {
  const api = useScrollArea();
  const orientation = use(OrientationContext);

  return <Drawn {...mergeProps(api.getThumbProps({ orientation }), props)} />;
}
