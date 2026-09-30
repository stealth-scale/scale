/**
 * Renders a graph's overview map beside its canvas.
 *
 * @remarks
 *   The map is React Flow's minimap, an `img` named by `label`, which a person drags to pan the
 *   canvas and scrolls over to zoom it. It renders in `Graph.Root` beside `Graph.Canvas`, below it
 *   at the end of the figure, so it covers no node at any width. The recipe paints it from the
 *   theme: the panel's surface, the nodes in the muted ink, and the part out of view behind a
 *   wash. An overview helps once a graph is larger than its canvas.
 */

import { type ReactElement } from "react";

import { MiniMap as FlowMiniMap, type MiniMapProps as FlowMiniMapProps } from "@xyflow/react";

import { withContext } from "#graph/context.ts";

/**
 * Renders the box the map is placed in, with the recipe's overview class.
 */
const Box = withContext("div", "overview");

/**
 * Describes the props of the overview map: its name and the props of React Flow's minimap.
 */
export interface MiniMapProps extends Omit<FlowMiniMapProps, "ariaLabel"> {
  /**
   * Accessible name of the map. `Overview` unless stated.
   */
  readonly label?: string | undefined;
}

/**
 * Renders React Flow's minimap in the overview box, named, pannable and zoomable.
 *
 * @param props - The name and the props of React Flow's minimap.
 */
export function MiniMap({ label = "Overview", ...props }: MiniMapProps): ReactElement {
  return (
    <Box>
      <FlowMiniMap ariaLabel={label} pannable zoomable {...props} />
    </Box>
  );
}
