/**
 * Renders a phone input's box and provides the number and the country to its parts.
 *
 * @remarks
 *   The element is the input group's box, so the phone input takes the group's looks, sizes and
 *   states. With `name`, a hidden input after the box submits the value: the E.164 form once the
 *   number is valid, else the text. Inside a field the input takes the field's disabled, invalid,
 *   read-only and required states and the box its size. Inside a fieldset without a field it takes
 *   the group's disabled state and size. A prop the caller states overrides each.
 */

import { type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";
import { Root as Box, type RootProps as BoxProps } from "#input-group/root.tsx";
import { type PhoneOptions, usePhone } from "#phone-input/phone.ts";
import { PhoningProvider, PickingProvider } from "#phone-input/state.ts";

/**
 * Describes the props of the root: the number's options, the states, and the input group's
 * variants and the props of its box.
 */
export interface RootProps
  extends Omit<BoxProps, "defaultValue" | keyof PhoneOptions>, PhoneOptions {
  /**
   * Whether the input is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Whether the number is invalid. The input sets `aria-invalid`, which the box's edge reads.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Name a hidden input submits the value under.
   */
  readonly name?: string | undefined;

  /**
   * Whether the input is read-only.
   */
  readonly readOnly?: boolean | undefined;

  /**
   * Whether the input requires a number.
   */
  readonly required?: boolean | undefined;
}

/**
 * Renders the box and provides the number, the country and the states to the parts.
 *
 * @param props - The number's options, the states, the group's variants and the props of the box.
 * @returns The box, and the hidden input after it while the root has a `name`.
 */
export function Root(props: RootProps): ReactElement {
  const {
    countries,
    country,
    defaultCountry,
    defaultValue,
    disabled,
    invalid,
    locale,
    name,
    nameOf,
    onCountryChange,
    onValueChange,
    readOnly,
    required,
    size,
    value,
    ...attributes
  } = props;
  const field = useOptionalField();
  const group = useFieldset();
  const boxed = sized(size, field, group);
  const {
    setPicking,
    value: submitted,
    ...phone
  } = usePhone({
    countries,
    country,
    defaultCountry,
    defaultValue,
    locale,
    nameOf,
    onCountryChange,
    onValueChange,
    value,
  });

  return (
    <PickingProvider value={setPicking}>
      <PhoningProvider
        value={{
          ...inherited(field, group),
          ...omitUndefined({ disabled, invalid, readOnly, required }),
          ...phone,
          size: boxed,
        }}
      >
        <Box {...attributes} {...omitUndefined({ size: boxed })} />
        {name === undefined ? null : <input name={name} type="hidden" value={submitted} />}
      </PhoningProvider>
    </PickingProvider>
  );
}
