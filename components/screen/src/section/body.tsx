/**
 * Renders the section's content.
 *
 * @remarks
 *   The element is `div`. With `bleed`, a body in a card drops its padding and runs to the card's
 *   edges, with a hairline above it, for a table or a list whose rows pad themselves. The card
 *   clips its content, so the body keeps the card's corners. A plain section pads no band, so
 *   `bleed` changes nothing there.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#section/context.ts";

/**
 * Renders the `div` with the recipe's body class.
 */
const Content = withContext("div", "body");

/**
 * Describes the props of the body: whether it runs to the card's edges, and the props of a `div`.
 */
export interface BodyProps extends ComponentProps<typeof Content> {
  /**
   * Whether the body drops its padding and runs to the card's edges.
   */
  readonly bleed?: boolean | undefined;
}

/**
 * Renders the body, with `data-bleed` while it runs to the card's edges.
 *
 * @param props - Whether the body bleeds, and the props of a `div`.
 * @returns The `div` element.
 */
export function Body({ bleed = false, ...rest }: BodyProps): ReactElement {
  return <Content {...rest} data-bleed={bleed ? "" : undefined} />;
}
