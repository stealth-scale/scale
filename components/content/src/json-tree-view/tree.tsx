/**
 * Renders the element with the `tree` role around the rows of a JSON value.
 *
 * @remarks
 *   The tree renders a row per node: a branch for an object, an array, and any other value the
 *   utilities list properties for, and an item for a leaf. A row is named by its text, the key and
 *   the value's preview, so the name contains every word the row shows. The tree takes its name
 *   from the caller's `aria-label` or `aria-labelledby`.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { type JsonNode } from "@zag-js/json-tree-utils";

import { TreeView } from "@stealthscale/component-collections";

import { withContext } from "#json-tree-view/context.ts";
import { Row } from "#json-tree-view/row.tsx";

/**
 * Renders the tree view's tree with the JSON tree view's tree class.
 */
const Treed = withContext(TreeView.Tree, "tree");

/**
 * Describes the props of the tree: the branch glyph, the indent guides, the functions over the
 * leaves, and the props of a `div`.
 */
export interface TreeProps extends Omit<ComponentProps<typeof Treed>, "children"> {
  /**
   * Glyph of a branch's indicator, such as a chevron pointing to the inline end. The indicator
   * turns a quarter as the branch opens.
   */
  readonly arrow?: ReactNode;

  /**
   * Returns the address a leaf's row opens, which renders the row as a link, or nothing for a row
   * that is not a link.
   */
  readonly getHref?: ((node: JsonNode) => string | undefined) | undefined;

  /**
   * Whether each open branch renders a line down its group, under the branch's indicator.
   */
  readonly indentGuide?: boolean | undefined;

  /**
   * Returns what a leaf's row renders in place of the value, in the value's ink, or `undefined` to
   * render the value.
   */
  readonly renderValue?: ((node: JsonNode) => ReactNode) | undefined;
}

/**
 * Renders the tree and a row per node of the root's value.
 *
 * @param props - The glyph, the guides, the functions and the props of a `div`.
 * @returns The `div` element.
 */
export function Tree({
  arrow,
  getHref,
  indentGuide = false,
  renderValue,
  ...props
}: TreeProps): ReactElement {
  return (
    <Treed {...props}>
      <TreeView.Nodes
        indentGuide={indentGuide ? <TreeView.BranchIndentGuide /> : undefined}
        render={(details: TreeView.NodeDetails<JsonNode>) => (
          <Row arrow={arrow} details={details} getHref={getHref} renderValue={renderValue} />
        )}
      />
    </Treed>
  );
}
