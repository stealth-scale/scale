/**
 * Renders the form element of a form, which submits it, resets it and lays out its fields.
 *
 * @remarks
 *   The element's `id` is the form's identifier, so a refused submit moves focus to a control
 *   inside this form and not to the first control on the page with the field's name. The browser's
 *   own validation is off, so a person reads the schema's messages. A reset event resets the
 *   library's values to the form's defaults, so every field returns to its default together. The
 *   element is a column of the fields, and the size, the glyphs, the mark and the orientation reach
 *   every field of the form. Render the fields, `form.Fields` included, inside it: the layouts read
 *   its recipe.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import { useFormContext } from "@stealthscale/provider-form";

import { withProvider } from "#form/context.ts";
import {
  type FormGlyphs,
  type FormMark,
  type FormOrientation,
  FormScopeProvider,
  type HeadingLevel,
} from "#form/scope.ts";

/**
 * Renders the `form` element with the recipe's variants.
 */
const Framed = withProvider("form", "root");

/**
 * Glyphs of a form that states none.
 */
const NONE: FormGlyphs = {};

/**
 * Describes what a form element is given: the glyphs, the mark, the recipe's variants and the
 * props of a `form`.
 *
 * @remarks
 *   `id`, `noValidate`, `onReset` and `onSubmit` are left out, because the form sets each.
 */
export interface FormProps extends Omit<
  ComponentProps<typeof Framed>,
  "id" | "noValidate" | "onReset" | "onSubmit"
> {
  /**
   * Glyphs the fields render where they need a mark: a checked box, a select's chevron and check, a
   * number's steppers, a closed group's chevron and an error's mark. A field renders no mark where
   * the form gives none.
   */
  readonly glyphs?: FormGlyphs | undefined;

  /**
   * Level a wizard's step heading renders at: one below the heading above the form. Defaults to 2.
   */
  readonly headingLevel?: HeadingLevel | undefined;

  /**
   * Fields the form marks beside their labels. `required` marks each required field with an
   * asterisk, the default. `optional` marks each optional field with words and the required ones
   * with nothing, which suits a form where most fields are required. A checkbox and a switch take
   * no optional mark, because leaving one unchecked is a choice.
   */
  readonly mark?: FormMark | undefined;

  /**
   * Where the form puts the labels against the controls. `vertical` puts every label above its
   * control, the default. `floating` rests the label of an empty text box or textarea inside it
   * until the box takes focus or a value, and keeps the label of every other control above it.
   */
  readonly orientation?: FormOrientation | undefined;
}

/**
 * Renders a form element whose submit runs the library's `handleSubmit` and whose reset runs its
 * `reset`.
 *
 * @param props - The glyphs, the heading level, the mark, the orientation, the recipe's variants,
 *   the fields and the props of a `form`.
 * @returns The `form` element, with the glyphs, the heading level, the mark, the orientation and the
 *   size in scope.
 */
export function Form({
  glyphs = NONE,
  headingLevel = 2,
  mark = "required",
  orientation = "vertical",
  size,
  ...rest
}: FormProps): ReactElement {
  const form = useFormContext();

  return (
    <FormScopeProvider value={{ glyphs, headingLevel, mark, orientation, size }}>
      <Framed
        {...rest}
        {...omitUndefined({ size })}
        id={form.formId}
        noValidate
        onReset={(event) => {
          event.preventDefault();
          form.reset();
        }}
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      />
    </FormScopeProvider>
  );
}
