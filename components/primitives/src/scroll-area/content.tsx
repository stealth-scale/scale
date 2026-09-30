/**
 * Renders the element inside the viewport that contains what scrolls.
 *
 * @remarks
 *   The machine measures the content again whenever it resizes. The root's `scrolls` sets the
 *   content's width: as wide as the viewport for a vertical area, and at least as wide as its
 *   widest child where the area scrolls sideways, so a row that does not wrap overflows the
 *   viewport with the content's padding after it. The recipe sets the width, which the machine
 *   writes inline. The content takes `as` like every part and has no role of its own, so `as="ul"`
 *   renders a list whose items keep their roles.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#scroll-area/context.ts";
import { useScrollArea } from "#scroll-area/machine.ts";

/**
 * Renders the `div` with the scroll area's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`.
 */
export type ContentProps = ComponentProps<typeof Drawn>;

/**
 * Renders the content with the machine's props, without its `presentation` role and its inline
 * width, merged under the caller's.
 *
 * @param props - The props of a `div`, what scrolls among its children.
 * @returns The `div` element, or the element passed as `as`.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useScrollArea();
  const { role: _presentation, style: _width, ...content } = api.getContentProps();

  return <Drawn {...mergeProps(content, props)} />;
}
