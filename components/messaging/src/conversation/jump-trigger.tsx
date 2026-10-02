/**
 * Renders the control that scrolls the transcript to the latest message, while the view is away
 * from it.
 *
 * @remarks
 *   The control is the actions `Button`, square, in the surface look and raised over the turns at
 *   the middle of the transcript's bottom edge, named by `label`. The caller passes the glyph. The
 *   control renders nothing while the view is at the end. A press moves focus to the transcript
 *   before it scrolls, so focus stays in the conversation when the control goes.
 */

import { type ReactElement } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#conversation/context.ts";
import { useConversationState } from "#conversation/state.ts";

/**
 * Renders the `div` that places the control over the transcript.
 */
const Placed = withContext("div", "jumpTrigger");

/**
 * Describes the props of the control: its name and the props of the actions `Button`.
 */
export interface JumpTriggerProps extends ButtonProps {
  /**
   * Accessible name of the control, "Jump to the latest message" unless stated.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the control while the view is away from the end.
 *
 * @param props - The control's name and the props of the actions `Button`, the glyph among its
 *   children.
 * @returns The placed control, or nothing at the end of the transcript.
 */
export function JumpTrigger({
  label = "Jump to the latest message",
  onClick,
  ...props
}: JumpTriggerProps): null | ReactElement {
  const { atEnd, scrollRef, scrollToEnd } = useConversationState();

  if (atEnd) return null;

  return (
    <Placed>
      <Button
        aria-label={label}
        elevation="floating"
        palette="neutral"
        shape="square"
        size="sm"
        variant="surface"
        {...props}
        onClick={(event) => {
          onClick?.(event);
          // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the view leaves the end only by scrolling the viewport, so the viewport exists while the control renders
          (scrollRef.current as HTMLElement).focus({ preventScroll: true });
          scrollToEnd();
        }}
      />
    </Placed>
  );
}
