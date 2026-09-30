/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The trigger and the panel name themselves after `Select.Label` only while a label is mounted,
 *   because an ID reference to an element that does not exist is invalid. Without the label part
 *   they name themselves after the label of a field around the select. Without either the trigger
 *   takes the caller's `aria-label` and reports it to the root, and the panel takes the same name.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

import { createNaming, type Names } from "#naming.ts";

export { namesOf } from "#naming.ts";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("Select");

/**
 * Provides the setter the trigger reports its `aria-label` through, and the hook the trigger calls.
 *
 * @remarks
 *   `useNamed` throws for a trigger rendered outside a root.
 */
export const [NamingProvider, useNamed] = createNaming("Select");

/**
 * Describes the state the root shares with the parts: the names, and what closes the panel.
 */
export interface Shared extends Names {
  /**
   * Closes the panel and leaves focus where it is.
   */
  readonly dismiss: () => void;

  /**
   * ID of the trigger, which the panel moves focus to on Tab.
   */
  readonly trigger: string;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("Select");
