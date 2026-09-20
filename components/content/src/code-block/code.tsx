/**
 * Draws the passage of code, each token in its kind.
 *
 * @remarks
 *   The element is `code`. The passage is read off the root and cut into tokens by the
 *   highlighter, which runs where it is called and knows the language from its name, so the code
 *   is coloured on its first paint. Each token that has a kind is drawn in a `span` carrying it
 *   as `data-token`, which the recipe reads for its ink, and a token with none is drawn as text.
 *   A language the highlighter does not know is drawn as plain text.
 */

import { type ComponentProps, type ReactElement } from "react";

import { tokenize } from "@tanstack/highlight";

import { withContext } from "#code-block/context.ts";
import { useCode } from "#code-block/state.ts";

/**
 * Draws the passage at the size the root states.
 */
const Passage = withContext("code", "code");

/**
 * Describes what the passage takes.
 */
export type CodeProps = ComponentProps<typeof Passage>;

/**
 * Sets the code the root holds, token by token.
 *
 * @param props - Everything a styled code element takes.
 * @returns The passage, one span per token that has a kind.
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
