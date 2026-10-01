/**
 * Evaluates a condition in a component.
 */

import { evaluateWhen, type When } from "@stealthscale/sdk-core";

import { conditionContextOf } from "#conditions/context.ts";
import { useMatched } from "#conditions/matched.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";

/**
 * Returns true where the condition is true for the session, the flags, the plugins that are on and
 * the matched routes, and renders again when the result changes.
 *
 * @remarks
 *   A component checks `{ plugin }` before it reads an optional plugin's query, because the query's
 *   operation is not served while that plugin is off.
 * @param when - The condition. The hook returns true where none is given.
 */
export function useWhen(when?: When): boolean {
  const { stores } = useHost("useWhen");
  const matched = useMatched();

  return useSelector([stores.availability, stores.flags, stores.session], () =>
    evaluateWhen(when, conditionContextOf(stores, { matched })),
  );
}
