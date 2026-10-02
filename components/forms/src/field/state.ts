/**
 * Provides a field's state to its parts.
 */

import { createRequiredContext } from "@stealthscale/hooks";

import { type Ids } from "#field/ids.ts";
import { type Tally } from "#field/tally.ts";

/**
 * Describes the state every part of a field reads.
 */
export interface FieldState {
  /**
   * Whether the control is disabled.
   */
  disabled: boolean;

  /**
   * Identifiers the parts reference each other by.
   */
  ids: Ids;

  /**
   * Whether the control's value is invalid.
   */
  invalid: boolean;

  /**
   * Most UTF-16 code units the control accepts, or nothing where the field sets no limit.
   */
  maxLength?: number | undefined;

  /**
   * Whether the control is read-only.
   */
  readOnly: boolean;

  /**
   * Whether the control requires a value.
   */
  required: boolean;

  /**
   * Size of the field, which the control takes unless it states its own.
   */
  size?: "lg" | "md" | "sm" | undefined;

  /**
   * Status the field reports, or nothing where it reports none.
   *
   * @remarks
   *   The error text renders for a status as well as for `invalid`, so a field reports a note that
   *   is not a fault without marking the control invalid.
   */
  status?: string | undefined;

  /**
   * Store of the value's length, which the control writes and the counter reads.
   */
  tally: Tally;
}

/**
 * Provides the field's state and reads it back.
 *
 * @remarks
 *   A part reads the throwing hook, because a part outside a field is a mistake. A control that
 *   also renders alone reads the optional hook.
 */
export const [FieldProvider, useField, useOptionalField] =
  createRequiredContext<FieldState>("Field");
