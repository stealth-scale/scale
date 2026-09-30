/**
 * Renders the native select's box, which positions the indicator over the field's end.
 *
 * @remarks
 *   The root takes the variants. Inside a `Field` or a `Fieldset` it takes their size unless it
 *   states its own.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";
import { withProvider } from "#native-select/context.ts";

/**
 * Renders the root `div` and provides the variants to the field and the indicator.
 */
const Boxed = withProvider("div", "root");

/**
 * Describes the props of `Root`: the variants and the `div` props.
 */
export type RootProps = ComponentProps<typeof Boxed>;

/**
 * Renders the box at its own size, the field's or the fieldset's.
 *
 * @param props - The variants and the `div` element's props.
 * @returns The `div` element.
 */
export function Root({ size, ...rest }: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();

  return <Boxed {...rest} {...omitUndefined({ size: sized(size, field, group) })} />;
}
