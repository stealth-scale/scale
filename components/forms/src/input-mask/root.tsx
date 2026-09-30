/**
 * Renders an input mask's box and stores the value its input shows.
 *
 * @remarks
 *   The element is the input group's box, so the input mask takes the group's looks, sizes and
 *   states, and a mark or an addon beside the input, such as a currency sign. The root masks the
 *   value it stores with the current mask, so a value passed unmasked, or a mask that changes,
 *   shows in the mask's form. Inside a field the input takes the field's disabled, invalid,
 *   read-only and required states and the box its size. Inside a fieldset without a field it takes
 *   the group's disabled state and size. A prop the caller states overrides each.
 */

import { type ReactElement } from "react";

import { omitUndefined, useControllableState } from "@stealthscale/hooks";

import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";
import { Root as Box, type RootProps as BoxProps } from "#input-group/root.tsx";
import {
  detailsOf,
  maskerOf,
  type MaskingOptions,
  type ValueChangeDetails,
} from "#input-mask/mask.ts";
import { MaskingProvider } from "#input-mask/state.ts";

/**
 * Describes the props of the root: the mask, the value and the states, and the input group's
 * variants and the props of its box.
 *
 * @remarks
 *   The box's own props of the same names as the mask options are left out, so no prop has two
 *   types.
 */
export interface RootProps
  extends MaskingOptions, Omit<BoxProps, "defaultValue" | keyof MaskingOptions> {
  /**
   * Initial value when the caller does not control the value. A number mask reads it in the
   * mask's locale, such as `1.250,00` in `nl-NL`.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Whether the input is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Whether the value is invalid. The input sets `aria-invalid`, which the box's edge reads.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Name the input submits its value under, as the input shows it.
   */
  readonly name?: string | undefined;

  /**
   * Called with the value, the characters the tokens accepted and whether the value fills the
   * pattern, on every change.
   */
  readonly onValueChange?: ((details: ValueChangeDetails) => void) | undefined;

  /**
   * Called with the same details when a change fills the pattern.
   */
  readonly onValueComplete?: ((details: ValueChangeDetails) => void) | undefined;

  /**
   * Whether the input is read-only.
   */
  readonly readOnly?: boolean | undefined;

  /**
   * Whether the input requires a value.
   */
  readonly required?: boolean | undefined;

  /**
   * Controlled value. A number mask reads it in the mask's locale.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the box and provides the value, the mask and the states to the input.
 *
 * @param props - The mask, the value, the states, the group's variants and the props of the box.
 * @returns The `div` element that contains the input.
 */
export function Root(props: RootProps): ReactElement {
  const {
    defaultValue = "",
    disabled,
    eager,
    invalid,
    mask,
    name,
    number,
    onValueChange,
    onValueComplete,
    readOnly,
    required,
    size,
    tokens,
    value,
    ...attributes
  } = props;
  const field = useOptionalField();
  const group = useFieldset();
  const masker = maskerOf({ eager, mask, number, tokens });
  const [held, setHeld] = useControllableState<string>({ defaultValue, value });
  const shown = masker.engine.masked(held);
  const states = inherited(field, group);

  return (
    <MaskingProvider
      value={{
        ...states,
        ...omitUndefined({ disabled, invalid, readOnly, required }),
        masker,
        name,
        set: (next) => {
          if (next === shown) return;

          const details = detailsOf(masker, next);

          setHeld(next);
          onValueChange?.(details);

          if (details.complete && !masker.complete(shown)) onValueComplete?.(details);
        },
        value: shown,
      }}
    >
      <Box {...attributes} {...omitUndefined({ size: sized(size, field, group) })} />
    </MaskingProvider>
  );
}
