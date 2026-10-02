/**
 * Renders a select bound to a string field of a form whose schema lists its choices.
 *
 * @remarks
 *   The select is the library's `Select` inside the frame, so its trigger is named by the frame's
 *   label and its hidden `select` takes the field's name, through which focus moves to the trigger,
 *   and the purpose the presentation states, through which a browser fills it. Each choice reads
 *   its words from the catalogue under `<id>.fields.<path>.options.<value>`, and its value where
 *   the catalogue has none. Nothing is chosen until a person chooses, and the trigger shows the
 *   placeholder the catalogue gives, else "Choose". The trigger and the chosen row show the field's
 *   glyphs, else the form's, else no mark. Closing the list counts as leaving the field, and its
 *   blur validators run then. Focus moving from the trigger into the list runs none.
 */

import { type ReactElement } from "react";

import { Portal } from "@stealthscale/component-primitives";
import { omitUndefined } from "@stealthscale/hooks";
import { choicesOf, useProperty, useWords } from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { type Choice, collectionOf } from "#form/choices.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { type SelectGlyphs, useFormScope } from "#form/scope.ts";
import * as Select from "#select/index.ts";

/**
 * Describes what a select field is given.
 */
export interface SelectFieldProps extends FramedFieldProps {
  /**
   * Glyphs of the trigger and the chosen row, in place of the form's.
   */
  readonly glyphs?: SelectGlyphs | undefined;

  /**
   * The choices. The schema's `enum` where the caller states none.
   */
  readonly options?: readonly string[] | undefined;
}

/**
 * Renders a select in a frame, bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, the glyphs, the choices, the
 *   presentation and the width.
 * @returns The field, with the select inside it.
 */
export function SelectField({
  glyphs,
  label,
  options,
  presentation,
  required,
  width,
}: SelectFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const { schema } = useProperty();
  const words = useWords();
  const scope = useFormScope();
  const marks = glyphs ?? scope.glyphs.select;
  const values = options ?? (schema === undefined ? [] : choicesOf(schema));
  const choices: Choice[] = values.map((value) => ({
    label: words.option(field.name, value),
    value,
  }));
  const value = field.state.value;

  return (
    <Frame label={label} required={required} width={width ?? presentation?.width}>
      {({ autoComplete, name, placeholder }) => (
        <Select.Root
          {...omitUndefined({ autoComplete })}
          collection={collectionOf(choices)}
          name={name}
          onOpenChange={({ open }) => {
            if (!open) field.handleBlur();
          }}
          onValueChange={({ value: [chosen] }) => {
            field.handleChange(chosen ?? "");
          }}
          value={value === undefined || value === "" ? [] : [value]}
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={placeholder ?? words.action("choose", "Choose")} />
            </Select.Trigger>
            {marks === undefined ? null : <Select.Indicator>{marks.indicator}</Select.Indicator>}
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {choices.map((choice) => (
                  <Select.Item item={choice} key={choice.value}>
                    <Select.ItemText item={choice}>{choice.label}</Select.ItemText>
                    {marks === undefined ? null : (
                      <Select.ItemIndicator item={choice}>{marks.selected}</Select.ItemIndicator>
                    )}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      )}
    </Frame>
  );
}
