/**
 * Works out the size a layout places a node by.
 *
 * @remarks
 *   A node's size is the size React Flow measured, else its stated `width` and `height`, else its
 *   `initialWidth` and `initialHeight`, else 256 by 44 pixels, the size of a card with one line.
 *   Each side is read on its own, so a node that states only a width takes the default height.
 */

import { type Node } from "@xyflow/react";

import { type Size } from "#graph/changes.ts";

/**
 * Size of a node that states none and has not been measured, in pixels.
 */
export const SIZE: Size = { height: 44, width: 256 };

/**
 * Returns the size a layout places a node by: the measured size, the stated size, the initial
 * size, or the default.
 */
export function sizeOf(node: Node): Size {
  return {
    height: node.measured?.height ?? node.height ?? node.initialHeight ?? SIZE.height,
    width: node.measured?.width ?? node.width ?? node.initialWidth ?? SIZE.width,
  };
}
