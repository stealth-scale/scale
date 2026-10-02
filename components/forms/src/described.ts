/**
 * Reports a part that describes a card to the card around it, so the card's input lists the part
 * in `aria-describedby`.
 *
 * @remarks
 *   A machine links a card's input to its title and to nothing else. A description a screen reader
 *   never reaches is text only a sighted reader gets, so each part reports its ID while it is
 *   mounted and removes it when it unmounts. The input never references an element that does not
 *   exist. The radio card and the checkbox card share the hook.
 */

import { type Dispatch, type SetStateAction, useId } from "react";

import { useSafeLayoutEffect } from "@stealthscale/hooks";

/**
 * Describes the function a part reports its ID through: the setter of the card's list of IDs.
 */
export type Describe = Dispatch<SetStateAction<readonly string[]>>;

/**
 * Reports the calling part to its card while the part is mounted, and returns the part's ID.
 *
 * @param describe - The card's report function.
 * @param given - The ID the caller passes, or nothing for a generated one.
 * @returns The ID the card's input lists.
 */
export function useDescribed(describe: Describe, given: string | undefined): string {
  const generated = useId();
  const id = given ?? generated;

  useSafeLayoutEffect(() => {
    describe((ids) => [...ids, id]);

    return (): void => {
      describe((ids) => ids.filter((each) => each !== id));
    };
  }, [describe, id]);

  return id;
}
