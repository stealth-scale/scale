/**
 * Splits a text into the runs that match a search query and the runs between them.
 */

import { type HighlightChunk, highlightWord } from "@zag-js/highlight-word";

export { type HighlightChunk } from "@zag-js/highlight-word";

/**
 * Describes the text a highlight splits and the query it marks.
 */
export interface UseHighlightOptions {
  /**
   * Whether a match ignores letter case, true unless stated.
   */
  readonly ignoreCase?: boolean | undefined;

  /**
   * Term or terms to mark.
   */
  readonly query: readonly string[] | string;

  /**
   * Text to split.
   */
  readonly text: string;
}

/**
 * Returns the runs of a text in order, each marked as a match of the query or not.
 *
 * @remarks
 *   Every occurrence of every term matches, by substring, and letter case is ignored unless
 *   `ignoreCase` is false, as the filter scope matches rows. Each term is trimmed and an empty term
 *   is dropped, so a query of spaces marks nothing. Longer terms are tried first, so `offer` is
 *   marked whole where `off` also matches. `@zag-js/highlight-word` escapes the characters a
 *   regular expression reads.
 * @param options - The text, the query and whether case is ignored.
 */
export function useHighlight({
  ignoreCase = true,
  query,
  text,
}: UseHighlightOptions): HighlightChunk[] {
  const terms = (typeof query === "string" ? [query] : query)
    .map((term) => term.trim())
    .filter((term) => term !== "")
    .toSorted((first, second) => second.length - first.length);

  return highlightWord({ ignoreCase, matchAll: true, query: terms, text });
}
