/**
 * Renders how far a message has got: sending, sent, delivered, read or failed.
 *
 * @remarks
 *   The caller passes the glyph and the words. A screen reader does not read a glyph's shape or
 *   color, so the words are the announcement. Hide the glyph with `aria-hidden`, and hide the words
 *   visually where the glyph is enough to see. The recipe reads `data-status` for the ink: the
 *   primary palette's ink for `read` and the error ink for `failed`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#message/context.ts";

/**
 * Renders the status `span`.
 */
const Marked = withContext("span", "status");

/**
 * Lists how far a message can get.
 */
export type MessageStatus = "delivered" | "failed" | "read" | "sending" | "sent";

/**
 * Describes the props of the status: how far the message has got, and the props of a `span`.
 */
export interface StatusProps extends ComponentProps<typeof Marked> {
  /**
   * How far the message has got.
   */
  readonly status: MessageStatus;
}

/**
 * Renders the status with its state written as `data-status`.
 *
 * @param props - How far the message has got, and the props of a `span`.
 * @returns The `span` element.
 */
export function Status({ status, ...props }: StatusProps): ReactElement {
  return <Marked data-status={status} {...props} />;
}
