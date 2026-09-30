/**
 * Reads the changes React Flow reports for a preset's nodes: the node a person selected, the sizes
 * React Flow measured, and the positions a person moved nodes to.
 *
 * @remarks
 *   React Flow reports a press on a node, Enter and Space as a selection change, and Escape and a
 *   press on the canvas's background as a change that clears it. A selection moved from one node to
 *   another reports both changes in the order React Flow keeps its nodes, so the node selected
 *   decides, whichever comes first. React Flow reports a node's size when it first measures the
 *   node and whenever the size changes. A drag reports the node's position at every step and at
 *   its end, and an arrow key reports the selected node's position once.
 */

import { type NodeChange, type XYPosition } from "@xyflow/react";

/**
 * Describes a node's size in pixels, as React Flow measured it.
 */
export interface Size {
  /**
   * Height of the node.
   */
  readonly height: number;

  /**
   * Width of the node.
   */
  readonly width: number;
}

/**
 * Returns the id of the node the changes select, `null` when they only clear the selection, or
 * undefined when they change no selection.
 */
export function selectedBy(changes: readonly NodeChange[]): null | string | undefined {
  const selections = changes.filter((change) => change.type === "select");

  if (selections.length === 0) return undefined;

  return selections.find((change) => change.selected)?.id ?? null;
}

/**
 * Returns the sizes with every size the changes measured, or the same sizes when they measured
 * none that differs.
 *
 * @param sizes - The sizes measured before.
 * @param changes - The changes React Flow reported.
 */
export function measuredBy(
  sizes: ReadonlyMap<string, Size>,
  changes: readonly NodeChange[],
): ReadonlyMap<string, Size> {
  const next = new Map(sizes);
  let changed = false;

  for (const change of changes) {
    if (change.type === "dimensions" && change.dimensions !== undefined) {
      const { height, width } = change.dimensions;
      const known = sizes.get(change.id);

      if (known?.height !== height || known.width !== width) {
        next.set(change.id, { height, width });
        changed = true;
      }
    }
  }

  return changed ? next : sizes;
}

/**
 * Returns the positions with every position the changes moved a node to, or the same positions
 * when they moved none.
 *
 * @param positions - The positions people moved nodes to before.
 * @param changes - The changes React Flow reported.
 */
export function movedBy(
  positions: ReadonlyMap<string, XYPosition>,
  changes: readonly NodeChange[],
): ReadonlyMap<string, XYPosition> {
  const moves = changes.flatMap((change) =>
    change.type === "position" && change.position !== undefined
      ? [[change.id, change.position] as const]
      : [],
  );

  return moves.length === 0 ? positions : new Map([...positions, ...moves]);
}
