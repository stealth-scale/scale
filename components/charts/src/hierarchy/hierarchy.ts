/**
 * Resolves a hierarchy of parts, such as spend by team and then by service: each node's size and
 * each leaf with its top-level group and its share of the whole.
 *
 * @remarks
 *   A parent's size is its children's sum, and its own `value` is ignored, as recharts sizes a
 *   treemap's parent. A leaf's size is its value where that is a finite number above zero, else 0,
 *   because an area or an angle cannot be negative. Such a leaf renders nothing, and
 *   `hierarchyLeaves` still lists it with the value as given.
 */

import { type ReactNode } from "react";

import { type ChartColor } from "#chart/colors.ts";

/**
 * Describes one node of a hierarchy: a leaf with a value, or a parent of other nodes.
 */
export interface HierarchyNode {
  /**
   * Nodes the part is made of. A node with `children` is a parent, even with none.
   */
  readonly children?: readonly HierarchyNode[] | undefined;

  /**
   * Palette a top-level node's family takes its colors from. The theme's series color at the
   * node's place, largest first, unless stated. A deeper node's color is ignored.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Key of the node, which the legend, the tooltip and the hidden keys name.
   */
  readonly key: string;

  /**
   * Name the chart, the tooltip and the legend show. The key unless stated.
   */
  readonly label?: ReactNode;

  /**
   * Size of a leaf. A parent's size is its children's sum.
   */
  readonly value?: number | undefined;
}

/**
 * Describes one leaf of a hierarchy with its place in the whole.
 */
export interface HierarchyLeaf {
  /**
   * Key of the top-level node the leaf belongs to, its own key at the top level.
   */
  readonly group: string;

  /**
   * Key of the leaf.
   */
  readonly key: string;

  /**
   * Name of the leaf: its label, else its key.
   */
  readonly label: ReactNode;

  /**
   * Share of the whole the leaf's size is, from 0 to 1. A leaf that renders nothing has a share of 0.
   */
  readonly share: number;

  /**
   * Value of the leaf as given, 0 without one.
   */
  readonly value: number;
}

/**
 * Returns a node's size: a leaf's value where it is a finite number above zero, else 0, or a
 * parent's children's sum.
 */
export function sizeOf(node: HierarchyNode): number {
  if (node.children === undefined) {
    const value = node.value ?? 0;

    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  let sum = 0;

  for (const child of node.children) sum += sizeOf(child);

  return sum;
}

/**
 * Returns the nodes whose size is above 0, largest first.
 */
export function largestFirst(nodes: readonly HierarchyNode[]): HierarchyNode[] {
  return nodes
    .filter((node) => sizeOf(node) > 0)
    .toSorted((first, second) => sizeOf(second) - sizeOf(first));
}

/**
 * Returns the number of levels the nodes of size above 0 make, 1 for leaves and 0 for none.
 */
export function depthOf(nodes: readonly HierarchyNode[]): number {
  let deepest = 0;

  for (const node of nodes) {
    if (sizeOf(node) > 0) {
      deepest = Math.max(deepest, 1 + (node.children === undefined ? 0 : depthOf(node.children)));
    }
  }

  return deepest;
}

/**
 * Returns every leaf depth first, each with its top-level group, its value as given and its share
 * of the whole.
 *
 * @remarks
 *   A ranking sorts the leaves by value. The leaves the chart leaves out are those whose value is
 *   below zero or not a finite number.
 * @param nodes - The top-level nodes.
 */
export function hierarchyLeaves(nodes: readonly HierarchyNode[]): HierarchyLeaf[] {
  let total = 0;

  for (const node of nodes) total += sizeOf(node);

  const leaves: HierarchyLeaf[] = [];

  /**
   * Appends the leaves under a node, with the group they belong to.
   */
  const collect = (node: HierarchyNode, group: string): void => {
    if (node.children === undefined) {
      leaves.push({
        group,
        key: node.key,
        label: node.label ?? node.key,
        share: total === 0 ? 0 : sizeOf(node) / total,
        value: node.value ?? 0,
      });

      return;
    }

    for (const child of node.children) collect(child, group);
  };

  for (const node of nodes) collect(node, node.key);

  return leaves;
}
