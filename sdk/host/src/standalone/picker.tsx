/**
 * Renders one picker of the development panel: a native select with its label above it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Field, NativeSelect } from "@stealthscale/component-forms";

/**
 * Describes one choice of a panel picker.
 */
export interface Choice {
  /**
   * The words the choice shows.
   */
  readonly label: string;

  /**
   * The value the choice sets.
   */
  readonly value: string;
}

/**
 * Describes the props of a panel picker.
 */
export interface PickerProps {
  /**
   * The choices, in the order the picker lists them.
   */
  readonly choices: readonly Choice[];

  /**
   * The glyph at the select's end, such as a chevron. None where left out.
   */
  readonly indicator?: ReactNode;

  /**
   * The words above the select, which name it.
   */
  readonly label: string;

  /**
   * Receives the value a person picks.
   */
  readonly onValueChange: (value: string) => void;

  /**
   * The value the picker shows.
   */
  readonly value: string;
}

/**
 * Renders a small native select in a field its label names.
 *
 * @remarks
 *   The panel picks with a native select, because a listbox opened inside a floating panel stacks
 *   under the panel. The select states its size itself: the stylesheet compiler emits the rules of
 *   the sizes it reads in the source, and a size the select takes from the field at run time has
 *   none.
 * @param props - The choices, the value, the words, the glyph and the callback a pick calls.
 * @returns The field.
 */
export function Picker({
  choices,
  indicator,
  label,
  onValueChange,
  value,
}: PickerProps): ReactElement {
  return (
    <Field.Root size="sm">
      <Field.Label>{label}</Field.Label>
      <NativeSelect.Root size="sm">
        <NativeSelect.Field
          onChange={(event) => {
            onValueChange(event.currentTarget.value);
          }}
          value={value}
        >
          {choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </NativeSelect.Field>
        {indicator === undefined ? null : (
          <NativeSelect.Indicator>{indicator}</NativeSelect.Indicator>
        )}
      </NativeSelect.Root>
    </Field.Root>
  );
}
