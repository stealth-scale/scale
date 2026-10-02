/**
 * Renders the highlighted source text, or terminal output in its colours.
 *
 * @remarks
 *   The element is a `code`. The text and the language come from the root. The highlighter runs
 *   synchronously during render, so the first paint is highlighted. Each classified token renders
 *   as a `span` with the kind in `data-token`, which the recipe colours. An unclassified token
 *   renders as a text node, and an unknown language renders as plain text. The `ansi` language
 *   renders each styled run of terminal output as a `span` with its colour in `data-ansi` and its
 *   effects in `data-bold`, `data-dim` and `data-underline`, and a plain run as a text node.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { tokenize } from "@tanstack/highlight";

import { ANSI, isPlain, parseAnsi } from "#code-block/ansi.ts";
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
 * Returns an empty attribute value for a set flag and undefined for a cleared one, so React writes
 * the attribute only while the flag is set.
 */
function flagged(on: boolean): "" | undefined {
  return on ? "" : undefined;
}

/**
 * Renders one span per styled run of terminal output and a text node per plain run.
 */
function runsOf(code: string): ReactNode[] {
  return parseAnsi(code).map((span, index) =>
    isPlain(span) ? (
      span.text
    ) : (
      <span
        data-ansi={span.color}
        data-bold={flagged(span.bold)}
        data-dim={flagged(span.dim)}
        data-underline={flagged(span.underline)}
        // eslint-disable-next-line react/no-array-index-key -- a run has no identity beyond its position, and the passage re-renders whole
        key={index}
      >
        {span.text}
      </span>
    ),
  );
}

/**
 * Renders one span per classified token and a text node per unclassified token.
 */
function tokensOf(code: string, language: string | undefined): ReactNode[] {
  const { tokens } = tokenize(code, language === undefined ? {} : { lang: language });

  return tokens.map((token, index) =>
    token.className === undefined ? (
      token.value
    ) : (
      // eslint-disable-next-line react/no-array-index-key -- a token has no identity beyond its position, and the passage re-renders whole
      <span data-token={token.className} key={index}>
        {token.value}
      </span>
    ),
  );
}

/**
 * Renders the root's code: runs of terminal output for the `ansi` language, and highlighted tokens
 * for any other.
 */
export function Code(props: CodeProps): ReactElement {
  const { code, language } = useCode();

  return (
    <Passage {...props}>{language === ANSI ? runsOf(code) : tokensOf(code, language)}</Passage>
  );
}
