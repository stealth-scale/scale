/**
 * Wires a field's control to the field around it.
 *
 * @remarks
 *   `Field.Control` and `Field.Textarea` share it. The hook returns the props the control takes
 *   from the field: identifier, `aria-describedby`, `aria-invalid`, disabled, read-only, required,
 *   `maxLength` and size. It also writes the length of the control's value, in UTF-16 code units,
 *   to the field's tally after layout: from `value` when the caller controls it, otherwise from
 *   `defaultValue` and each change the control reports through `typed`.
 */

import { useState } from "react";

import { omitUndefined, useSafeLayoutEffect } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { useField } from "#field/state.ts";

/**
 * Describes a value a control can hold.
 */
type Held = number | readonly string[] | string | undefined;

/**
 * Describes the props a control takes from the field.
 */
export interface WiredProps {
  /**
   * Identifiers of the helper text, the error text and the counter.
   */
  readonly "aria-describedby": string;

  /**
   * Set while the field is invalid.
   */
  readonly "aria-invalid"?: true;

  /**
   * Whether the field is disabled.
   */
  readonly disabled: boolean;

  /**
   * Identifier the label points at.
   */
  readonly id: string;

  /**
   * Limit the field sets, in UTF-16 code units.
   */
  readonly maxLength?: number;

  /**
   * Whether the field is read-only.
   */
  readonly readOnly: boolean;

  /**
   * Whether the field requires a value.
   */
  readonly required: boolean;

  /**
   * Size the field states.
   */
  readonly size?: "lg" | "md" | "sm";
}

/**
 * Describes what the hook returns: the control's props from the field, and the function that
 * records the length after a change.
 */
export interface Wired {
  /**
   * Props the control takes from the field. Props the caller states override them.
   */
  readonly props: WiredProps;

  /**
   * Records the length of an uncontrolled value after a change.
   */
  readonly typed: (length: number) => void;
}

/**
 * Returns the length of a value in UTF-16 code units, or 0 where there is none.
 */
export function lengthOf(value?: Held): number {
  return value === undefined ? 0 : String(value).length;
}

/**
 * Returns the field's props for a control and keeps the field's tally at the value's length.
 *
 * @param defaultValue - The control's initial value when the caller does not control it.
 * @param value - The control's value when the caller controls it.
 * @returns The props and the change recorder.
 */
export function useWired(defaultValue?: Held, value?: Held): Wired {
  const { disabled, ids, invalid, maxLength, readOnly, required, size, tally } = useField();
  const [typed, setTyped] = useState(() => lengthOf(defaultValue));
  const length = value === undefined ? typed : lengthOf(value);

  useSafeLayoutEffect(() => {
    tally.set(length);
  }, [length, tally]);

  return {
    props: {
      "aria-describedby": `${describedBy(ids)} ${ids.counter}`,
      disabled,
      id: ids.control,
      readOnly,
      required,
      ...omitUndefined({ "aria-invalid": invalid ? (true as const) : undefined, maxLength, size }),
    },
    typed: setTyped,
  };
}
