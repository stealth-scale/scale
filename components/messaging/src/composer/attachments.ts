/**
 * Renders the row above the text that contains the files waiting to be sent.
 *
 * @remarks
 *   The caller renders an `Attachment.Group` inside, small tiles that wrap, with a control on each
 *   that removes the file.
 */

import { type ComponentProps } from "react";

import { withContext } from "#composer/context.ts";

/**
 * Renders the row's `div`.
 */
export const Attachments = withContext("div", "attachments");

/**
 * Describes the props of `Attachments`.
 */
export type AttachmentsProps = ComponentProps<typeof Attachments>;
