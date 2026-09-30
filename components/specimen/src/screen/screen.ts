/**
 * Renders the window an application's shell or a page renders in, in a scene.
 *
 * @remarks
 *   A shell fills the height of its window, and a catalogue page shows one shell per scene. With a
 *   size, the box gives a shell a window of that height, and a narrow shell's sheet opens inside
 *   the box. Without one, the box is as tall as the page in it and renders the page's edges. With
 *   `scrolls`, the box renders its content in the primitives package's scroll area, which fills
 *   the box and scrolls a shell that scrolls its window. The viewport takes no tab stop, because a
 *   shell's controls scroll into view as they take focus. The box is staging and never appears in
 *   an example.
 */

import { type ComponentProps, createElement, type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#screen/context.ts";

/**
 * Renders a `div` element with the classes of the screen recipe.
 */
const Box = withContext("div");

/**
 * Describes the props of Screen: the height, whether it scrolls and the props of a `div` element.
 */
export type ScreenProps = ComponentProps<typeof Box>;

/**
 * Renders the box, around a scroll area of its content when it scrolls.
 *
 * @param props - The height, whether the box scrolls, and the props of a `div` element.
 * @returns The `div` element.
 */
export function Screen({ children, ...props }: ScreenProps): ReactElement {
  return createElement(
    Box,
    props,
    props.scrolls === true
      ? createElement(
          ScrollArea.Root,
          null,
          createElement(
            ScrollArea.Viewport,
            { focusable: false },
            createElement(ScrollArea.Content, null, children),
          ),
          createElement(ScrollArea.Scrollbar),
        )
      : children,
  );
}
