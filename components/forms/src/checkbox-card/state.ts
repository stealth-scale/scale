/**
 * Provides the registry a checkbox card's description and addon report their IDs to, so the
 * card's input lists them in `aria-describedby`.
 */

import { createRequiredContext } from "@stealthscale/hooks";

import { type CheckboxApi, useCheckbox } from "#checkbox/machine.ts";
import { type Describe, useDescribed } from "#described.ts";

/**
 * Provides the card's report function to the parts inside it, and reads it back.
 *
 * @remarks
 *   `useDescribe` throws for a part rendered outside `CheckboxCard.Root`.
 */
export const [DescribeProvider, useDescribe] = createRequiredContext<Describe>("CheckboxCard.Root");

/**
 * Describes the attributes of a part that describes its card.
 */
export interface Describing {
  /**
   * Whether the card is disabled, as the attribute the recipe reads.
   */
  readonly "data-disabled": true | undefined;

  /**
   * Whether the card is checked, partly on or unchecked, as the attribute the recipe reads.
   */
  readonly "data-state": "checked" | "indeterminate" | "unchecked";

  /**
   * ID the card's input lists in `aria-describedby`.
   */
  readonly id: string;
}

/**
 * Returns the state of the card as the machine names it on its parts.
 */
function stateOf(api: CheckboxApi): Describing["data-state"] {
  if (api.indeterminate) {
    return "indeterminate";
  }

  return api.checked ? "checked" : "unchecked";
}

/**
 * Reports a part to the card around it while the part is mounted, and returns its attributes.
 *
 * @param given - The ID the caller passes, or nothing for a generated one.
 * @returns The part's ID and the card's disabled and checked states.
 */
export function useDescribing(given: string | undefined): Describing {
  const api = useCheckbox();
  const id = useDescribed(useDescribe(), given);

  return { "data-disabled": api.disabled === true || undefined, "data-state": stateOf(api), id };
}
