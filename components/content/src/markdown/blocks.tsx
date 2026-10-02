/**
 * Renders the block nodes of a Markdown document with the library's components.
 *
 * @remarks
 *   A heading is the typography `Heading` at its level, with the parser's id, a paragraph is the
 *   typography `Text`, a quotation is the typography `Blockquote`, and a thematic break is the
 *   layout `Divider`. Lists, tables, fenced blocks, callouts and footnotes have renderers of their
 *   own. Raw HTML never renders, and a block of an extension this document does not parse renders
 *   its children. Each block after a heading reads that heading's text as its section's name.
 */

import { type ReactNode } from "react";

import { type BlockNode, type HeadingNode } from "@tanstack/markdown";

import { Divider } from "@stealthscale/component-layout";
import { Blockquote, Heading, Text } from "@stealthscale/component-typography";

import { renderFlow } from "#markdown/flow.tsx";
import { renderInlines } from "#markdown/inlines.tsx";
import { each } from "#markdown/keyed.tsx";
import { headingSizeOf, levelOf, type Scope, tagOf, textOf, type Typed } from "#markdown/scope.ts";
import { STRUCTURED } from "#markdown/structured.ts";

/**
 * Describes the renderer of one kind of block node.
 *
 * @typeParam Type - The node's type.
 */
type Renderer<Type extends BlockNode["type"]> = (
  node: Extract<BlockNode, Typed<Type>>,
  scope: Scope,
) => ReactNode;

/**
 * Renders a heading at the level its depth takes in the document.
 */
function heading(node: HeadingNode, scope: Scope): ReactNode {
  const level = levelOf(scope, node.depth);

  return (
    <Heading as={tagOf(level)} id={node.id} size={headingSizeOf(scope, level)}>
      {renderInlines(node.children, scope)}
    </Heading>
  );
}

/**
 * Maps each block node type to its renderer.
 */
const RENDERERS: { readonly [Type in BlockNode["type"]]: Renderer<Type> } = {
  ...STRUCTURED,
  blockquote: (node, scope) => (
    <Blockquote.Root size={scope.size}>
      <Blockquote.Content>{renderFlow(node.children, scope)}</Blockquote.Content>
    </Blockquote.Root>
  ),
  component: (node, scope) => renderFlow(node.children, scope),
  heading,
  html: () => null,
  paragraph: (node, scope) => <Text size={scope.size}>{renderInlines(node.children, scope)}</Text>,
  thematicBreak: () => <Divider />,
};

/**
 * Renders one block node.
 */
function renderBlock(node: BlockNode, scope: Scope): ReactNode {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- The renderer is looked up by the node's own type, so it takes that node.
  return (RENDERERS[node.type] as Renderer<BlockNode["type"]>)(node, scope);
}

/**
 * Renders block nodes in order, each keyed by its place, and names each section by its heading.
 *
 * @param nodes - The document's blocks, or a block's nested blocks.
 * @param scope - The document's components, glyphs, words and ids.
 */
export function renderBlocks(nodes: readonly BlockNode[], scope: Scope): ReactNode[] {
  let section = scope.section;

  return each(nodes, (node) => {
    if (node.type === "heading") section = textOf(node.children);

    return renderBlock(node, { ...scope, section });
  });
}
