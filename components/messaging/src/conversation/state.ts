/**
 * Provides what the root of a conversation knows to its parts: whether the view is at the end, the
 * scroll engine's elements, the log's name, and the two scrolls.
 */

import { type StickToBottomInstance } from "use-stick-to-bottom";

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the state a conversation's root provides.
 */
export interface ConversationState {
  /**
   * Whether the view is at the end of the transcript or within 70px of it.
   */
  readonly atEnd: boolean;

  /**
   * Ref the transcript's content element takes, whose growth the engine follows.
   */
  readonly contentRef: StickToBottomInstance["contentRef"];

  /**
   * Accessible name of the log.
   */
  readonly label: string;

  /**
   * Ref the transcript's viewport takes, the element that scrolls.
   */
  readonly scrollRef: StickToBottomInstance["scrollRef"];

  /**
   * Scrolls to the end of the transcript and follows it again.
   */
  readonly scrollToEnd: () => void;

  /**
   * Scrolls the element with the `id` given to the top of the view and stops following the end.
   */
  readonly scrollToMessage: (id: string) => void;
}

/**
 * Provides the state to the parts, and reads it where a part renders.
 */
export const [StateProvider, useConversationState] =
  createRequiredContext<ConversationState>("Conversation");
