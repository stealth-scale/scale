import { type FixtureHost } from "#host/host.fixtures.tsx";
import { type PlanInput } from "#slots/plan.ts";

export function inputOf(
  host: FixtureHost,
  slotId: string,
  given: Partial<PlanInput> = {},
): PlanInput {
  return {
    match: undefined,
    matched: new Set(),
    product: host.runtime.product,
    props: undefined,
    slotId,
    stores: host.runtime.stores,
    ...given,
  };
}
