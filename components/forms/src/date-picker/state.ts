/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The inputs, the trigger and the panel name themselves after `DatePicker.Label` only while a
 *   label is mounted, because an ID reference to an element that does not exist is invalid.
 *   Without the label part they name themselves after the label of a field around the picker.
 *   Without either, each input takes the caller's `aria-label`, and the trigger and the panel their
 *   own `label`.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

import { type Ids } from "#date-picker/machine.ts";
import { type Names } from "#naming.ts";

export { namesOf } from "#naming.ts";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("DatePicker");

/**
 * Describes the state the root shares with the parts: the names, the IDs, the states the inputs
 * report, and the function a form reset calls.
 */
export interface Shared extends Names {
  /**
   * IDs the parts name and find each other by.
   */
  readonly ids: Ids;

  /**
   * Whether the picker is read-only, which hides the clear trigger and keeps the hidden inputs out
   * of validation.
   */
  readonly readOnly: boolean;

  /**
   * Whether a form requires a date, which the inputs report as `aria-required`.
   */
  readonly required: boolean;

  /**
   * Restores the dates the machine started with.
   */
  readonly reset: () => void;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("DatePicker");
