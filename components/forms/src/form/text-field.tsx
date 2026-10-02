/**
 * Renders a text box bound to a string field of a form.
 *
 * @remarks
 *   The box is the library's `Field.Control`. A property with `format: "email"` renders an email
 *   box, `format: "password"` a password box, and `format: "url"`, or `"uri"` where an engine
 *   registers it, a URL box, so a form built from a schema states none of them. The box takes the
 *   column's full width unless the field or its presentation states a width. In a form whose labels
 *   float, the label rests inside the box while it is empty.
 */

import { type ReactElement } from "react";

import { useProperty } from "@stealthscale/provider-form";

import * as Field from "#field/index.ts";
import { useBoundField } from "#form/bound.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { kindOf, type TextKind } from "#form/kinds.ts";

/**
 * Describes what a text field is given.
 */
export interface TextFieldProps extends FramedFieldProps {
  /**
   * The kind of box. The kind the schema's `format` names, or a plain box, where the caller states
   * none.
   */
  readonly type?: TextKind | undefined;
}

/**
 * Renders a text box in a frame, bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, the kind of box, the
 *   presentation and the width.
 * @returns The field, with the box inside it.
 */
export function TextField({
  label,
  presentation,
  required,
  type,
  width,
}: TextFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const { schema } = useProperty();

  return (
    <Frame floats label={label} required={required} width={width ?? presentation?.width}>
      {({ autoComplete, name, placeholder }) => (
        <Field.Control
          autoComplete={autoComplete}
          name={name}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value);
          }}
          placeholder={placeholder}
          type={type ?? kindOf(schema?.["format"])}
          value={field.state.value ?? ""}
        />
      )}
    </Frame>
  );
}
