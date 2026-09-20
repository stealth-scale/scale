/**
 * Draws the box a table too wide for the page scrolls inside.
 *
 * @remarks
 *   A region a pointer can scroll has to be reachable by a keyboard. WCAG 2.1.1 fails a table a
 *   pointer can scroll and a keyboard cannot, and it is the failure a table component is most often
 *   reported for. The tab stop appears only while there is something to scroll. A box that always
 *   took one put a stop on every table on a page whether or not the stop went anywhere, and a stop
 *   that does nothing is one a reader presses through on the way to what they wanted. The box is
 *   measured again as it resizes, as its rows change and once the fonts have loaded, so the stop
 *   goes when a wider window makes the table fit. Name it. A focusable box with no name is
 *   announced as nothing at all, so point `aria-labelledby` at the caption's `id` or state
 *   `aria-label`. The scroller states the variants, not the table, because the look of the edge and
 *   the corner belong to the box that clips them.
 */

import { type ComponentProps, type ReactElement, type Ref, useCallback, useRef } from "react";

import { useIsOverflowing } from "@stealthscale/hooks";

import { withProvider } from "#table/context.ts";

/**
 * Scrolls the table sideways, and states the variants every part reads.
 */
const Box = withProvider("div", "scroller");

/**
 * Describes what the box takes: the recipe's variants, and everything a styled div takes.
 */
export type ScrollerProps = ComponentProps<typeof Box>;

/**
 * Fills a caller's ref with whatever an element was drawn as, whichever kind of ref it is.
 */
function filled(ref: Ref<HTMLDivElement> | undefined, node: HTMLDivElement | null): void {
  if (typeof ref === "function") ref(node);
  else if (ref !== null && ref !== undefined) ref.current = node;
}

/**
 * Scrolls the table, and takes a tab stop while there is something to scroll.
 *
 * @param props - The recipe's variants, and everything a styled div takes.
 * @returns The box, focusable where it scrolls.
 */
export function Scroller({ ref, ...rest }: ScrollerProps): ReactElement {
  const held = useRef<HTMLDivElement | null>(null);
  const { overflows } = useIsOverflowing(held);

  const taken = useCallback(
    (node: HTMLDivElement | null): void => {
      held.current = node;
      filled(ref, node);
    },
    [ref],
  );

  return <Box {...rest} ref={taken} {...(overflows ? { tabIndex: 0 } : {})} />;
}
