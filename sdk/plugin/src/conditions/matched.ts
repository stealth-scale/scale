/**
 * Reads the declared routes the router matched, for a condition evaluated on the page.
 */

import { declaredOf, type MatchedRoute, useMatches } from "@stealthscale/provider-router";

/**
 * Returns the qualified id of every declared route a list of matches contains, outermost first.
 */
function idsOf(matches: readonly MatchedRoute[]): readonly string[] {
  return matches.flatMap((match) => declaredOf(match)?.id ?? []);
}

/**
 * Returns the qualified id of every matched declared route, and renders again when the ids change.
 *
 * @remarks
 *   The router keeps the selected list while its ids are equal, so a navigation that matches the
 *   same routes renders nothing again.
 */
export function useMatched(): ReadonlySet<string> {
  const ids = useMatches({ select: (matches) => idsOf(matches), structuralSharing: true });

  return new Set(ids);
}
