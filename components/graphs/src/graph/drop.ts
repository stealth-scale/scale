/**
 * Places what a palette adds: a drop at the point the pointer released it, and a press at the
 * middle of the view, both in the graph's coordinates.
 *
 * @remarks
 *   A palette item writes its id to a drag's data under the kit's own type, and the canvas takes a
 *   drop only while the drag's data contains that type, so a file or a link dropped on the canvas
 *   is left to the browser. React Flow turns a point on the screen into the graph's coordinates
 *   through its pan and zoom, so both functions run inside the graph's provider. A press has no
 *   pointer to place its node under, so it places it at the middle of what the canvas shows, and at
 *   the graph's origin while no canvas renders.
 */

import { type DragEvent, type HTMLAttributes } from "react";

import { useReactFlow, useStoreApi, type XYPosition } from "@xyflow/react";

/**
 * Type of the drag data a palette item writes its id under.
 */
export const ITEM = "application/x-stealth-graph-item";

/**
 * Describes the handlers a canvas takes a drop through.
 */
export type DropTarget = Pick<HTMLAttributes<HTMLDivElement>, "onDragOver" | "onDrop">;

/**
 * Returns the handlers that take a palette item's drop and report it with the point it was dropped
 * at, or no handler without a caller to report to.
 *
 * @param onDropItem - Called with the item's id and the point it was dropped at.
 */
export function useDrop(onDropItem?: (item: string, position: XYPosition) => void): DropTarget {
  const flow = useReactFlow();

  if (onDropItem === undefined) return {};

  return {
    onDragOver: (event: DragEvent<HTMLDivElement>) => {
      if (!event.dataTransfer.types.includes(ITEM)) return;

      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    onDrop: (event: DragEvent<HTMLDivElement>) => {
      const item = event.dataTransfer.getData(ITEM);

      if (item === "") return;

      event.preventDefault();
      onDropItem(item, flow.screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    },
  };
}

/**
 * Returns a function that returns the middle of what the canvas shows, in the graph's coordinates,
 * or the graph's origin while no canvas renders.
 */
export function useViewCentre(): () => XYPosition {
  const flow = useReactFlow();
  const store = useStoreApi();

  return () => {
    const { domNode, height, width } = store.getState();

    if (domNode === null) return { x: 0, y: 0 };

    const box = domNode.getBoundingClientRect();

    return flow.screenToFlowPosition({ x: box.left + width / 2, y: box.top + height / 2 });
  };
}
