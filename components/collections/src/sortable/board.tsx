/**
 * Renders a board: its lists in a row that scrolls sideways in the primitives scroll area.
 *
 * @remarks
 *   Each list is at least 15rem and at most 20rem wide and shares the board's width, so a board
 *   whose lists are wider than its container scrolls sideways under the theme's thin bar. The
 *   scroll area's viewport takes no tab stop of its own, because each row's handle is one, and
 *   focus on a handle scrolls its row into view. dnd-kit scrolls the board while a drag nears its
 *   edge.
 */

import { type ComponentProps, type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#sortable/context.ts";

/**
 * Renders the board's `div` with the recipe's board class.
 */
const Box = withContext("div", "board");

/**
 * Renders the scroll area's content with the recipe's lanes class, which lays the lists out in a
 * row.
 */
const Lanes = withContext(ScrollArea.Content, "lanes");

/**
 * Describes the props of the board: the props of a `div`, whose children are the lists.
 */
export type BoardProps = ComponentProps<typeof Box>;

/**
 * Renders the board's lists in a row inside a scroll area that scrolls sideways.
 *
 * @param props - The props of a `div`, whose children are the lists.
 */
export function Board({ children, ...props }: BoardProps): ReactElement {
  return (
    <Box {...props}>
      <ScrollArea.Root scrolls="horizontal">
        <ScrollArea.Viewport focusable={false}>
          <Lanes>{children}</Lanes>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
      </ScrollArea.Root>
    </Box>
  );
}
