/**
 * Declares the catalogue's routes, one per page this build indexed, rendered in the frame layout.
 */

import { pages } from "virtual:specimen-index";

import { type RouteDeclaration, type RoutesContext } from "@stealthscale/provider-router";
import { declarations, indexId } from "@stealthscale/specimen";

/**
 * Describes the router context of the catalogue: the route map, and the compiled routes the
 * router's tree was built from.
 *
 * @remarks
 *   The rail reads its pages from this context, not from `COMPILED`, so it lists exactly the pages
 *   the route map resolves. Read from `COMPILED`, a hot update rendered a new page's link before
 *   the router knew its id.
 */
export interface CatalogueContext extends RoutesContext {
  /**
   * The compiled routes the router's current tree was built from.
   */
  readonly declarations?: readonly RouteDeclaration[] | undefined;
}

/**
 * The name the layout every page is rendered in is registered under.
 */
export const FRAME = "docs.frame";

/**
 * The id of the catalogue's parent route.
 */
export const CATALOGUE = "docs.components";

/**
 * The id of the catalogue's index route, which the brand link and every page's breadcrumb link to.
 */
export const INDEX = indexId(CATALOGUE);

/**
 * The path the catalogue is served under, which is the site root.
 *
 * @remarks
 *   A page's path is its identifier, so `components/feedback/alert` is served at
 *   `/components/feedback/alert`. A mount path of this application's own would repeat the
 *   `components` segment in two places. A section added later, such as `guides`, is served from the
 *   same root without a change here.
 */
export const MOUNTED = "/";

/**
 * The path, at the root, where a device preview loads one sample without the layout.
 */
export const FRAMED = "framed";

/**
 * Declares every route in the catalogue, which the route tree is compiled from.
 */
export const COMPILED: readonly RouteDeclaration[] = declarations(pages, {
  framed: { id: "docs.framed", path: FRAMED },
  id: CATALOGUE,
  layout: [FRAME],
  path: MOUNTED,
});
