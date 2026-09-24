/**
 * Renders the scroll container around a table, and receives the recipe's variants.
 *
 * @remarks
 *   WCAG 2.1.1 requires a keyboard to reach a region a pointer can scroll. While the table
 *   overflows, the scroller takes `tabIndex={0}` and `role="region"`, the pattern the WAI-ARIA
 *   practices give for a scrollable region. While it fits it takes neither, so a page of tables
 *   has no empty tab stops and no extra landmarks. The scroller measures its overflow again on
 *   resize, on a change of rows and after the fonts load. Name it with `aria-labelledby` pointing
 *   at the caption, or with `aria-label`. The scroller receives the variants, because the edge and
 *   the corners belong to the element that clips them.
 */

import { type ComponentProps, type ReactElement, type Ref, useCallback, useRef } from "react";

import { useIsOverflowing } from "@stealthscale/hooks";

import { withProvider } from "#table/context.ts";

/**
 * Renders the `div` with the recipe's variants.
 */
const Box = withProvider("div", "scroller");

/**
 * Describes the props of the scroller: the recipe's variants and the props of a `div`.
 */
export type ScrollerProps = ComponentProps<typeof Box>;

/**
 * Assigns a node to a callback ref or an object ref.
 */
function filled(ref: Ref<HTMLDivElement> | undefined, node: HTMLDivElement | null): void {
  if (typeof ref === "function") ref(node);
  else if (ref !== null && ref !== undefined) ref.current = node;
}

/**
 * Renders the scroller, focusable with the region role while the table overflows it.
 *
 * @param props - The recipe's variants and the props of a `div`.
 * @returns The `div` element.
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

  return <Box {...rest} ref={taken} {...(overflows ? { role: "region", tabIndex: 0 } : {})} />;
}
