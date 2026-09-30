/**
 * Renders the strip above the text that shows the message the composer replies to or edits.
 *
 * @remarks
 *   The caller renders the words and a control that dismisses the strip. Escape in the textarea
 *   dismisses it as well, through the root's `onCancelContext`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#composer/context.ts";

/**
 * Renders the strip's `div`.
 */
export const Context = withContext("div", "context");

/**
 * Describes the props of `Context`.
 */
export type ContextProps = ComponentProps<typeof Context>;
