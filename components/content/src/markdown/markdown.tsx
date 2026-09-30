/**
 * Renders a Markdown document with the library's own components, never a string of HTML.
 *
 * @remarks
 *   The source parses into a document tree, and each node renders as the library's component for
 *   it: `Heading`, `Text`, `List`, `Blockquote`, `Code` and `Link`, the collections `Table`, the
 *   content `CodeBlock`, the layout `Divider` and the feedback `Alert`. Raw HTML renders as literal
 *   text, and the parser removes executable link and image destinations. A document takes the
 *   theme's `prose` measure and sets one gap between its blocks. `headingLevel` sets the level a
 *   `#` heading renders at, so a document inside a card or a thread starts below the page's own
 *   headings. `components` replaces the library's component for links, images or fenced blocks,
 *   such as a router's link. A parsed document passes as `source` unchanged. While `streaming`,
 *   the root is `aria-busy`, so a screen reader in a live region around it reads the finished
 *   document once, and the recipe draws a caret after the last block.
 */

import { type ComponentProps, type ReactElement, useId } from "react";

import { type MarkdownInput, type UrlTransform } from "@tanstack/markdown";

import { renderBlocks } from "#markdown/blocks.tsx";
import { withProvider } from "#markdown/context.ts";
import { documentOf } from "#markdown/parse.ts";
import { type MarkdownComponents, type MarkdownGlyphs } from "#markdown/scope.ts";
import { type MarkdownWords, wordsOf } from "#markdown/words.ts";

/**
 * Renders the document's root `div` with the recipe's variants.
 */
const Box = withProvider("div", "root");

/**
 * Describes the props of a Markdown document: its source, its replacements, glyphs and words, and
 * the props of a `div`.
 */
export interface MarkdownProps extends MarkdownWords, Omit<ComponentProps<typeof Box>, "children"> {
  /**
   * Components that replace the library's for links, images or fenced blocks.
   */
  readonly components?: MarkdownComponents | undefined;

  /**
   * Glyphs of the callouts, the copy control of fenced blocks, and the task marks.
   */
  readonly glyphs?: MarkdownGlyphs | undefined;

  /**
   * Level a `#` heading renders at. 1 unless stated.
   */
  readonly headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | undefined;

  /**
   * Markdown text, or a document parsed ahead with `parseMarkdown`.
   */
  readonly source: MarkdownInput;

  /**
   * Whether the source is a text stream that may end inside a block. Off unless stated.
   */
  readonly streaming?: boolean | undefined;

  /**
   * Caller's URL policy, which returns a destination or `null` to keep only a link's words.
   */
  readonly urlTransform?: undefined | UrlTransform;
}

/**
 * Renders a Markdown document in the library's components.
 *
 * @param props - The source, the replacements, glyphs and words, and the props of a `div`.
 */
export function Markdown(props: MarkdownProps): ReactElement {
  const {
    calloutLabel,
    codeLabel,
    components = {},
    copiedLabel,
    copyLabel,
    footnoteBackLabel,
    footnotesLabel,
    glyphs = {},
    headingLevel = 1,
    source,
    streaming = false,
    tableLabel,
    taskDoneLabel,
    taskOpenLabel,
    urlTransform,
    ...rest
  } = props;
  const prefix = useId();
  const tree = documentOf(source, { streaming, urlTransform });
  const words = wordsOf({
    calloutLabel,
    codeLabel,
    copiedLabel,
    copyLabel,
    footnoteBackLabel,
    footnotesLabel,
    tableLabel,
    taskDoneLabel,
    taskOpenLabel,
  });
  const scope = {
    blocks: renderBlocks,
    components,
    glyphs,
    headingLevel,
    prefix,
    size: rest.size ?? "md",
    words,
  };

  return (
    <Box aria-busy={streaming ? true : undefined} {...rest}>
      {renderBlocks(tree.children, scope)}
    </Box>
  );
}
