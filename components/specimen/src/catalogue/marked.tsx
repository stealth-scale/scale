/**
 * Draws the code spans a sentence marks with backticks.
 */

import { type ReactNode } from "react";

import { Code } from "@stealthscale/component-typography";

/**
 * Matches one code span, capturing the words between its backticks.
 */
const SPAN = /`([^`]*)`/u;

/**
 * Draws the pieces a split leaves: plain words, a code span, and the rest after it.
 *
 * @remarks
 *   Nested fragments rather than an array, so no piece needs a key. A key would have to be built
 *   from the piece's position, and the same word can be marked twice in one sentence.
 */
function spans(pieces: readonly string[]): ReactNode {
  const [plain = "", code, ...rest] = pieces;

  if (code === undefined) return plain;

  return (
    <>
      {plain}
      <Code>{code}</Code>
      {spans(rest)}
    </>
  );
}

/**
 * Draws every span between a pair of backticks as code and the rest as the words they are.
 *
 * @remarks
 *   A specimen's sentences name props and values in backticks the way a docblock does, and a page
 *   that printed the backticks would read as markup nobody rendered. A backtick with no partner
 *   marks nothing and stays in the words as written.
 * @param sentence - The words, with code spans in backticks.
 * @returns The words, with each code span drawn as code.
 */
export function marked(sentence: string): ReactNode {
  return spans(sentence.split(SPAN));
}
