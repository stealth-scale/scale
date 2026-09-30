/**
 * Renders nested blocks, such as a list item's paragraphs or a quotation's, in a column with the
 * document's gap between them.
 *
 * @remarks
 *   The library's components set no margins, so blocks nested inside another take their spacing
 *   from this column, as the document's top-level blocks take theirs from the root.
 */

import { type ReactElement } from "react";

import { type BlockNode } from "@tanstack/markdown";

import { withContext } from "#markdown/context.ts";
import { type Scope } from "#markdown/scope.ts";

/**
 * Renders the column's `div` with the recipe's flow class.
 */
const Flow = withContext("div", "flow");

/**
 * Renders nested blocks in the document's column.
 *
 * @param nodes - The blocks inside another block.
 * @param scope - The document's components, glyphs, words and ids.
 */
export function renderFlow(nodes: readonly BlockNode[], scope: Scope): ReactElement {
  return <Flow>{scope.blocks(nodes, scope)}</Flow>;
}
