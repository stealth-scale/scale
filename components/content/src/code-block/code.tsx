/**
 * Renders the highlighted source text.
 *
 * @remarks
 *   The element is a `code`. The text and the language come from the root. The highlighter runs
 *   synchronously during render, so the first paint is highlighted. Each classified token renders
 *   as a `span` with the kind in `data-token`, which the recipe colours. An unclassified token
 *   renders as a text node, and an unknown language renders as plain text.
 */

import { type ComponentProps, type ReactElement } from "react";

import { tokenize } from "@tanstack/highlight";

import { withContext } from "#code-block/context.ts";
import { useCode } from "#code-block/state.ts";

/**
 * Renders the code slot.
 */
const Passage = withContext("code", "code");

/**
 * Describes the props of `Code`: the props of the styled `code` element.
 */
export type CodeProps = ComponentProps<typeof Passage>;

/**
 * Tokenizes the root's code and renders one span per classified token.
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
          // eslint-disable-next-line react/no-array-index-key -- a token has no identity beyond its position, and the passage re-renders whole
          <span data-token={token.className} key={index}>
            {token.value}
          </span>
        ),
      )}
    </Passage>
  );
}
