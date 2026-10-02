/**
 * Says whether the page being read is one the catalogue declared.
 */

import { useDeclaredRoute } from "@stealthscale/provider-router";

import { NAMED } from "#catalogue/routes.tsx";

/**
 * Describes what a link to the catalogue carries in `aria-current`. It is the current page while
 * the reader is inside the catalogue, and not current anywhere else.
 */
export type Marked = "false" | "page";

/**
 * Says what a link to the catalogue's index carries in `aria-current`.
 *
 * @remarks
 *   The link is marked wherever a reader stands inside the catalogue, not on its index alone,
 *   because it names the section a reader is in rather than a page they are on.
 *   Which route is current is read rather than matched. A catalogue served at the site root is
 *   linked to at `/`, and a router will not call that link current on every page under it, because
 *   then every link to a root would be current everywhere. The route the reader is on names itself
 *   instead, and a catalogue route is one the catalogue declared: its pages under the prefix this
 *   package names them with, and its indexes under the id the application hung it from.
 *   The value rather than the answer, so a caller writes one attribute rather than a condition
 *   around one. `false` is what ARIA states for an element that is not the current one, and the
 *   recipes fill a control on `page` alone.
 * @param catalogue - The id of the route the catalogue hangs under.
 * @returns `page` inside the catalogue, `false` outside it.
 */
export function useCatalogueMark(catalogue: string): Marked {
  const id = useDeclaredRoute()?.id ?? "";
  const inside = id.startsWith(`${NAMED}.`) || id.startsWith(`${catalogue}.`);

  return inside ? "page" : "false";
}
