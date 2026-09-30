/**
 * Renders the content the summary shows and hides.
 *
 * @remarks
 *   The element is a `div` after the summary. The browser hides it while the details is closed,
 *   and the recipe pads it on the inset scale.
 */

import { type ComponentProps } from "react";

import { withContext } from "#details/context.ts";

/**
 * Renders the `div` with the details' content class.
 */
export const Content = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`.
 */
export type ContentProps = ComponentProps<typeof Content>;
