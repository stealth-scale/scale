/**
 * Exports `Markdown`, which renders a Markdown document with the library's components, and the
 * types of its replacements, glyphs and words.
 */

export { Markdown, type MarkdownProps } from "#markdown/markdown.tsx";
export {
  type MarkdownCodeProps,
  type MarkdownComponents,
  type MarkdownGlyphs,
  type MarkdownImageProps,
  type MarkdownLinkProps,
  type MarkdownSize,
} from "#markdown/scope.ts";
export { type MarkdownWords } from "#markdown/words.ts";
