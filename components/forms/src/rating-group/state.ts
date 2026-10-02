/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The group names itself after `RatingGroup.Label` only while a label is mounted, because an ID
 *   reference to an element that does not exist is invalid. Without the label part it takes the
 *   label of a field or the legend of a fieldset around it. The root passes the words each item is
 *   named by, and the function that ends a pointer's preview when a person turns to the keys.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("RatingGroup");

/**
 * Describes the state the root shares with the items.
 */
export interface Shared {
  /**
   * Returns the words an item is named by, given the value it stands for.
   */
  readonly itemLabel: (value: number) => string;

  /**
   * Ends the pointer's hover, so the machine takes the keys while the pointer rests on the group.
   */
  readonly release: () => void;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for an item rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("RatingGroup");
