/**
 * Renders the transcript: the scroll area's viewport as the conversation's log, and the content
 * that stacks the turns.
 *
 * @remarks
 *   The viewport has the `log` role, named by the root's `label`. A log is a polite live region, so
 *   a screen reader reads each turn once as it is added, and `aria-relevant="additions"` leaves out
 *   the text that changes inside a turn. While the transcript overflows, the viewport is in the tab
 *   order and the arrow keys, Page Up, Page Down, Home and End scroll it. Write the turns oldest
 *   first: the order they are written is the order a screen reader reads them.
 */

import { type JSX, type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#conversation/context.ts";
import { useConversationState } from "#conversation/state.ts";

/**
 * Renders the scroll area's viewport with the conversation's viewport class.
 */
const Viewport: (props: ScrollArea.ViewportProps) => JSX.Element = withContext(
  ScrollArea.Viewport,
  "viewport",
);

/**
 * Renders the scroll area's content with the conversation's content class.
 */
const Stacked: (props: ScrollArea.ContentProps) => JSX.Element = withContext(
  ScrollArea.Content,
  "content",
);

/**
 * Describes the props of the transcript: the props of the scroll area's viewport, without `ref`,
 * which the engine takes.
 */
export type ContentProps = Omit<ScrollArea.ViewportProps, "ref">;

/**
 * Renders the log around the content, with the engine's refs on both.
 *
 * @param props - The props of the scroll area's viewport, the turns among its children.
 * @returns The viewport element.
 */
export function Content({ children, ...props }: ContentProps): ReactElement {
  const { contentRef, label, scrollRef } = useConversationState();

  return (
    <Viewport
      aria-label={label}
      aria-live="polite"
      aria-relevant="additions"
      role="log"
      {...props}
      ref={scrollRef}
    >
      <Stacked ref={contentRef}>{children}</Stacked>
    </Viewport>
  );
}
