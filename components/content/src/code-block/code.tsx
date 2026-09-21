/**
 * Renders the highlighted source text.
 *
 * @remarks
 *   The element is a `code`. The text and the language come from the root, and the highlighter
 *   runs synchronously during render, so the code is coloured on first paint rather than after a
 *   round trip. Every token the highlighter classifies becomes a `span` carrying the class as
 *   `data-token`, which the recipe selects on for colour; an unclassified token is emitted as a
 *   bare text node. A language the highlighter does not recognise yields plain text.
 */

import { type ComponentProps, type ReactElement } from "react";

import { tokenize } from "@tanstack/highlight";

import { withContext } from "#code-block/context.ts";
import { useCode } from "#code-block/state.ts";

/**
 * The styled element carrying the recipe's code slot.
 */
const Passage = withContext("code", "code");

/**
 * Props accepted by `Code`, which are the props of a styled `code` element.
 */
export type CodeProps = ComponentProps<typeof Passage>;

/**
 * Tokenises the code held by the root and renders one span per classified token.
 */
export function Code(props: CodeProps): ReactElement {
  const { code, language } = useCode();
  const { tokens } = tokenize(code, language === undefined ? {} : { lang: language });

  return (
    <Passage {...props}>
      {tokens.map((token, index) =>
        token.className === undefined ? (
          token.value
        ) : (
          // eslint-disable-next-line react/no-array-index-key -- a token has no identity beyond its place in the passage, and the passage is redrawn whole
          <span data-token={token.className} key={index}>
            {token.value}
          </span>
        ),
      )}
    </Passage>
  );
}
