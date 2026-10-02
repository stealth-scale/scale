/**
 * Renders a multi-line text box of the page's own, composed in the binding's frame.
 */

import { type ReactElement } from "react";

import { Field } from "@stealthscale/component-forms";
import { Frame, useBoundField } from "@stealthscale/component-forms/form";
import { type RendererProps } from "@stealthscale/provider-form";

/**
 * Renders the library's textarea in a frame, bound to the string field in scope.
 *
 * @remarks
 *   The frame renders the label and the texts, and hands the control the field's path as its
 *   name. The library's textarea wires its label and texts through the field around it.
 */
export function Textarea({ required }: RendererProps): ReactElement {
  const field = useBoundField<string>();

  return (
    <Frame required={required}>
      {({ name }) => (
        <Field.Textarea
          name={name}
          onBlur={field.handleBlur}
          onChange={(event) => {
            field.handleChange(event.target.value);
          }}
          value={field.state.value}
        />
      )}
    </Frame>
  );
}
