/**
 * Renders the scroll container around a table, and receives the recipe's variants.
 *
 * @remarks
 *   The table scrolls in both axes in the primitives package's scroll area inside the scroller,
 *   under the theme's thin bars. WCAG 2.1.1 requires a keyboard to reach a region a pointer can
 *   scroll: while the table overflows, the area's viewport is a `region` in the tab order and the
 *   arrow keys scroll it. While the table fits the viewport takes neither, so a page of tables has
 *   no empty tab stops and no extra landmarks. Name the region with `aria-labelledby` pointing at
 *   the caption, or with `aria-label`: both go to the viewport. A table whose cells take focus,
 *   such as a grid with a roving tab stop, passes `focusable={false}`: focus on a cell scrolls the
 *   cell into view, and the viewport keeps no tab stop of its own. The scroller receives the
 *   variants, because the edge and the corners belong to the element that clips them, and it
 *   renders the focus ring while the viewport has focus. A sticky header and a sticky column stick
 *   to the viewport. `viewportRef` receives the viewport, the element that scrolls, for a caller
 *   that renders only the rows in view.
 */

import { type ComponentProps, type ReactElement, type Ref } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";
import { omitUndefined } from "@stealthscale/hooks";

import { withContext, withProvider } from "#table/context.ts";

/**
 * Renders the `div` with the recipe's variants.
 */
const Box = withProvider("div", "scroller");

/**
 * Renders the scroll area's viewport with the recipe's viewport class.
 */
const Viewport = withContext(ScrollArea.Viewport, "viewport");

/**
 * Describes the props of the scroller: whether the viewport takes a tab stop, the recipe's
 * variants and the props of a `div`.
 */
export interface ScrollerProps extends ComponentProps<typeof Box> {
  /**
   * Whether the viewport is a region with a tab stop while the table overflows. `false` keeps it
   * out of the tab order, for a table whose cells take focus. `true` unless stated.
   */
  readonly focusable?: boolean | undefined;

  /**
   * Ref of the scroll area's viewport, the element that scrolls.
   */
  readonly viewportRef?: Ref<HTMLDivElement> | undefined;
}

/**
 * Renders the scroller around a scroll area whose viewport takes the region's name.
 *
 * @param props - Whether the viewport takes a tab stop, the viewport's ref, the recipe's variants
 *   and the props of a `div`, whose `aria-label` and `aria-labelledby` name the viewport.
 * @returns The `div` element.
 */
export function Scroller({
  "aria-label": label,
  "aria-labelledby": labelledBy,
  children,
  focusable = true,
  viewportRef,
  ...rest
}: ScrollerProps): ReactElement {
  return (
    <Box {...rest}>
      <ScrollArea.Root scrolls="both">
        <Viewport
          focusable={focusable}
          ref={viewportRef}
          {...omitUndefined({ "aria-label": label, "aria-labelledby": labelledBy })}
        >
          <ScrollArea.Content>{children}</ScrollArea.Content>
        </Viewport>
        <ScrollArea.Scrollbar />
        <ScrollArea.Scrollbar orientation="horizontal" />
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </Box>
  );
}
