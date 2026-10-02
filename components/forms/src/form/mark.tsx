/**
 * Renders the mark beside a field's label that the form asks for.
 *
 * @remarks
 *   A form that marks required fields renders the field's required indicator, which shows on a
 *   required field alone. A form that marks optional fields renders the field's optional indicator
 *   with the words `<id>.marks.optional`, then `marks.optional`, then "(optional)", which shows on
 *   an optional field alone. A checkbox or a switch takes no optional mark, because leaving one
 *   unchecked is a choice and not a gap.
 */

import { type ReactElement } from "react";

import { useWords } from "@stealthscale/provider-form";

import * as Field from "#field/index.ts";
import { useFormScope } from "#form/scope.ts";

/**
 * Describes what a mark is given.
 */
export interface MarkProps {
  /**
   * Whether the field is a checkbox or a switch, which takes no optional mark.
   */
  readonly toggle?: boolean | undefined;
}

/**
 * Renders the required or the optional indicator of the field in scope, as the form asks.
 *
 * @param props - Whether the field is a toggle.
 * @returns The indicator, or nothing for a toggle in a form that marks optional fields.
 */
export function Mark({ toggle = false }: MarkProps): null | ReactElement {
  const { mark } = useFormScope();
  const words = useWords();

  if (mark === "required") return <Field.RequiredIndicator />;

  if (toggle) return null;

  return <Field.OptionalIndicator>{words.mark("optional", "(optional)")}</Field.OptionalIndicator>;
}
