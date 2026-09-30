/**
 * Renders the row of one node of a JSON value: a branch's row with its indicator, or a leaf's row.
 *
 * @remarks
 *   A row renders the node's key and a colon, then the value as the utilities preview it. A
 *   collapsed branch lists its first entries between its braces, and an open branch shows its
 *   opening brace, whose closing brace the recipe renders after the group. The row's `data-close`
 *   contains that brace. The value's own node has no key. A branch always renders its indicator,
 *   so its text starts where a leaf's text starts at the same level. What `renderValue` returns for
 *   a leaf renders in a span with the value's type, so it keeps the type's ink.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  type JsonNode,
  type JsonNodeElement,
  jsonNodeToElement,
  keyPathToKey,
} from "@zag-js/json-tree-utils";

import { TreeView } from "@stealthscale/component-collections";

import { useOptions } from "#json-tree-view/options.ts";
import { closerOf, rendered, spanOf } from "#json-tree-view/value.ts";

/**
 * Describes the props of a row: the node, and the tree's glyph and functions.
 */
export interface RowProps {
  /**
   * Glyph of a branch's indicator.
   */
  readonly arrow?: ReactNode;

  /**
   * The node and its state, as `TreeView.Nodes` passes them.
   */
  readonly details: TreeView.NodeDetails<JsonNode>;

  /**
   * Returns the address a leaf's row opens, or nothing.
   */
  readonly getHref?: ((node: JsonNode) => string | undefined) | undefined;

  /**
   * Returns what a leaf's row renders in place of its value, or `undefined` for the value.
   */
  readonly renderValue?: ((node: JsonNode) => ReactNode) | undefined;
}

/**
 * Renders a node's row.
 *
 * @param props - The node, the glyph and the functions.
 * @returns `TreeView.BranchControl` for a branch, or `TreeView.Item` for a leaf.
 */
export function Row({ arrow, details, getHref, renderValue }: RowProps): ReactElement {
  const { preview, quotesOnKeys } = useOptions();
  const { node, nodeState } = details;
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the utilities build every preview's top as an element, never as a text
  const element = jsonNodeToElement(node, preview) as JsonNodeElement;
  const key = keyPathToKey(node.keyPath, { excludeRoot: true });
  const keyed =
    key === "" ? null : (
      <>
        <span data-kind="key" data-non-enumerable={node.isNonEnumerable === true ? "" : undefined}>
          {quotesOnKeys ? `"${key}"` : key}
        </span>
        <span data-kind="colon">: </span>
      </>
    );

  if (nodeState.isBranch) {
    return (
      <TreeView.BranchControl data-close={closerOf(element)}>
        <TreeView.BranchIndicator>{arrow}</TreeView.BranchIndicator>
        <TreeView.BranchText>
          {keyed}
          {rendered(element)}
        </TreeView.BranchText>
      </TreeView.BranchControl>
    );
  }

  const shown = renderValue?.(node);

  return (
    <TreeView.Item href={getHref?.(node)}>
      <TreeView.ItemText>
        {keyed}
        {shown === undefined ? rendered(element) : spanOf(element, shown)}
      </TreeView.ItemText>
    </TreeView.Item>
  );
}
