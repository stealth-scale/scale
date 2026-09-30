/**
 * Fits a preset's view to its layout and reports whether the canvas is still placing its nodes.
 *
 * @remarks
 *   React Flow takes a controlled graph's nodes into its store in an effect of its own, one step
 *   after the render that laid them out, so a canvas shown in that step renders the old positions.
 *   The canvas places until every node has been measured and until React Flow's store has every
 *   node where the layout put it, and the recipe hides the viewport while it places. The view fits
 *   the layout once every node has been measured and whenever the layout moves a node after that,
 *   in an effect that runs after React Flow's, so the bounds are the measured nodes at their new
 *   positions. The fit is at most at the graph's own size and clear of the
 *   canvas's edges, as `Graph.Canvas` fits it. A change that moves no node, such as a new focus,
 *   keeps the view where a person panned and zoomed it. A node a person moved counts for neither:
 *   a drag moves no view, and the step the store trails a drag by does not hide the viewport.
 */

import { useEffect, useRef } from "react";

import {
  getViewportForBounds,
  type Node,
  useReactFlow,
  useStore,
  useStoreApi,
} from "@xyflow/react";

import { MAX_FIT, MIN_ZOOM, PADDING } from "#graph/fit.ts";

/**
 * Ids of no node, for a graph whose nodes nobody moved.
 */
const NONE: ReadonlySet<string> = new Set();

/**
 * Returns a string that differs whenever a node is added, removed or moved.
 */
export function signatureOf(nodes: readonly Node[]): string {
  return nodes
    .map(({ id, position }) => `${id}:${String(position.x)},${String(position.y)}`)
    .join(";");
}

/**
 * Fits the view to the laid-out nodes whenever the layout moves them, and returns whether the
 * canvas is still placing them.
 *
 * @param nodes - The nodes where the layout put them.
 * @param complete - Whether every node of the graph has been measured and laid out.
 * @param moved - Ids of the nodes a person moved away from where the layout put them.
 */
export function usePlaced(
  nodes: readonly Node[],
  complete: boolean,
  moved: ReadonlySet<string> = NONE,
): boolean {
  const flow = useReactFlow();
  const store = useStoreApi();
  const signature = signatureOf(nodes);
  const settled = signatureOf(nodes.filter((node) => !moved.has(node.id)));
  const stored = useStore((state) =>
    signatureOf(state.nodes.filter((node) => !moved.has(node.id))),
  );
  const fitted = useRef("");

  useEffect(() => {
    if (!complete || fitted.current === signature) return;

    const { height, width } = store.getState();
    const bounds = flow.getNodesBounds([...nodes]);

    fitted.current = signature;
    void flow.setViewport(getViewportForBounds(bounds, width, height, MIN_ZOOM, MAX_FIT, PADDING));
  }, [complete, flow, nodes, signature, store]);

  return !complete || stored !== settled;
}
