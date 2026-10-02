/**
 * Provides the state the parts share beside the machine: which item a part belongs to, and
 * whether the group's label is rendered.
 *
 * @remarks
 *   The machine points the root's `aria-labelledby` at the label whether or not one is rendered. A
 *   reference to an element that does not exist is an invalid ID reference, so the label reports
 *   itself while it is mounted and the root uses the machine's reference only then. The radio card
 *   shares both contexts.
 */

import { createRequiredContext, useSafeLayoutEffect } from "@stealthscale/hooks";

import { type ItemOptions } from "#radio-group/machine.ts";

/**
 * Provides an item's options to the parts inside it, and reads them back.
 *
 * @remarks
 *   `useItem` throws for a part rendered outside an item.
 */
export const [ItemProvider, useItem] = createRequiredContext<ItemOptions>("RadioGroup.Item");

/**
 * Provides the function the label reports its mounting through, and reads it back.
 *
 * @remarks
 *   `useLabelling` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelling] =
  createRequiredContext<(labelled: boolean) => void>("RadioGroup");

/**
 * Reports a label to the root while the calling part is mounted.
 */
export function useLabelled(): void {
  const setLabelled = useLabelling();

  useSafeLayoutEffect(() => {
    setLabelled(true);

    return (): void => {
      setLabelled(false);
    };
  }, [setLabelled]);
}
