/**
 * Draws the words that say what the code is: a file's name, a package's, a scene's.
 *
 * @remarks
 *   The element is `div` and carries no heading role, because a block of code inside a page is
 *   not a section of it. A long title is cut short on one line.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Draws the words at the size the root states.
 */
export const Title = withContext("div", "title");

/**
 * Describes what the title takes.
 */
export type TitleProps = ComponentProps<typeof Title>;
