/**
 * Renders the row that shows another person typing: three dots and the caller's words.
 *
 * @remarks
 *   Render it inside `Conversation.Content`, after the last turn, while the other person types. The
 *   log reads the words once, when the row is added. The dots are hidden from a screen reader.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#conversation/context.ts";

/**
 * Renders the row's `div`.
 */
const Row = withContext("div", "typing");

/**
 * Renders the `span` around the three dots.
 */
const Dots = withContext("span", "dots");

/**
 * Describes the props of the row: the props of a `div`, the words among its children.
 */
export type TypingProps = ComponentProps<typeof Row>;

/**
 * Renders the dots before the caller's words.
 *
 * @param props - The props of a `div`, the words among its children.
 * @returns The `div` element.
 */
export function Typing({ children, ...props }: TypingProps): ReactElement {
  return (
    <Row {...props}>
      <Dots aria-hidden="true">
        <span />
        <span />
        <span />
      </Dots>
      {children}
    </Row>
  );
}
