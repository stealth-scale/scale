/**
 * Renders a masked text box bound to a string field of a form, which writes the pattern's own
 * characters between the ones a person types.
 *
 * @remarks
 *   The box is the library's `InputMask`. A presentation picks it with `control: "mask"` and the
 *   pattern under `options.mask`, in the mask's tokens: `9` a digit, `a` a letter, `A` a letter
 *   written in capitals and `*` a letter or a digit. A schema picks it for a string with
 *   `format: "iban"`, which groups an IBAN in fours and writes its letters in capitals. The field's
 *   value is the characters the pattern accepted, without the pattern's own, so the box shows
 *   `NL91 ABNA 0417 1643 00` and the form receives `NL91ABNA0417164300`. The field counts as left
 *   once focus leaves the box. In a form whose labels float, the label rests inside the empty box.
 */

import { type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import { useProperty } from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { maskOf } from "#form/settings.ts";
import * as InputMask from "#input-mask/index.ts";

/**
 * Pattern of an IBAN: the country's two letters, two check digits, and up to thirty letters or
 * digits, in groups of four.
 */
const IBAN = "AA99 XXXX XXXX XXXX XXXX XXXX XXXX XX";

/**
 * Tokens an IBAN's pattern reads beside the library's: `X`, a letter or a digit written in
 * capitals.
 */
const IBAN_TOKENS: InputMask.MaskTokens = {
  X: { pattern: /[\dA-Za-z]/u, transform: (character: string): string => character.toUpperCase() },
};

/**
 * Describes what a masked field is given.
 */
export interface MaskedFieldProps extends FramedFieldProps {
  /**
   * Pattern of the value, in place of the presentation's `options.mask`.
   */
  readonly mask?: string | undefined;
}

/**
 * Renders a masked box in a frame, bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, the pattern, the
 *   presentation and the width.
 * @returns The field, with the masked box inside it.
 */
export function MaskedField({
  label,
  mask,
  presentation,
  required,
  width,
}: MaskedFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const { schema } = useProperty();
  const iban = schema?.["format"] === "iban";

  return (
    <Frame floats label={label} required={required} width={width ?? presentation?.width}>
      {({ autoComplete, name, placeholder }) => (
        <InputMask.Root
          {...omitUndefined({
            mask: mask ?? maskOf(presentation?.options) ?? (iban ? IBAN : undefined),
            tokens: iban ? IBAN_TOKENS : undefined,
          })}
          name={name}
          onValueChange={({ unmasked }) => {
            field.handleChange(unmasked);
          }}
          value={field.state.value ?? ""}
        >
          <InputMask.Input
            {...omitUndefined({ autoComplete, placeholder })}
            onBlur={field.handleBlur}
          />
        </InputMask.Root>
      )}
    </Frame>
  );
}
