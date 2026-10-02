/**
 * Provides the registry a card's description and addon report their IDs to, so the card's input
 * lists them in `aria-describedby`.
 */

import { createRequiredContext } from "@stealthscale/hooks";

import { type Describe, useDescribed } from "#described.ts";
import { useRadioGroup } from "#radio-group/machine.ts";
import { useItem } from "#radio-group/state.ts";

/**
 * Provides the card's report function to the parts inside it, and reads it back.
 *
 * @remarks
 *   `useDescribe` throws for a part rendered outside `RadioCard.Item`.
 */
export const [DescribeProvider, useDescribe] = createRequiredContext<Describe>("RadioCard.Item");

/**
 * Describes the attributes of a part that describes its card.
 */
export interface Describing {
  /**
   * Whether the card is disabled, as the attribute the recipe reads.
   */
  readonly "data-disabled": true | undefined;

  /**
   * Whether the card is checked, as the attribute the recipe reads.
   */
  readonly "data-state": "checked" | "unchecked";

  /**
   * ID the card's input lists in `aria-describedby`.
   */
  readonly id: string;
}

/**
 * Reports a part to the card around it while the part is mounted, and returns its attributes.
 *
 * @param given - The ID the caller passes, or nothing for a generated one.
 * @returns The part's ID and the card's disabled and checked states.
 */
export function useDescribing(given: string | undefined): Describing {
  const api = useRadioGroup();
  const state = api.getItemState(useItem());
  const id = useDescribed(useDescribe(), given);

  return {
    "data-disabled": state.disabled || undefined,
    "data-state": state.checked ? "checked" : "unchecked",
    id,
  };
}
