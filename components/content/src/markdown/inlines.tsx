/**
 * Renders the inline nodes of a Markdown document with the library's components.
 *
 * @remarks
 *   Strong and emphasised text are the typography `Strong` and `Em`, code in a line is the
 *   typography `Code`, and a link is the navigation `Link`, underlined at rest, or the caller's
 *   replacement. Struck text, an image and a footnote reference are the document's own `del`,
 *   `img` and `sup`, which no component renders. An image whose source the URL policy removed
 *   renders its alternative text in its place. A footnote reference links to its footnote and
 *   is described by the footnotes' heading. Raw HTML never renders.
 */

import { type ReactNode } from "react";

import {
  type FootnoteReferenceNode,
  type ImageNode,
  type InlineNode,
  type LinkNode,
} from "@tanstack/markdown";

import { Link } from "@stealthscale/component-navigation";
import { Code, Em, Strong } from "@stealthscale/component-typography";

import { withContext } from "#markdown/context.ts";
import { each } from "#markdown/keyed.tsx";
import { footnoteId, footnotesId, referenceId, type Scope, type Typed } from "#markdown/scope.ts";

/**
 * Renders struck text with the recipe's deleted class.
 */
const Deleted = withContext("del", "deleted");

/**
 * Renders an image with the recipe's image class.
 */
const Picture = withContext("img", "image");

/**
 * Renders a footnote reference's `sup` with the recipe's reference class.
 */
const Reference = withContext("sup", "reference");

/**
 * Describes the renderer of one kind of inline node.
 *
 * @typeParam Type - The node's type.
 */
type Renderer<Type extends InlineNode["type"]> = (
  node: Extract<InlineNode, Typed<Type>>,
  scope: Scope,
) => ReactNode;

/**
 * Renders a link through the caller's replacement, or the navigation `Link`.
 */
function link(node: LinkNode, scope: Scope): ReactNode {
  const Anchor = scope.components.link ?? Link;

  return (
    <Anchor href={node.href} title={node.title}>
      {renderInlines(node.children, scope)}
    </Anchor>
  );
}

/**
 * Renders an image through the caller's replacement, or the document's `img`, and its alternative
 * text where the URL policy removed its source.
 */
function image(node: ImageNode, scope: Scope): ReactNode {
  if (node.src === "") return node.alt;

  const Replacement = scope.components.image;

  return Replacement === undefined ? (
    <Picture alt={node.alt} loading="lazy" src={node.src} title={node.title} />
  ) : (
    <Replacement alt={node.alt} src={node.src} title={node.title} />
  );
}

/**
 * Renders a footnote reference: its number as a link to the footnote.
 */
function reference(node: FootnoteReferenceNode, scope: Scope): ReactNode {
  return (
    <Reference>
      <Link
        aria-describedby={footnotesId(scope)}
        href={`#${footnoteId(scope, node.id)}`}
        id={referenceId(scope, node.id, node.referenceIndex)}
      >
        {node.number}
      </Link>
    </Reference>
  );
}

/**
 * Maps each inline node type to its renderer.
 */
const RENDERERS: { readonly [Type in InlineNode["type"]]: Renderer<Type> } = {
  break: () => <br />,
  emphasis: (node, scope) => <Em>{renderInlines(node.children, scope)}</Em>,
  footnoteReference: reference,
  image,
  inlineCode: (node, scope) => <Code size={scope.size}>{node.value}</Code>,
  inlineComponent: (node, scope) => renderInlines(node.children, scope),
  inlineHtml: () => null,
  link,
  strike: (node, scope) => <Deleted>{renderInlines(node.children, scope)}</Deleted>,
  strong: (node, scope) => <Strong>{renderInlines(node.children, scope)}</Strong>,
  text: (node) => node.value,
};

/**
 * Renders one inline node.
 */
function renderInline(node: InlineNode, scope: Scope): ReactNode {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The renderer is looked up by the node's own type, so it takes that node.
  return (RENDERERS[node.type] as Renderer<InlineNode["type"]>)(node, scope);
}

/**
 * Renders inline nodes in order, each keyed by its place.
 *
 * @param nodes - A block's inline content.
 * @param scope - The document's components, glyphs, words and ids.
 */
export function renderInlines(nodes: readonly InlineNode[], scope: Scope): ReactNode[] {
  return each(nodes, (node) => renderInline(node, scope));
}
