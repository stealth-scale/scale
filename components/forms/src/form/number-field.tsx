/**
 * Renders a number input bound to a number field of a form.
 *
 * @remarks
 *   The input is the library's `NumberInput`, bounded by the schema's `minimum` and `maximum`. It
 *   formats and steps the value as the field's props state, else as the options of the field's
 *   presentation state (`style`, `currency`, `unit`, the fraction digits and `step`). It renders
 *   steppers where the field or the form gives their glyphs, and none otherwise: the arrow keys
 *   step the value either way. An emptied input has no value, so `required` refuses it and an
 *   optional number is left out of the values. The input keeps the text a person types, such as
 *   `1.` or `-`, while the number it reads is the field's value, and shows the field's value again
 *   when the form sets another, such as on a reset. The input is short unless the field or its
 *   presentation states a width, so its steppers are close to each other.
 */

import { type ReactElement, useState } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import { useProperty, useWords } from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { type NumberGlyphs, useFormScope } from "#form/scope.ts";
import { boundOf, numberSettingsOf } from "#form/settings.ts";
import * as NumberInput from "#number-input/index.ts";

/**
 * Describes what a number field is given.
 */
export interface NumberFieldProps extends FramedFieldProps {
  /**
   * How the input formats the number, in place of the presentation's options.
   */
  readonly formatOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Glyphs of the steppers, in place of the form's.
   */
  readonly glyphs?: NumberGlyphs | undefined;

  /**
   * How far an arrow key or a stepper moves the value, in place of the presentation's options.
   */
  readonly step?: number | undefined;
}

/**
 * Describes the text a person typed, with the number the input read from it.
 */
interface Typed {
  /**
   * The number the input read, or nothing for text that is no number.
   */
  readonly number: number | undefined;

  /**
   * The text as typed.
   */
  readonly text: string;
}

/**
 * Writes a field's value as the input's text: the number, or nothing.
 */
function textOf(value: number | undefined): string {
  return value === undefined ? "" : String(value);
}

/**
 * Renders a number input in a frame, bound to the number field in scope.
 *
 * @param props - The words of the label, whether a value is required, the format, the step, the
 *   steppers' glyphs, the presentation and the width.
 * @returns The field, with the input inside it.
 */
export function NumberField({
  formatOptions,
  glyphs,
  label,
  presentation,
  required,
  step,
  width,
}: NumberFieldProps): ReactElement {
  const field = useBoundField<number | undefined>();
  const { schema } = useProperty();
  const scope = useFormScope();
  const words = useWords();
  const value = field.state.value;
  const [typed, setTyped] = useState<Typed>({ number: value, text: textOf(value) });
  const steppers = glyphs ?? scope.glyphs.number;
  const settings = {
    ...numberSettingsOf(presentation?.options),
    ...omitUndefined({ formatOptions, step }),
  };
  const bounds = omitUndefined({
    max: boundOf(schema, "maximum"),
    min: boundOf(schema, "minimum"),
  });

  return (
    <Frame label={label} required={required} width={width ?? presentation?.width ?? "short"}>
      {({ autoComplete, name, placeholder }) => (
        <NumberInput.Root
          {...bounds}
          {...settings}
          name={name}
          onValueChange={({ value: text, valueAsNumber }) => {
            const number = Number.isNaN(valueAsNumber) ? undefined : valueAsNumber;

            setTyped({ number, text });
            field.handleChange(number);
          }}
          value={Object.is(typed.number, value) ? typed.text : textOf(value)}
        >
          {steppers === undefined ? null : (
            <NumberInput.DecrementTrigger label={words.action("decrement", "Decrease")}>
              {steppers.decrement}
            </NumberInput.DecrementTrigger>
          )}
          <NumberInput.Input
            {...omitUndefined({ autoComplete, placeholder })}
            onBlur={field.handleBlur}
          />
          {steppers === undefined ? null : (
            <NumberInput.IncrementTrigger label={words.action("increment", "Increase")}>
              {steppers.increment}
            </NumberInput.IncrementTrigger>
          )}
        </NumberInput.Root>
      )}
    </Frame>
  );
}
