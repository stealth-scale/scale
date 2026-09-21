/**
 * Renders a card's heading.
 *
 * @remarks
 *   The element is an `h3`, which places a card below a section's own heading in the outline a
 *   screen reader walks. A page whose cards sit at another depth passes the level through `as`,
 *   since the level belongs to the page's structure rather than to the card. The size axis sets the
 *   text style, so the heading steps with the padding around it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#card/context.ts";

/**
 * Renders the title slot at whatever heading level the page's outline needs.
 */
export const Title = withContext("h3", "title");

/**
 * Accepts every prop the styled h3 takes.
 */
export type TitleProps = ComponentProps<typeof Title>;
