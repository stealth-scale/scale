/**
 * Renders a swipe row's content, which a touch or pen drag and a horizontal trackpad swipe move
 * aside to reveal the actions.
 *
 * @remarks
 *   A mouse drag moves nothing, because a mouse selects text, and a mouse user reaches the actions
 *   with Tab. A drag follows the finger from the width already revealed, clamped between none and
 *   the actions' width, and a release settles by `settleSwipe`. A touch or pen pointer is captured
 *   by the browser itself, so the row keeps the moves of a finger that leaves it. A trackpad swipe
 *   arrives as wheel deltas with no end event, so the row settles 150ms after the last horizontal
 *   delta, and a mostly vertical delta scrolls the page. In a row laid out right to left a
 *   revealing swipe moves right.
 */

import { type ComponentProps, type ReactElement, useEffect, useRef } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#swipe-actions/context.ts";
import { type SwipeState, useSwipe } from "#swipe-actions/state.ts";

/**
 * Renders the content `div` with the recipe's content class.
 */
const Moving = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`.
 */
export type ContentProps = ComponentProps<typeof Moving>;

/**
 * Milliseconds without a horizontal wheel delta after which a trackpad swipe settles.
 */
const QUIET = 150;

/**
 * Describes a drag in progress: the width revealed when it started, the width it reveals now, and
 * where the pointer went down.
 */
interface Gesture {
  /**
   * Width revealed when the pointer went down, in pixels.
   */
  readonly from: number;

  /**
   * Width the drag reveals now, in pixels.
   */
  revealed: number;

  /**
   * The pointer's `clientX` when it went down.
   */
  readonly start: number;
}

/**
 * Describes a trackpad swipe in progress: the width it reveals and the timer that settles it.
 */
interface Wheeling {
  /**
   * Width the swipe reveals now, in pixels.
   */
  revealed: number;

  /**
   * Timer that settles the swipe, or `undefined` between swipes.
   */
  timer: ReturnType<typeof setTimeout> | undefined;
}

/**
 * Describes the handlers the content puts on its element.
 */
type Handlers = Pick<
  ComponentProps<"div">,
  "onPointerCancel" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onWheel"
>;

/**
 * Keeps the drag and the trackpad swipe in progress, and returns the handlers that move the row.
 *
 * @param swipe - The row's state.
 * @returns The content's pointer and wheel handlers.
 */
function useGestures(swipe: SwipeState): Handlers {
  const gesture = useRef<Gesture | null>(null);
  const wheel = useRef<Wheeling>({ revealed: 0, timer: undefined });

  useEffect(() => {
    const held = wheel.current;

    return (): void => {
      clearTimeout(held.timer);
    };
  }, []);

  return {
    onPointerCancel: () => {
      if (gesture.current === null) return;

      gesture.current = null;
      swipe.settle(false);
    },
    onPointerDown: (event) => {
      if (event.pointerType === "mouse") return;

      gesture.current = { from: swipe.revealed, revealed: swipe.revealed, start: event.clientX };
    },
    onPointerMove: (event) => {
      const held = gesture.current;

      if (held === null) return;

      const toward = (held.start - event.clientX) * (swipe.rightToLeft() ? -1 : 1);

      held.revealed = swipe.drag(held.from + toward);
    },
    onPointerUp: () => {
      const held = gesture.current;

      if (held === null) return;

      gesture.current = null;
      swipe.release(held.revealed);
    },
    onWheel: (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

      const held = wheel.current;
      const toward = event.deltaX * (swipe.rightToLeft() ? -1 : 1);

      if (held.timer === undefined) held.revealed = swipe.revealed;

      held.revealed = swipe.drag(held.revealed + toward);
      clearTimeout(held.timer);
      held.timer = setTimeout(() => {
        held.timer = undefined;
        swipe.release(held.revealed);
      }, QUIET);
    },
  };
}

/**
 * Renders the content with the drag and wheel handlers merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const handlers = useGestures(useSwipe());

  return <Moving {...mergeProps(handlers, props)} />;
}
