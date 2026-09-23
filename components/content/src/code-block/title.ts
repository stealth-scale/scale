/**
 * Renders the label of the code, such as a file name.
 *
 * @remarks
 *   The element is a `div` with no heading role, because a code block is not a section of the page.
 *   A label wider than the header truncates with an ellipsis on one line.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code-block/context.ts";

/**
 * Renders the title slot.
 */
export const Title = withContext("div", "title");

/**
 * Describes the props of `Title`: the props of the styled `div`.
 */
export type TitleProps = ComponentProps<typeof Title>;
