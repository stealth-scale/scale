/**
 * Parses a Markdown source into the document tree the renderer walks.
 *
 * @remarks
 *   The parser never recognises raw HTML, which renders as literal text, and screens every link and
 *   image destination through its URL policy, which removes executable protocols. Headings take
 *   duplicate-safe ids. GitHub's callouts, such as `> [!WARNING]`, parse into callout nodes. The
 *   streaming profile closes a fence a text stream has not closed yet, so the code shows as code
 *   while it arrives. A parsed document passes through unchanged, for a caller that parses ahead.
 */

import { type MarkdownDocument, type MarkdownInput, type UrlTransform } from "@tanstack/markdown";
import { calloutsExtension } from "@tanstack/markdown/extensions/callouts";
import { streamingMarkdownExtension } from "@tanstack/markdown/extensions/streaming";
import { parseMarkdown } from "@tanstack/markdown/parser";

import { omitUndefined } from "@stealthscale/hooks";

/**
 * Describes how a source is parsed.
 */
export interface Parsing {
  /**
   * Whether the source is a text stream that may end inside a block.
   */
  readonly streaming: boolean;

  /**
   * Caller's URL policy, which returns a destination or `null` to keep only a link's words.
   */
  readonly urlTransform?: undefined | UrlTransform;
}

/**
 * Returns the document of a source: the parsed tree of a string, or the document itself.
 *
 * @param source - Markdown text, or a document parsed ahead.
 * @param parsing - Whether the source streams, and the caller's URL policy.
 */
export function documentOf(source: MarkdownInput, parsing: Parsing): MarkdownDocument {
  if (typeof source !== "string") return source;

  const extensions = [calloutsExtension()];

  if (parsing.streaming) extensions.push(streamingMarkdownExtension());

  return parseMarkdown(source, {
    extensions,
    headingIds: true,
    ...omitUndefined({ urlTransform: parsing.urlTransform }),
  });
}
