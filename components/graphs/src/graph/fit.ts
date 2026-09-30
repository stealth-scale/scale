/**
 * Frames a graph in its canvas: how far the view zooms and how much room it keeps clear.
 *
 * @remarks
 *   The view fits the graph at most at its own size, so a small graph is not blown up, and zooms
 *   out as far as 10%, so a graph wider than its canvas fits it. The fit keeps 24px clear at either
 *   side and 32px at the top and the bottom: the top for a tag above a card, 24px tall with its
 *   margin, and the bottom for the attribution, 19px tall 12px from the edge. The controls and the
 *   overview map render beside the canvas and take none of its room.
 */

import { type FitViewOptions } from "@xyflow/react";

/**
 * Largest zoom a fit takes: the graph at its own size.
 */
export const MAX_FIT = 1;

/**
 * Room a fit keeps clear on each side of the canvas, in pixels.
 */
export const PADDING = { bottom: "32px", left: "24px", right: "24px", top: "32px" } as const;

/**
 * How the view fits the graph: at most at its own size, clear of the canvas's edges and the
 * attribution.
 */
export const FIT: FitViewOptions = { maxZoom: MAX_FIT, padding: PADDING };

/**
 * Smallest zoom the view takes.
 */
export const MIN_ZOOM = 0.1;
