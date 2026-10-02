/**
 * Renders a number in the currency the field's options name.
 */

import { type ReactElement } from "react";

import { NumberField } from "@stealthscale/component-forms/form";
import { type RendererProps } from "@stealthscale/provider-form";

/**
 * Renders the binding's number input formatted in the currency the field's options name, or as a
 * plain number where the option is not a string.
 *
 * @remarks
 *   Both formats state `style`, because the number input compares a new format by the keys it
 *   states, and an empty format would keep the currency of the one before it.
 */
export function Amount({ presentation, required }: RendererProps): ReactElement {
  const currency = presentation.options?.["currency"];

  return (
    <NumberField
      formatOptions={
        typeof currency === "string" ? { currency, style: "currency" } : { style: "decimal" }
      }
      presentation={presentation}
      required={required}
    />
  );
}
