/**
 * Renders the JSON tree view's root: the tree view's root over a collection built from a value.
 *
 * @remarks
 *   The root builds the collection from `data` and the preview options. It opens every branch down
 *   to `defaultExpandedDepth` and passes every other prop to the tree view's root, its size among
 *   them, `sm` unless stated. The tree view's selected look is `plain`, medium weight without a
 *   fill: on the subtle fill the code inks measure 5.7:1 after dark, under the theme's 7:1 text
 *   ratio. The utilities' `collapseStringsAfterLength` is not offered: in 1.44.0 an object's
 *   preview describes its entries without the options, so the option does not change a preview.
 */

import { type ComponentProps, type ReactElement } from "react";

import { getPreviewOptions } from "@zag-js/json-tree-utils";

import { TreeView } from "@stealthscale/component-collections";
import { omitUndefined } from "@stealthscale/hooks";

import { collectionOf, expandedTo } from "#json-tree-view/collection.ts";
import { withProvider } from "#json-tree-view/context.ts";
import { OptionsProvider } from "#json-tree-view/options.ts";

/**
 * Renders the tree view's root with the JSON tree view's root class, and passes the size on.
 */
const Framed = withProvider(TreeView.Root, "root", { forwardProps: ["size"] });

/**
 * Describes the props of the root: the value, the depth it opens to, the preview options and the
 * tree view root's props, less the collection and the selected look.
 */
export interface RootProps extends Omit<ComponentProps<typeof Framed>, "collection" | "selected"> {
  /**
   * Value the tree renders, of any type.
   */
  readonly data: unknown;

  /**
   * Deepest level open on the first render, the value's own node at 1. 1 unless stated, and 0
   * opens nothing.
   */
  readonly defaultExpandedDepth?: number | undefined;

  /**
   * Length above which an array's items are split into groups of this length, each a branch.
   * 100 unless stated.
   */
  readonly groupArraysAfterLength?: number | undefined;

  /**
   * Entries a collapsed branch's preview lists before it ends in an ellipsis. 3 unless stated.
   */
  readonly maxPreviewItems?: number | undefined;

  /**
   * Whether a key is written in quotes, as JSON writes it. `false` unless stated.
   */
  readonly quotesOnKeys?: boolean | undefined;

  /**
   * Whether a branch lists the properties its value does not enumerate, such as a function's
   * source, a typed array's values or an object's non-enumerable properties. `true` unless stated.
   */
  readonly showNonenumerable?: boolean | undefined;
}

/**
 * Renders the root and provides the options to the rows.
 *
 * @param props - The value, the depth, the preview options and the tree view root's props.
 * @returns The tree view's root inside the options' provider.
 */
export function Root({
  data,
  defaultExpandedDepth = 1,
  groupArraysAfterLength,
  maxPreviewItems,
  quotesOnKeys = false,
  showNonenumerable,
  size = "sm",
  ...props
}: RootProps): ReactElement {
  const preview = getPreviewOptions(
    omitUndefined({ groupArraysAfterLength, maxPreviewItems, showNonenumerable }),
  );
  const collection = collectionOf(data, preview);

  return (
    <OptionsProvider value={{ preview, quotesOnKeys }}>
      <Framed
        collection={collection}
        defaultExpandedValue={expandedTo(collection, defaultExpandedDepth)}
        selected="plain"
        size={size}
        {...props}
      />
    </OptionsProvider>
  );
}
