/**
 * Renders the browser's `select`, wired to the field around it.
 *
 * @remarks
 *   Inside a `Field` the select takes the field's control ID, which the label points at, the IDs
 *   of the helper and the error text in `aria-describedby`, `aria-invalid` while the field is
 *   invalid, and the disabled and required states. A prop the caller states overrides each. Alone,
 *   name it with `aria-label` or a `label` that points at it. `placeholder` renders a first option
 *   with an empty value, which a required select does not accept.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";
import { withContext } from "#native-select/context.ts";

/**
 * Renders the field `select`.
 */
const Selected = withContext("select", "field");

/**
 * Describes the props of `Field`: the placeholder and the `select` props.
 */
export interface FieldProps extends ComponentProps<typeof Selected> {
  /**
   * Words of a first option with an empty value, shown before anything is chosen.
   */
  readonly placeholder?: ReactNode;
}

/**
 * Renders the select with the field's wiring and the placeholder option.
 *
 * @param props - The placeholder, the options and the `select` element's props.
 * @returns The `select` element.
 */
export function Field({ children, placeholder, ...rest }: FieldProps): ReactElement {
  const field = useOptionalField();
  const wired =
    field === undefined
      ? {}
      : {
          "aria-describedby": describedBy(field.ids),
          disabled: field.disabled,
          id: field.ids.control,
          required: field.required,
          ...omitUndefined({ "aria-invalid": field.invalid ? (true as const) : undefined }),
        };

  return (
    <Selected {...wired} {...rest}>
      {placeholder === undefined ? null : <option value="">{placeholder}</option>}
      {children}
    </Selected>
  );
}
