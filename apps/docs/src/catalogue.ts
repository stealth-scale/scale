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
 * The path the catalogue is served under.
 *
 * @remarks
 *   This application's choice: the declarations carry no leading slash, so moving this moves every
 *   address with it.
 */
export const MOUNTED = "components";

/**
 * Every route compiled into the catalogue, which the tree is built from and the rail lists.
 */
export const COMPILED: readonly RouteDeclaration[] = declarations(pages, {
  id: CATALOGUE,
  layout: [FRAME],
  path: MOUNTED,
});
