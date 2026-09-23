/**
 * Renders the heading that states what is missing.
 *
 * @remarks
 *   The default element is `h2`, because the empty state replaces a section's content and its title
 *   replaces the section's heading. A page with a deeper outline passes the level through `as`, so
 *   the outline has no skipped level.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Renders a semibold heading at the text style of the root's size.
 */
export const Title = withContext("h2", "title");

/**
 * Describes the props of EmptyState.Title: the props of a heading element.
 */
export type TitleProps = ComponentProps<typeof Title>;
