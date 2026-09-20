/**
 * Declares the route a frame loads a sample at, for an application to compile beside the
 * catalogue's own.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";

import { type Indexed } from "#catalogue/types.ts";
import { Framed } from "#framed/framed.tsx";

/**
 * Describes where the framed page goes.
 */
export interface Framing {
  /**
   * The id of the route.
   */
  readonly id: string;

  /**
   * The path the framed page is served at, relative to the compiler's parent.
   */
  readonly path: string;
}

/**
 * Declares the framed page: a route with no layout, so the frame shows the sample and none of the
 * chrome around the catalogue.
 *
 * @param pages - Every page the index found, which is what `virtual:specimen-index` exports.
 * @param framing - Where the page goes.
 * @returns The declaration, for the application to compile with the rest.
 */
export function framedDeclaration(pages: readonly Indexed[], framing: Framing): RouteDeclaration {
  return { component: () => <Framed pages={pages} />, id: framing.id, path: framing.path };
}
