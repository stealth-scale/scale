/**
 * Renders a text with every match of a search query in a mark.
 *
 * @remarks
 *   The text renders as it is, and each run that matches the query renders in `Mark` with the props
 *   the caller gives, so a theme styles a match as it styles any highlight. A match takes the
 *   `none` inset unless a caller states one, because a match inside a word is split by padding.
 *   The matching is `useHighlight`'s: every occurrence, letter case ignored unless `ignoreCase` is
 *   false, each term trimmed, the longer term first. The component renders no element of its own,
 *   so it takes the place of a string inside the caller's text. A screen reader announces a `mark`
 *   only where its user asks for highlights.
 */

import { Fragment, type ReactElement, type ReactNode } from "react";

import { useHighlight } from "@stealthscale/hooks";

import { Mark, type MarkProps } from "#mark/mark.ts";

/**
 * Describes the props of the highlight: the text, the query, whether case is ignored, and the props
 * of every `Mark`.
 */
export interface HighlightProps extends Omit<MarkProps, "children"> {
  /**
   * Text to search, as a string.
   */
  readonly children: string;

  /**
   * Whether a match ignores letter case, true unless stated.
   */
  readonly ignoreCase?: boolean | undefined;

  /**
   * Term or terms to mark.
   */
  readonly query: readonly string[] | string;
}

/**
 * Renders the text with each match in a mark.
 *
 * @param props - The text, the query, whether case is ignored, and the props of every `Mark`.
 * @returns The runs of the text.
 */
export function Highlight({
  children,
  ignoreCase,
  inset = "none",
  query,
  ...props
}: HighlightProps): ReactNode {
  const runs: ReactElement[] = [];
  let start = 0;

  for (const { match, text } of useHighlight({ ignoreCase, query, text: children })) {
    runs.push(
      match ? (
        <Mark inset={inset} key={start} {...props}>
          {text}
        </Mark>
      ) : (
        <Fragment key={start}>{text}</Fragment>
      ),
    );
    start += text.length;
  }

  return runs;
}
