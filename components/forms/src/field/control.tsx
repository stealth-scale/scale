/**
 * Renders the field's control.
 *
 * @remarks
 *   The element is an `input` with the input recipe. `as` renders another element, such as a
 *   `select`, under both recipes. `Field.Textarea` renders the package's `Textarea` with its own
 *   props typed. The control takes its identifier, state, size and `maxLength` from the field, and
 *   a prop the caller states overrides each. `aria-invalid` carries the invalid state, which the
 *   field's styles and assistive technology both read. `aria-describedby` lists the helper text,
 *   the error text and the counter. The control keeps the field's tally at its value's length.
 */

import { type ChangeEvent, type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#field/context.ts";
import { useWired } from "#field/wired.ts";
import { Input } from "#input/input.ts";

/**
 * Renders the input with the field's control class.
 */
const Filled = withContext(Input, "control");

/**
 * Describes the props of the control: the input's variants and the props of an `input`.
 */
export type ControlProps = ComponentProps<typeof Filled>;

/**
 * Renders the control, wired to the field around it.
 *
 * @param props - The control's own props, which override the field's.
 * @returns The `input` element, named and described by the field's parts.
 */
export function Control({ defaultValue, onChange, value, ...props }: ControlProps): ReactElement {
  const wired = useWired(defaultValue, value);

  return (
    <Filled
      {...wired.props}
      {...omitUndefined({ defaultValue, value })}
      {...props}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        wired.typed(event.target.value.length);
        onChange?.(event);
      }}
    />
  );
}
