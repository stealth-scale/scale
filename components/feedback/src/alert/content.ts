/**
 * Renders the text region of an alert, wrapping its title and its description.
 *
 * @remarks
 *   The element is a `div` carrying no ARIA role. It stacks its children or runs them along one
 *   line according to the root's `layout` variant, and absorbs the space the indicator and the
 *   aside leave. The minimum inline size of zero is deliberate: a flex item defaults to an
 *   automatic minimum, so without it a long unbreakable string would push the aside off the end of
 *   the alert instead of wrapping.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Renders the flex container that lays out an alert's title and description.
 */
export const Content = withContext("div", "content");

/**
 * The props of a styled `div`.
 */
export type ContentProps = ComponentProps<typeof Content>;
