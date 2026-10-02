/**
 * Renders a checkbox bound to a boolean field of a form, with its label beside the box.
 *
 * @remarks
 *   The box is the library's `Checkbox` inside a `Field`, so the input lists the field's texts in
 *   `aria-describedby` and takes its invalid and required states. A checkbox labels itself, so it
 *   renders its own label beside the box and the texts under it, with no frame. The checked box
 *   shows the field's glyph, else the form's, else its fill alone.
 */

import { type ReactElement, type ReactNode } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import { useFieldAria } from "@stealthscale/provider-form";

import * as Checkbox from "#checkbox/index.ts";
import * as Field from "#field/index.ts";
import { useBoundField } from "#form/bound.ts";
import { type FieldProps } from "#form/frame.tsx";
import { Mark } from "#form/mark.tsx";
import { useFormScope } from "#form/scope.ts";
import { Texts } from "#form/texts.tsx";

/**
 * Describes what a checkbox field is given.
 */
export interface CheckboxFieldProps extends FieldProps {
  /**
   * Glyph inside the checked box, in place of the form's.
   */
  readonly indicator?: ReactNode;
}

/**
 * Renders a checkbox bound to the boolean field in scope.
 *
 * @param props - The words of the label, whether a value is required, and the box's glyph.
 * @returns The field, with the checkbox and its texts inside it.
 */
export function CheckboxField({ indicator, label, required }: CheckboxFieldProps): ReactElement {
  const field = useBoundField<boolean | undefined>();
  const aria = useFieldAria({ label, required });
  const { glyphs, size } = useFormScope();
  const mark = indicator ?? glyphs.checkbox;

  return (
    <Field.Root
      id={aria.control.id}
      invalid={aria.error !== undefined}
      required={aria.control["aria-required"]}
      {...omitUndefined({ size })}
    >
      <Checkbox.Root
        checked={field.state.value === true}
        name={aria.control.name}
        onBlur={field.handleBlur}
        onCheckedChange={({ checked }) => {
          field.handleChange(checked === true);
        }}
      >
        <Checkbox.Control>
          {mark === undefined ? null : <Checkbox.Indicator>{mark}</Checkbox.Indicator>}
        </Checkbox.Control>
        <Checkbox.Label>
          {aria.label.text}
          <Mark toggle />
        </Checkbox.Label>
      </Checkbox.Root>
      <Texts description={aria.description} error={aria.error} />
    </Field.Root>
  );
}
