/**
 * Returns the state and size a checkbox or a switch takes from the field or the fieldset around it.
 */

import { type FieldState } from "#field/state.ts";
import { type FieldsetState } from "#fieldset/state.ts";

/**
 * Describes the machine options a toggle takes from a field or a fieldset.
 */
export interface Inherited {
  /**
   * Whether the toggle is disabled.
   */
  disabled?: boolean | undefined;

  /**
   * Whether the toggle's value is invalid.
   */
  invalid?: boolean | undefined;

  /**
   * Whether the toggle is read-only.
   */
  readOnly?: boolean | undefined;

  /**
   * Whether the toggle requires a value.
   */
  required?: boolean | undefined;
}

/**
 * Returns the machine options a toggle takes from the field or the fieldset around it.
 *
 * @remarks
 *   A field's state applies over the group's. Outside a field the toggle takes only the group's
 *   disabled state, and passes it to the machine so the toggle is disabled on its first render.
 * @param field - The field around the toggle, or nothing outside a field.
 * @param group - The fieldset around the toggle, or the loose state outside a group.
 * @returns The options, each undefined where neither states it.
 */
export function inherited(field: FieldState | undefined, group: FieldsetState): Inherited {
  return {
    disabled: field?.disabled ?? (group.disabled || undefined),
    invalid: field?.invalid,
    readOnly: field?.readOnly,
    required: field?.required,
  };
}

/**
 * Returns the size a toggle renders at: its own, then the field's, then the fieldset's.
 *
 * @param size - The size the toggle states, or nothing.
 * @param field - The field around the toggle, or nothing outside a field.
 * @param group - The fieldset around the toggle, or the loose state outside a group.
 * @returns The first size stated, or nothing where none is.
 */
export function sized<Size>(
  size: Size | undefined,
  field: FieldState | undefined,
  group: FieldsetState,
): FieldsetState["size"] | Size {
  return size ?? field?.size ?? group.size;
}
