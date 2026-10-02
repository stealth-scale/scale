/**
 * Renders a switch bound to a boolean field of a form, with its label beside the track.
 *
 * @remarks
 *   The switch is the library's `Switch` inside a `Field`, so the input lists the field's texts in
 *   `aria-describedby` and takes its invalid and required states. A switch labels itself, so it
 *   renders its own label beside the track and the texts under it, with no frame. Its track and
 *   thumb need no glyph. A schema picks it for a boolean with `x-control: "switch"`.
 */

import { type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import { useFieldAria } from "@stealthscale/provider-form";

import * as Field from "#field/index.ts";
import { useBoundField } from "#form/bound.ts";
import { type FieldProps } from "#form/frame.tsx";
import { Mark } from "#form/mark.tsx";
import { useFormScope } from "#form/scope.ts";
import { Texts } from "#form/texts.tsx";
import * as Switch from "#switch/index.ts";

/**
 * Describes what a switch field is given.
 */
export type SwitchFieldProps = FieldProps;

/**
 * Renders a switch bound to the boolean field in scope.
 *
 * @param props - The words of the label and whether a value is required.
 * @returns The field, with the switch and its texts inside it.
 */
export function SwitchField({ label, required }: SwitchFieldProps): ReactElement {
  const field = useBoundField<boolean | undefined>();
  const aria = useFieldAria({ label, required });
  const { size } = useFormScope();

  return (
    <Field.Root
      id={aria.control.id}
      invalid={aria.error !== undefined}
      required={aria.control["aria-required"]}
      {...omitUndefined({ size })}
    >
      <Switch.Root
        checked={field.state.value === true}
        name={aria.control.name}
        onBlur={field.handleBlur}
        onCheckedChange={({ checked }) => {
          field.handleChange(checked);
        }}
      >
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>
          {aria.label.text}
          <Mark toggle />
        </Switch.Label>
      </Switch.Root>
      <Texts description={aria.description} error={aria.error} />
    </Field.Root>
  );
}
