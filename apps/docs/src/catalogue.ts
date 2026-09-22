/**
 * Places the catalogue: the pages this build indexed, under one route, inside the frame.
 */

import { pages } from "virtual:specimen-index";

import { type RouteDeclaration } from "@stealthscale/provider-router";
import { declarations, indexId } from "@stealthscale/specimen";

/**
 * The name the frame every page is drawn in is registered under.
 */
export const FRAME = "docs.frame";

/**
 * The id of the route the catalogue hangs under.
 */
export const CATALOGUE = "docs.components";

/**
 * The id of the catalogue's index, which the brand and every page's trail lead to.
 */
export const INDEX = indexId(CATALOGUE);

/**
 * The path the catalogue is served under, which is the site's own root.
 *
 * @remarks
 *   A page's address is its identifier and nothing else, so `components/feedback/alert` is served
 *   at `/components/feedback/alert`. Mounting the catalogue under a path of this application's
 *   choosing would put that segment in two places, and the two would disagree the first time
 *   either moved. A section the catalogue gains later, `guides` beside `components`, is served by
 *   the same root without this file learning about it.
 */
export const MOUNTED = "/";

/**
 * The path a device loads one sample at: a page with no frame round it, at the root.
 */
export const FRAMED = "framed";

/**
 * Every route compiled into the catalogue, which the tree is built from and the rail lists.
 */
export const COMPILED: readonly RouteDeclaration[] = declarations(pages, {
  framed: { id: "docs.framed", path: FRAMED },
  id: CATALOGUE,
  layout: [FRAME],
  path: MOUNTED,
});
