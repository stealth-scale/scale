/**
 * Runs a conversation's scroll engine: whether the view is at the end, and the two scrolls.
 *
 * @remarks
 *   The hook runs use-stick-to-bottom. While the view is at the end of the transcript, a message
 *   that arrives or grows scrolls the view down with it. A wheel, a key or a drag that scrolls up
 *   stops the follow, and scrolling back to within 70px of the end starts it again. The view opens
 *   at the end, and under reduced motion every scroll is instant. An application calls the hook
 *   and passes the result to `Conversation.Root` as `conversation`, so a control outside the
 *   transcript, such as the composer's send, can scroll it. A root without `conversation` runs its
 *   own.
 */

import {
  type StickToBottomInstance,
  type StickToBottomOptions,
  useStickToBottom,
} from "use-stick-to-bottom";

import { useMediaQuery } from "@stealthscale/hooks";

/**
 * Media query a reader matches by asking the system for reduced motion.
 */
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Engine options that open at the end at once and follow new content with a spring.
 */
const FOLLOWING: StickToBottomOptions = { initial: "instant" };

/**
 * Engine options that open at the end and follow new content, both at once.
 */
const STILL: StickToBottomOptions = { initial: "instant", resize: "instant" };

/**
 * Describes a conversation's scroll engine: the view's place, the two scrolls, and the refs
 * `Conversation.Root` gives its viewport and content.
 */
export interface ConversationApi {
  /**
   * Whether the view is at the end of the transcript or within 70px of it.
   */
  readonly atEnd: boolean;

  /**
   * Ref the transcript's content element takes, whose growth the engine follows.
   */
  readonly contentRef: StickToBottomInstance["contentRef"];

  /**
   * Ref the transcript's viewport takes, the element that scrolls.
   */
  readonly scrollRef: StickToBottomInstance["scrollRef"];

  /**
   * Scrolls to the end of the transcript and follows it again.
   */
  readonly scrollToEnd: () => void;

  /**
   * Scrolls the element with the `id` given to the top of the view and stops following the end,
   * for a jump to the first unread message or to a search result.
   */
  readonly scrollToMessage: (id: string) => void;
}

/**
 * Runs the scroll engine of one conversation.
 *
 * @returns Whether the view is at the end, the two scrolls, and the refs the root passes on.
 */
export function useConversation(): ConversationApi {
  const reduced = useMediaQuery([REDUCED_MOTION]).includes(true);
  const { contentRef, isAtBottom, scrollRef, scrollToBottom, stopScroll } = useStickToBottom(
    reduced ? STILL : FOLLOWING,
  );

  /**
   * Scrolls to the end of the transcript, at once under reduced motion.
   */
  function scrollToEnd(): void {
    void scrollToBottom(reduced ? "instant" : "smooth");
  }

  /**
   * Scrolls the viewport until the element with the `id` given is at its top.
   *
   * @param id - The element's `id`, such as a turn's.
   */
  function scrollToMessage(id: string): void {
    const viewport = scrollRef.current;
    const target = viewport?.querySelector(`[id="${CSS.escape(id)}"]`);

    if (!viewport || !target) return;

    stopScroll();
    viewport.scrollTo({
      behavior: reduced ? "instant" : "smooth",
      top:
        viewport.scrollTop +
        target.getBoundingClientRect().top -
        viewport.getBoundingClientRect().top,
    });
  }

  return { atEnd: isAtBottom, contentRef, scrollRef, scrollToEnd, scrollToMessage };
}
