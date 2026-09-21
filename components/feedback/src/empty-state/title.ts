/**
 * Renders the headline stating what is missing.
 *
 * @remarks
 *   The default element is an `h2`, because an empty state takes the place of a section's content
 *   and its title takes the place of that section's heading. A page whose outline nests it deeper
 *   passes its own level through `as`: a heading that skips a level reads as a hole in the outline
 *   a screen reader user navigates by.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Renders a semibold heading at the type step the root's size resolves to.
 */
export const Title = withContext("h2", "title");

/**
 * The props of a styled `h2`.
 */
export type TitleProps = ComponentProps<typeof Title>;
