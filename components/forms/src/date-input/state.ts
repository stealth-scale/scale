/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   A group of segments is named by `DateInput.Label` only while a label is mounted, because an ID
 *   reference to an element that does not exist is invalid. Without the label part it is named by
 *   the label of a field around the input, and without either by the caller's `aria-label`.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

import { type Ids } from "#date-input/machine.ts";
import { type Names } from "#naming.ts";

export { namesOf } from "#naming.ts";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("DateInput");

/**
 * Describes the state the root shares with the parts: the names, the IDs, the locale and whether
 * the input is invalid.
 */
export interface Shared extends Names {
  /**
   * IDs the parts name and find each other by.
   */
  readonly ids: Ids;

  /**
   * Whether the input is invalid, which puts the field's texts on every segment.
   */
  readonly invalid: boolean;

  /**
   * Locale the segments take their names in.
   */
  readonly locale: string;

  /**
   * Whether the input is read-only, which hides the clear trigger.
   */
  readonly readOnly: boolean;

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
export const [SharedProvider, useShared] = createRequiredContext<Shared>("DateInput");
