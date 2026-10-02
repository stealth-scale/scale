/**
 * Renders what every control of a form shares: the label, the help text, the error, and the field
 * that ties them to the control.
 *
 * @remarks
 *   The foundation resolves the words and whether an error shows. An error shows once a person has
 *   touched the field or a submit was attempted. The library's `Field` ties the label and the texts
 *   to the control. The frame hands the control the same wiring, with the field's path as its name.
 *   The foundation moves focus to a refused field by that name. The label ends in the mark the form
 *   asks for. A width caps the control alone, so the label and the texts keep the column. In a form
 *   whose labels float, a frame around a text box renders the field's floating orientation and
 *   hands the box a placeholder of one space where the catalogue has none, because the field rests
 *   the label inside the box while its placeholder shows.
 */

import { type ReactElement, type ReactNode } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import {
  type FieldWidth,
  type Field as Presentation,
  useFieldAria,
} from "@stealthscale/provider-form";

import { describedBy, idsOf } from "#field/ids.ts";
import * as Field from "#field/index.ts";
import { Mark } from "#form/mark.tsx";
import { WIDTH } from "#form/recipe.ts";
import { useFormScope } from "#form/scope.ts";
import { Texts } from "#form/texts.tsx";

/**
 * Describes what every field component is given.
 */
export interface FieldProps {
  /**
   * The words of the label, where the catalogue has none and the schema's title is wrong.
   */
  readonly label?: string | undefined;

  /**
   * Whether a value is required. Read off the schema where the caller states nothing.
   */
  readonly required?: boolean | undefined;
}

/**
 * Describes what a field component in a frame is given: the label, whether a value is required,
 * the presentation and the width of its control.
 */
export interface FramedFieldProps extends FieldProps {
  /**
   * How the field is rendered, which a form built from a schema hands its renderers.
   */
  readonly presentation?: Presentation | undefined;

  /**
   * How wide the control is, in place of the presentation's `width`.
   */
  readonly width?: FieldWidth | undefined;
}

/**
 * Describes what a control takes from its frame: the field's wiring, its name, the purpose a
 * browser fills it for, and its placeholder.
 *
 * @remarks
 *   An application's own control spreads every member. The package's controls take the name, the
 *   purpose and the placeholder alone, because the library's field parts wire the rest themselves.
 */
export interface FramedControlProps {
  /**
   * Identifiers of the help text and the error text. An identifier whose text is not rendered adds
   * no description.
   */
  readonly "aria-describedby": string;

  /**
   * Set while the field shows an error.
   */
  readonly "aria-invalid"?: true;

  /**
   * Purpose the presentation states under `autocomplete`, which a browser reads to fill the field.
   */
  readonly autoComplete?: string;

  /**
   * Identifier the label points at.
   */
  readonly id: string;

  /**
   * Path of the field, by which the foundation moves focus to a refused field.
   */
  readonly name: string;

  /**
   * Placeholder from the catalogue, where it has one. A text box a floating label rests inside
   * takes one space where the catalogue has none.
   */
  readonly placeholder?: string;

  /**
   * Whether a value is required.
   */
  readonly required: boolean;
}

/**
 * Describes what a frame is given.
 */
export interface FrameProps extends FieldProps {
  /**
   * Renders the control, given what it takes from the frame.
   */
  readonly children: (control: FramedControlProps) => ReactNode;

  /**
   * Whether the control is a text box a floating label rests inside while it is empty. A frame
   * keeps the label above every other control.
   */
  readonly floats?: boolean | undefined;

  /**
   * How wide the control is. The column's full width where this is absent.
   */
  readonly width?: FieldWidth | undefined;
}

/**
 * Renders the frame around one control: the label above it, or floating inside a text box, and the
 * texts under it.
 *
 * @param props - The words of the label, whether a value is required, whether the control is a text
 *   box, the width and the control.
 * @returns The field, with the control inside it.
 */
export function Frame({
  children,
  floats = false,
  label,
  required,
  width,
}: FrameProps): ReactElement {
  const aria = useFieldAria({ label, required });
  const { orientation, size } = useFormScope();
  const floating = floats && orientation === "floating";
  const { autoComplete, id, name } = aria.control;
  const placeholder = aria.control.placeholder ?? (floating ? " " : undefined);
  const invalid = aria.error !== undefined;
  const control: FramedControlProps = {
    "aria-describedby": describedBy(idsOf(id)),
    ...(invalid ? { "aria-invalid": true } : {}),
    ...omitUndefined({ autoComplete, placeholder }),
    id,
    name,
    required: aria.control["aria-required"],
  };

  return (
    <Field.Root
      id={id}
      invalid={invalid}
      required={control.required}
      {...omitUndefined({ size })}
      {...(floating ? { orientation: "floating" } : {})}
      {...(width === undefined ? {} : { [WIDTH]: width })}
    >
      <Field.Label>
        {aria.label.text}
        <Mark />
      </Field.Label>
      {children(control)}
      <Texts description={aria.description} error={aria.error} />
    </Field.Root>
  );
}
