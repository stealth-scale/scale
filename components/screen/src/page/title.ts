/**
 * Renders the heading that names the page.
 *
 * @remarks
 *   The element is `h1`. A page has one, and a screen reader that moves by heading moves to it
 *   first. A screen with two pages renders the second title with `as="h2"`. The title's column
 *   shrinks, so a long title wraps beside the actions.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `h1` with the recipe's title class.
 */
export const Title = withContext("h1", "title");

/**
 * Describes the props of the title: the props of a heading.
 */
export type TitleProps = ComponentProps<typeof Title>;
