/**
 * Finds the mention a reader is typing at the caret, and writes a chosen name in its place.
 *
 * @remarks
 *   A trigger character opens a query only at the start of the text or after whitespace, so
 *   `ada@example.com` is an address and not a mention of `example.com`. Whitespace ends a query: a
 *   term never spans a space or a line break. So at most one trigger opens a query at the caret: a
 *   second trigger after the first needs whitespace before it, which ends the first query. The text
 *   keeps the name the reader sees, such as `@Ada Okafor`, and a space after it.
 */

/**
 * Describes the mention a reader is typing.
 */
export interface Query {
  /**
   * Index of the trigger character in the text.
   */
  readonly from: number;

  /**
   * The text typed after the trigger, up to the caret, without whitespace.
   */
  readonly term: string;

  /**
   * The trigger character, such as `@`.
   */
  readonly trigger: string;
}

/**
 * Describes a text with a mention written into it.
 */
export interface Mentioned {
  /**
   * The caret's index after the mention and its space.
   */
  readonly caret: number;

  /**
   * The text with the mention in place of the query.
   */
  readonly text: string;
}

/**
 * Returns the query of one trigger at the caret, or nothing where the trigger opens none there.
 */
function queryOf(text: string, caret: number, trigger: string): Query | undefined {
  const from = text.lastIndexOf(trigger, caret - 1);

  if (from === -1 || /\S/u.test(text.charAt(from - 1))) return undefined;

  const term = text.slice(from + trigger.length, caret);

  return /\s/u.test(term) ? undefined : { from, term, trigger };
}

/**
 * Returns the mention the caret is in.
 *
 * @param text - The text so far.
 * @param caret - The caret's index in the text.
 * @param triggers - The characters that open a mention, such as `@` and `#`.
 * @returns The query at the caret, or undefined outside every mention.
 */
export function queryAt(
  text: string,
  caret: number,
  triggers: readonly string[],
): Query | undefined {
  return triggers
    .map((trigger) => queryOf(text, caret, trigger))
    .find((query) => query !== undefined);
}

/**
 * Returns the text with the query replaced by the trigger, the chosen name and a space, and the
 * caret after them.
 *
 * @param text - The text so far.
 * @param query - The mention being typed.
 * @param caret - The caret's index in the text.
 * @param name - The chosen name.
 * @returns The new text and the caret's index in it.
 */
export function mentioned(text: string, query: Query, caret: number, name: string): Mentioned {
  const written = `${query.trigger}${name} `;

  return {
    caret: query.from + written.length,
    text: text.slice(0, query.from) + written + text.slice(caret),
  };
}
