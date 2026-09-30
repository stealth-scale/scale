/**
 * Renders the conversation's root: the scroll area around the transcript, and the scroll engine
 * that follows the latest message.
 *
 * @remarks
 *   The root runs the engine `conversation` passes, which an application creates with
 *   `useConversation` to scroll the transcript from outside it, or its own. The root takes the
 *   scroll area's props, `maxHeight` and `inset` among them, and renders the vertical bar after
 *   its children. A transcript scrolls only in a bounded height: `maxHeight`, or a parent of a
 *   definite height.
 */

import { type JSX, type ReactElement } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withProvider } from "#conversation/context.ts";
import { StateProvider } from "#conversation/state.ts";
import { type ConversationApi, useConversation } from "#conversation/use-conversation.ts";

/**
 * Renders the scroll area's root with the conversation's root class.
 */
const Framed: (props: ScrollArea.RootProps) => JSX.Element = withProvider(ScrollArea.Root, "root");

/**
 * Describes the props of the root: the engine, the log's name and the props of the scroll area's
 * root.
 */
export interface RootProps extends ScrollArea.RootProps {
  /**
   * Scroll engine `useConversation` returns. The root runs its own unless stated.
   */
  readonly conversation?: ConversationApi | undefined;

  /**
   * Accessible name of the transcript's log, "Messages" unless stated.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the root and provides the conversation's state to its parts.
 *
 * @param props - The engine, the log's name and the props of the scroll area's root.
 * @returns The scroll area's root inside the state's provider.
 */
export function Root({
  children,
  conversation,
  label = "Messages",
  ...props
}: RootProps): ReactElement {
  const own = useConversation();
  const { atEnd, contentRef, scrollRef, scrollToEnd, scrollToMessage } = conversation ?? own;

  return (
    <StateProvider value={{ atEnd, contentRef, label, scrollRef, scrollToEnd, scrollToMessage }}>
      <Framed {...props}>
        {children}
        <ScrollArea.Scrollbar />
      </Framed>
    </StateProvider>
  );
}
