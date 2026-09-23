/**
 * Carries what a field knows about itself down to its parts.
 */

import { createRequiredContext } from "@stealthscale/hooks";

import { type Ids } from "#field/ids.ts";

/**
 * Describes what every part of a field reads.
 */
export interface FieldState {
  /**
   * Whether a person can reach the control at all.
   */
  disabled: boolean;

  /**
   * The identifiers the parts reference each other by.
   */
  ids: Ids;

  /**
   * Whether what the control holds is wrong.
   */
  invalid: boolean;

  /**
   * Whether the control shows a value a person cannot change.
   */
  readOnly: boolean;

  /**
   * Whether the field has to be filled in.
   */
  required: boolean;

  /**
   * The status the field reports, or nothing where it reports none.
   *
   * @remarks
   *   The message reads this as well as `invalid`, because a field can report something that is
   *   not a fault. Gated on `invalid` alone, the only way to show a reader a note in the success
   *   palette was to mark the control wrong, which draws the browser's own invalid ring in red
   *   over whatever the status had painted and tells a screen reader the entry is invalid.
   */
  status?: string | undefined;
}

/**
 * Hands the field's state to every part, and reads it back.
 *
 * @remarks
 *   A part reads the throwing hook, because a part outside its field is a mistake. A control that
 *   stands on its own and is also composable into a field reads the optional one, so it takes the
 *   field's state where there is one and works where there is not.
 */
export const [FieldProvider, useField, useOptionalField] =
  createRequiredContext<FieldState>("Field");
