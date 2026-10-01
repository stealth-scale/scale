/**
 * Reads a slot's plan and the pages' contributions to it for the current page, for `Slot` and
 * `useSlot`.
 */

import { useMatched } from "#conditions/matched.ts";
import { type PageContribution } from "#host/stores.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";
import { type Plan, planOf, signatureOf } from "#slots/plan.ts";

/**
 * Describes a slot's plan with the string that changes exactly when it does.
 */
export interface Planned {
  /**
   * The slot's plan: the extensions it renders and the ones it drops.
   */
  readonly plan: Plan;

  /**
   * The plan as `signatureOf` writes it.
   */
  readonly signature: string;
}

/**
 * The contributions of a slot no page contributes to.
 */
const NONE: readonly PageContribution[] = [];

/**
 * Returns a slot's plan for the current page, and renders again when the plan changes.
 *
 * @param hook - Name of the reader, which an error outside a host names.
 * @param slotId - Qualified id of the slot.
 * @param match - The value a keyed slot renders with.
 * @param props - The slot's props, whose `record` a field condition reads.
 */
export function usePlan(hook: string, slotId: string, match?: string, props?: unknown): Planned {
  const { product, stores } = useHost(hook);
  const input = { match, matched: useMatched(), product, props, slotId, stores };

  useSelector(
    [stores.availability, stores.flags, stores.placements, stores.quarantine, stores.session],
    () => signatureOf(planOf(input)),
  );

  const plan = planOf(input);

  return { plan, signature: signatureOf(plan) };
}

/**
 * Returns what the pages on screen contribute to a slot, in order, and renders again when that
 * changes.
 *
 * @param hook - Name of the reader, which an error outside a host names.
 * @param slotId - Qualified id of the slot.
 */
export function useContributions(hook: string, slotId: string): readonly PageContribution[] {
  const { pages } = useHost(hook).stores;
  const placed = useSelector([pages], () => pages.get().get(slotId) ?? NONE);

  return placed.toSorted((one, other) => one.order - other.order);
}
