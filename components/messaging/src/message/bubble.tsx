/**
 * Renders one message of a turn in its bubble.
 *
 * @remarks
 *   The bubble is painted in the turn's look and palette. `failed` paints it in the error palette,
 *   for a message that did not send. A color reports nothing to a screen reader, so a failed
 *   message also needs a status that states the failure and a control that sends it again.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#message/context.ts";

/**
 * Renders the bubble's `div`.
 */
const Surface = withContext("div", "bubble");

/**
 * Describes the props of the bubble: whether the message failed, and the props of a `div`.
 */
export interface BubbleProps extends ComponentProps<typeof Surface> {
  /**
   * Whether the message did not send.
   */
  readonly failed?: boolean | undefined;
}

/**
 * Renders the bubble, with `data-failed` while `failed`.
 *
 * @param props - Whether the message failed, and the props of a `div`.
 * @returns The `div` element.
 */
export function Bubble({ failed = false, ...props }: BubbleProps): ReactElement {
  return <Surface data-failed={failed ? "" : undefined} {...props} />;
}
