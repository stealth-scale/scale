/**
 * Renders a long text field of a form: a textarea bound to a string field.
 *
 * @remarks
 *   The textarea is the library's `Field.Textarea`, which grows with its content from `rows` lines
 *   up to `maxRows`. Both come from the field's props, else from the options of the field's
 *   presentation. A schema picks it for a string with `x-control: "textarea"`. The textarea takes
 *   the column's full width unless the field or its presentation states a width. In a form whose
 *   labels float, the label rests on the textarea's first line while it is empty.
 */

import { type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import * as Field from "#field/index.ts";
import { useBoundField } from "#form/bound.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { textareaSettingsOf } from "#form/settings.ts";

/**
 * Describes what a long text field is given.
 */
export interface TextareaFieldProps extends FramedFieldProps {
  /**
   * Most lines the field grows to before it scrolls, in place of the presentation's options.
   */
  readonly maxRows?: number | undefined;

  /**
   * Least lines the field shows, in place of the presentation's options.
   */
  readonly rows?: number | undefined;
}

/**
 * Renders a growing textarea in a frame, bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, the line counts, the
 *   presentation and the width.
 * @returns The field, with the textarea inside it.
 */
export function TextareaField({
  label,
  maxRows,
  presentation,
  required,
  rows,
  width,
}: TextareaFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const settings = {
    ...textareaSettingsOf(presentation?.options),
    ...omitUndefined({ maxRows, rows }),
  };

  return (
    <Frame floats label={label} required={required} width={width ?? presentation?.width}>
      {({ autoComplete, name, placeholder }) => (
        <Field.Textarea
          {...settings}
          autoComplete={autoComplete}
          grows
          name={name}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value);
          }}
          placeholder={placeholder}
          value={field.state.value ?? ""}
        />
      )}
    </Frame>
  );
}
