/**
 * Types what a field component reads of the field it is bound to. The library's context leaves
 * those members untyped, so a component reads them through this shape.
 */

import { useFieldContext } from "@stealthscale/provider-form";

/**
 * Describes the state of a bound field that a component reads.
 *
 * @typeParam Value - Type of the field's value.
 */
export interface BoundFieldState<Value> {
  /**
   * The errors the field shows and whether a person has touched it.
   */
  readonly meta: {
    /**
     * The errors from every slot, in slot order.
     */
    readonly errors: readonly unknown[];

    /**
     * Whether a person has changed or left the field, or a submit was attempted.
     */
    readonly isTouched: boolean;
  };

  /**
   * The current value.
   */
  readonly value: Value;
}

/**
 * Describes the members of a bound field that a component reads and calls.
 *
 * @typeParam Value - Type of the field's value.
 */
export interface BoundField<Value> {
  /**
   * Marks the field left, which runs the blur validators.
   */
  readonly handleBlur: () => void;

  /**
   * Sets the value, which runs the change validators.
   */
  readonly handleChange: (value: Value) => void;

  /**
   * The path the field is bound to, which is its name in the form's values.
   */
  readonly name: string;

  /**
   * The current state.
   */
  readonly state: BoundFieldState<Value>;
}

/**
 * Reads the field a bound field component renders, typed over its value.
 *
 * @remarks
 *   The library's context returns a field whose members are untyped. This shape names the four
 *   members a component reads, and every field the library builds satisfies it.
 * @typeParam Value - Type of the field's value.
 */
export function useBoundField<Value>(): BoundField<Value> {
  return useFieldContext<Value>();
}
