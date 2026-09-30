/**
 * Writes the words a Markdown document adds to what its author wrote, each a prop with an English
 * default.
 *
 * @remarks
 *   A callout's title names its kind, because an alert that states its severity through color alone
 *   fails WCAG 1.4.1. A task item's words state its state before its text, because its mark is
 *   hidden from a screen reader. The footnotes' heading and back links are GitHub's words.
 */

import { omitUndefined } from "@stealthscale/hooks";

/**
 * Describes the words of a Markdown document, each with an English default.
 */
export interface MarkdownWords {
  /**
   * Writes a callout's title from its kind, such as `warning`.
   */
  readonly calloutLabel?: ((kind: string) => string) | undefined;

  /**
   * Writes the name of a fenced block without a title from its language, if the fence states one.
   */
  readonly codeLabel?: ((language?: string) => string) | undefined;

  /**
   * Name of a fenced block's copy control once it copied the code.
   */
  readonly copiedLabel?: string | undefined;

  /**
   * Name of a fenced block's copy control.
   */
  readonly copyLabel?: string | undefined;

  /**
   * Writes the name of a back link from a footnote's number and the reference it returns to.
   */
  readonly footnoteBackLabel?: ((number: number, reference: number) => string) | undefined;

  /**
   * Heading of the footnotes, which every footnote reference is described by.
   */
  readonly footnotesLabel?: string | undefined;

  /**
   * Name of a table without a heading before it.
   */
  readonly tableLabel?: string | undefined;

  /**
   * Words a screen reader hears before a done task.
   */
  readonly taskDoneLabel?: string | undefined;

  /**
   * Words a screen reader hears before an open task.
   */
  readonly taskOpenLabel?: string | undefined;
}

/**
 * Describes the words with every default applied.
 */
export type Words = Required<{ [Key in keyof MarkdownWords]: NonNullable<MarkdownWords[Key]> }>;

/**
 * Lists the English titles of GitHub's five callout kinds.
 */
const CALLOUTS: Readonly<Record<string, string>> = {
  caution: "Caution",
  important: "Important",
  note: "Note",
  tip: "Tip",
  warning: "Warning",
};

/**
 * Lists the English words.
 */
export const WORDS: Words = {
  calloutLabel: (kind) => CALLOUTS[kind] ?? `${kind.charAt(0).toUpperCase()}${kind.slice(1)}`,
  codeLabel: (language) => (language === undefined ? "Code" : `Code, ${language}`),
  copiedLabel: "Copied to clipboard",
  copyLabel: "Copy to clipboard",
  footnoteBackLabel: (number, reference) =>
    reference === 1
      ? `Back to reference ${String(number)}`
      : `Back to reference ${String(number)}-${String(reference)}`,
  footnotesLabel: "Footnotes",
  tableLabel: "Table",
  taskDoneLabel: "Completed task",
  taskOpenLabel: "Incomplete task",
};

/**
 * Returns the caller's words over the English defaults.
 *
 * @param words - The caller's words, any of which may be absent.
 */
export function wordsOf(words: MarkdownWords): Words {
  return { ...WORDS, ...omitUndefined(words) };
}
