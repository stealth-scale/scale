/**
 * Describes what every renderer of a Markdown node reads, and derives the levels, sizes, ids and
 * names they share.
 *
 * @remarks
 *   A heading renders at its depth plus the document's `headingLevel` minus one, never deeper than
 *   `h6`, and its size follows the level it renders at, one step smaller in a `sm` document.
 *   Footnote ids take the document's prefix, so two documents on one page never share an id, while
 *   heading ids are the parser's, so a link to `#install` keeps working. A table is named by the
 *   heading of the section it is in.
 */

import { type ComponentType, type ReactNode } from "react";

import { type BlockNode, type InlineNode } from "@tanstack/markdown";

import { type Words } from "#markdown/words.ts";

/**
 * Describes the sizes a document offers: a comment's and a page's.
 */
export type MarkdownSize = "md" | "sm";

/**
 * Describes the props a replacement for a link receives.
 */
export interface MarkdownLinkProps {
  /**
   * The link's rendered content.
   */
  readonly children: ReactNode;

  /**
   * Destination the parser's URL policy passed.
   */
  readonly href: string;

  /**
   * Title the author wrote after the destination.
   */
  readonly title?: string | undefined;
}

/**
 * Describes the props a replacement for an image receives.
 */
export interface MarkdownImageProps {
  /**
   * Alternative text the author wrote, empty for a decorative image.
   */
  readonly alt: string;

  /**
   * Source the parser's URL policy passed, never empty.
   */
  readonly src: string;

  /**
   * Title the author wrote after the source.
   */
  readonly title?: string | undefined;
}

/**
 * Describes the props a replacement for a fenced block receives.
 */
export interface MarkdownCodeProps {
  /**
   * The block's text.
   */
  readonly code: string;

  /**
   * Lines the fence marks, such as `{2}`, from 1.
   */
  readonly highlightLines?: readonly number[] | undefined;

  /**
   * Language the fence names, such as `ts`.
   */
  readonly language?: string | undefined;

  /**
   * Everything the fence states after the language.
   */
  readonly meta?: string | undefined;

  /**
   * Title or file name the fence states.
   */
  readonly title?: string | undefined;
}

/**
 * Describes the components a caller renders in place of the library's for one kind of node.
 */
export interface MarkdownComponents {
  /**
   * Renders a fenced block in place of the content `CodeBlock`.
   */
  readonly code?: ComponentType<MarkdownCodeProps> | undefined;

  /**
   * Renders an image in place of the document's `img`.
   */
  readonly image?: ComponentType<MarkdownImageProps> | undefined;

  /**
   * Renders a link in place of the navigation `Link`, such as a router's.
   */
  readonly link?: ComponentType<MarkdownLinkProps> | undefined;
}

/**
 * Describes the icons of the copy control a fenced block renders in its header.
 */
export interface CopyGlyphs {
  /**
   * Icon while the code is copied.
   */
  readonly copied: ReactNode;

  /**
   * Icon at rest.
   */
  readonly idle: ReactNode;
}

/**
 * Describes the marks of a task item.
 */
export interface TaskGlyphs {
  /**
   * Mark of a done task.
   */
  readonly done: ReactNode;

  /**
   * Mark of an open task.
   */
  readonly open: ReactNode;
}

/**
 * Describes the glyphs a caller gives a document, each rendered where the document needs it.
 */
export interface MarkdownGlyphs {
  /**
   * Icon of each callout kind, such as `warning`, rendered at the callout's start.
   */
  readonly callouts?: Readonly<Partial<Record<string, ReactNode>>> | undefined;

  /**
   * Icons of the copy control each fenced block renders in its header.
   */
  readonly copy?: CopyGlyphs | undefined;

  /**
   * Marks of a done and an open task, in place of the recipe's box.
   */
  readonly tasks?: TaskGlyphs | undefined;
}

/**
 * Describes a node of one type, which picks that type out of a union of nodes.
 *
 * @typeParam Type - The node's type.
 */
export interface Typed<Type extends string> {
  /**
   * Type of the node.
   */
  readonly type: Type;
}

/**
 * Describes what every renderer of a node reads.
 */
export interface Scope {
  /**
   * Renders nested blocks, such as a list item's or a quotation's, in order.
   */
  readonly blocks: (nodes: readonly BlockNode[], scope: Scope) => ReactNode[];

  /**
   * Components that replace the library's for one kind of node.
   */
  readonly components: MarkdownComponents;

  /**
   * Glyphs the caller gave.
   */
  readonly glyphs: MarkdownGlyphs;

  /**
   * Level a `#` heading renders at.
   */
  readonly headingLevel: number;

  /**
   * Prefix of every footnote id.
   */
  readonly prefix: string;

  /**
   * Text of the heading of the section being rendered, which names its tables.
   */
  readonly section?: string | undefined;

  /**
   * Size of the document.
   */
  readonly size: MarkdownSize;

  /**
   * Words of the document, with every default applied.
   */
  readonly words: Words;
}

/**
 * Lists a heading's size per level at the md size, from `h1`.
 */
const HEADINGS = ["2xl", "xl", "lg", "md", "sm", "xs"] as const;

/**
 * Describes a heading size of the typography `Heading`.
 */
export type HeadingSize = (typeof HEADINGS)[number];

/**
 * Lists the heading elements, from `h1`.
 */
const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

/**
 * Describes a heading element.
 */
export type HeadingTag = (typeof TAGS)[number];

/**
 * Returns the level a heading of a depth renders at, from 1 to 6.
 */
export function levelOf(scope: Scope, depth: number): number {
  return Math.min(6, depth + scope.headingLevel - 1);
}

/**
 * Returns the element of a heading level, `h6` for any level past 6.
 */
export function tagOf(level: number): HeadingTag {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The index is clamped to the list, so the entry exists.
  return TAGS[Math.min(TAGS.length, level) - 1] as HeadingTag;
}

/**
 * Returns the size of a heading that renders at a level, one step smaller in a `sm` document.
 */
export function headingSizeOf(scope: Scope, level: number): HeadingSize {
  const at = Math.min(HEADINGS.length - 1, level - 1 + (scope.size === "sm" ? 1 : 0));

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The index is clamped to the list, so the entry exists.
  return HEADINGS[at] as HeadingSize;
}

/**
 * Returns a footnote's id.
 */
export function footnoteId(scope: Scope, id: string): string {
  return `${scope.prefix}fn-${id}`;
}

/**
 * Returns the id of a reference to a footnote, suffixed from its second reference on.
 */
export function referenceId(scope: Scope, id: string, index = 1): string {
  return index === 1 ? `${scope.prefix}fnref-${id}` : `${scope.prefix}fnref-${id}-${String(index)}`;
}

/**
 * Returns the id of the footnotes' heading, which every reference is described by.
 */
export function footnotesId(scope: Scope): string {
  return `${scope.prefix}footnotes`;
}

/**
 * Returns the text of inline nodes as a reader sees it, without marks.
 */
export function textOf(nodes: readonly InlineNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text" || node.type === "inlineCode") return node.value;
      if (node.type === "image") return node.alt;

      return "children" in node ? textOf(node.children) : "";
    })
    .join("");
}
