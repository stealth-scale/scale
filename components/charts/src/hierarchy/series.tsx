/**
 * Resolves a hierarchy chart's families: the top-level nodes largest first, and a legend series per
 * node, named with its total.
 */

import { type SeriesOptions } from "#chart/use-chart.ts";
import { type HierarchyNode, largestFirst, sizeOf } from "#hierarchy/hierarchy.ts";
import { ValueLabel } from "#polar/value-label.tsx";

/**
 * Describes a hierarchy's families: its top-level nodes and their legend series.
 */
export interface Families {
  /**
   * Series per top-level node, in the nodes' order.
   */
  readonly series: SeriesOptions[];

  /**
   * Top-level nodes of size above 0, largest first.
   */
  readonly top: HierarchyNode[];
}

/**
 * Returns the top-level nodes largest first, and a series per node in that order: its key, its
 * color, and its name with its total written beside it where `values` is on.
 *
 * @param nodes - The top-level nodes in any order.
 * @param values - Whether each name has its total beside it.
 * @param valueOptions - The `Intl.NumberFormat` options a total is written with.
 */
export function familiesOf(
  nodes: readonly HierarchyNode[],
  values: boolean,
  valueOptions?: Intl.NumberFormatOptions,
): Families {
  const top = largestFirst(nodes);

  return {
    series: top.map((node) => ({
      color: node.color,
      key: node.key,
      label: values ? (
        <ValueLabel label={node.label ?? node.key} options={valueOptions} value={sizeOf(node)} />
      ) : (
        node.label
      ),
    })),
    top,
  };
}
