/**
 * Provides the state the parts share beside the machine.
 *
 * @remarks
 *   The input is named by `Combobox.Label` or by the label of a field around the combobox, both of
 *   which point at it, else by the caller's `aria-label`. The panel names itself after the label
 *   only while one is mounted, because an ID reference to an element that does not exist is
 *   invalid, then after the field's label, and without either after the `aria-label` the input
 *   reports to the root.
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
export const [LabellingProvider, useLabelled] = createLabelling("Combobox");

/**
 * Provides the setter the input reports its `aria-label` through, and the hook the input calls.
 *
 * @remarks
 *   `useNamed` throws for an input rendered outside a root.
 */
export const [NamingProvider, useNamed] = createNaming("Combobox");

/**
 * Describes the state the root shares with the parts: the names, and the functions that keep the
 * input's text and the value in step.
 */
export interface Shared extends Names {
  /**
   * Whether a form submits the input's text, which it does while custom values are allowed.
   */
  readonly custom: boolean;

  /**
   * Clears the value of a single combobox once its text is empty.
   */
  readonly emptied: (text: string) => void;

  /**
   * Restores the value the machine started with.
   */
  readonly reset: () => void;

  /**
   * Restores the value's text over a text that matches no pick.
   */
  readonly settle: () => void;
}

/**
 * Provides the shared state, and reads it back.
 *
 * @remarks
 *   `useShared` throws for a part rendered outside a root.
 */
export const [SharedProvider, useShared] = createRequiredContext<Shared>("Combobox");
