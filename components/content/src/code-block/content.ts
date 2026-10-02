/**
 * Renders the scrolling region that contains the code.
 *
 * @remarks
 *   The region is the primitives package's scroll area, and its content is a `pre`, so the browser
 *   preserves spaces and line breaks and assistive technology announces preformatted text. A line
 *   wider than the panel scrolls the area sideways under the theme's thin bar and never wraps.
 *   While a line overflows, the area's viewport is a `region` in the tab order, and the arrow keys
 *   scroll it. While the code fits, the viewport has no role and no tab stop. The region is named
 *   by `CodeBlock.Title` while one renders, and by `label` otherwise. The root draws the focus ring
 *   outside the panel, so the scroll area draws none.
 */

import { type ComponentProps, createElement, type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#code-block/context.ts";
import { useCode } from "#code-block/state.ts";

/**
 * Renders the scroll area's viewport with the recipe's viewport class.
 */
const Viewport = withContext(ScrollArea.Viewport, "viewport");

/**
 * Renders the `pre` with the recipe's content class, which pads the code. The scroll area's
 * content renders it in place of its own `div`.
 */
const Preformatted = withContext("pre", "content");

/**
 * Describes the props of `Content`: the name of the region without a title, and the props of the
 * `pre`, without `as`, because another element in its place would drop the scroll area's content.
 */
export interface ContentProps extends Omit<ComponentProps<typeof Preformatted>, "as"> {
  /**
   * Accessible name of the scrolling region while no title renders. Defaults to `Code`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the `pre` as the content of a scroll area that scrolls sideways, named by the title or
 * by `label`.
 *
 * @param props - The region's name without a title, and the props of the `pre`.
 * @returns The scroll area's root.
 */
export function Content({ label = "Code", ...rest }: ContentProps): ReactElement {
  const { titled, titleId } = useCode();
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the scroll area's content renders the bound pre passed as `as` with every prop, which differ from a div's only in the element type
  const content = { ...rest, as: Preformatted } as ScrollArea.ContentProps;

  return createElement(
    ScrollArea.Root,
    { scrolls: "horizontal" },
    createElement(
      Viewport,
      titled ? { "aria-labelledby": titleId } : { "aria-label": label },
      createElement(ScrollArea.Content, content),
    ),
    createElement(ScrollArea.Scrollbar, { orientation: "horizontal" }),
  );
}
