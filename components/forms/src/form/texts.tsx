/**
 * Renders the texts under a field of a form: the help text and the error.
 *
 * @remarks
 *   The field around the texts gives each its id and lists both in the control's
 *   `aria-describedby`. The help text renders while the field is valid, and the error takes its
 *   place, with `role="alert"`, while the field shows one. The error opens on the form's error
 *   glyph, where the form gives one.
 */

import { type ReactElement } from "react";

import { type FieldAria } from "@stealthscale/provider-form";

import * as Field from "#field/index.ts";
import { useFormScope } from "#form/scope.ts";

/**
 * Describes what the texts are given: the help text and the error the foundation resolved.
 */
export type TextsProps = Pick<FieldAria, "description" | "error">;

/**
 * Renders the help text and the error of the field around them.
 *
 * @param props - The help text and the error, each with its words, or nothing.
 * @returns The texts the field shows.
 */
export function Texts({ description, error }: TextsProps): ReactElement {
  const { glyphs } = useFormScope();

  return (
    <>
      {description === undefined ? null : <Field.HelperText>{description.text}</Field.HelperText>}
      {error === undefined ? null : (
        <Field.ErrorText>
          {glyphs.error}
          {error.text}
        </Field.ErrorText>
      )}
    </>
  );
}
