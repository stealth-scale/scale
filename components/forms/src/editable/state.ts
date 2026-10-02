/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The preview names itself after `Editable.Label` only while a label is mounted, because an ID
 *   reference to an element that does not exist is invalid. Without the label part it names
 *   itself after the label of a field around the editable. The machine's api does not report
 *   read-only, so the root provides the flag it passes to the machine.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("Editable");

/**
 * Describes the state the root shares with the parts.
 */
export interface Shared {
  /**
   * ID of the rendered label that names the editable, or nothing without one.
   */
  readonly label: string | undefined;

  /**
   * ID of the preview, whose own text completes its name.
   */
  readonly preview: string;

  /**
   * Whether the value is read-only, so no part offers to edit it.
   */
  readonly readOnly: boolean;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("Editable");
