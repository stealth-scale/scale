/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The group and the control are named by `SignaturePad.Label` only while a label is mounted,
 *   because an ID reference to an element that does not exist is invalid. The machine's api reports
 *   neither the invalid nor the read-only state the root resolved from its props, the field and the
 *   fieldset, so the root provides them with the names the control reads.
 */

import { createLabelling, createRequiredContext } from "@stealthscale/hooks";

/**
 * Provides the setter the label reports its mounting through, and the hook the label calls.
 *
 * @remarks
 *   `useLabelled` throws for a label rendered outside a root.
 */
export const [LabellingProvider, useLabelled] = createLabelling("SignaturePad");

/**
 * Describes the state the root shares with the parts.
 */
export interface Shared {
  /**
   * `aria-labelledby` and `aria-describedby` of the control, where each is settled.
   */
  readonly described: Readonly<Record<string, string>>;

  /**
   * Ink the caller states in `drawing.fill`, or nothing where the recipe's palette inks the
   * strokes.
   */
  readonly ink: string | undefined;

  /**
   * Whether the signature is invalid.
   */
  readonly invalid: boolean;

  /**
   * Whether the strokes are read-only, so no part offers to draw or clear.
   */
  readonly readOnly: boolean;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("SignaturePad");
