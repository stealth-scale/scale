/**
 * Renders a card's heading.
 *
 * @remarks
 *   The element is an `h3`. Pass another level through `as` where the page's outline needs it. The
 *   size axis sets the text style: `label.lg` at `sm`, and the heading one size smaller than the
 *   card at `md` to `xl`. In an interactive card the title contains the link the card follows.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the title slot in the header grid's second column.
 */
export const Title = withContext("h3", "title");

/**
 * Describes the props of `Title`: the props of an `h3`.
 */
export type TitleProps = ComponentProps<typeof Title>;
