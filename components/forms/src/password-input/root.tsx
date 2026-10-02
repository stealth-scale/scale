/**
 * Renders a password input's box and runs the machine its parts share.
 *
 * @remarks
 *   The element is the input group's box, so the password input takes the group's looks, sizes and
 *   states, and a press on the box's padding focuses the field. Inside a field the box takes the
 *   field's disabled, invalid, read-only and required states and size. Inside a fieldset without a
 *   field it takes the group's disabled state and size. A prop the caller states overrides each.
 *   The toggle takes the box's size.
 */

import { type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";
import { Root as Box, type RootProps as BoxProps } from "#input-group/root.tsx";
import { PropsProvider } from "#password-input/context.ts";
import {
  ApiProvider,
  type PasswordInputOptions,
  splitPasswordInputProps,
  usePasswordInputMachine,
} from "#password-input/machine.ts";

/**
 * Describes the props of the root: the machine's options, and the input group's variants and the
 * props of its box.
 *
 * @remarks
 *   The box's own props of the same names as the machine's options are left out, so no prop has
 *   two types.
 */
export interface RootProps
  extends Omit<BoxProps, keyof PasswordInputOptions>, PasswordInputOptions {}

/**
 * Renders the box and provides the machine's api and the box's size to the field and the toggle.
 *
 * @param props - The machine's options, the group's variants and the props of the box.
 * @returns The `div` element that contains the parts.
 */
export function Root(props: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const [options, rest] = splitPasswordInputProps(props);
  const { size, ...attributes } = rest;
  const sizing = omitUndefined({ size: sized(size, field, group) });
  const api = usePasswordInputMachine(
    { ...inherited(field, group), ...options },
    field?.ids.control,
  );

  return (
    <ApiProvider value={api}>
      <PropsProvider value={sizing}>
        <Box {...mergeProps(api.getRootProps(), attributes)} {...sizing} />
      </PropsProvider>
    </ApiProvider>
  );
}
