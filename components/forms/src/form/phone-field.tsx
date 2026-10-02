/**
 * Renders a phone input bound to a string field of a form whose value is a phone number.
 *
 * @remarks
 *   The input is the library's `PhoneInput`: a country picker and a box that formats the number as
 *   it is typed. A schema picks it for a string with `format: "phone"`, and a presentation for any
 *   string with `control: "phone"`. The field's value is the number in E.164, such as
 *   `+31612345678`, once it reads as a number, and the typed text before that, which the binding's
 *   `phone` format refuses. The presentation's options state the country a number without a `+` is
 *   read in, `country`, and the countries the picker offers, `countries`. The picker's rows show
 *   the form's select glyphs, and its name reads `<id>.actions.countryCode`, else "Country code",
 *   which tells it apart from a country field in the same form. The field
 *   counts as left once focus leaves the picker and the box, and its blur validators run then.
 */

import { type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import { useWords } from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { isLeaving } from "#form/leaving.ts";
import { type SelectGlyphs, useFormScope } from "#form/scope.ts";
import { phoneSettingsOf } from "#form/settings.ts";
import * as PhoneInput from "#phone-input/index.ts";

/**
 * Describes what a phone field is given.
 */
export interface PhoneFieldProps extends FramedFieldProps {
  /**
   * Glyphs of the country picker, in place of the form's select glyphs.
   */
  readonly glyphs?: SelectGlyphs | undefined;
}

/**
 * Renders a phone input in a frame, bound to the string field in scope.
 *
 * @param props - The words of the label, whether a value is required, the picker's glyphs, the
 *   presentation and the width.
 * @returns The field, with the phone input inside it.
 */
export function PhoneField({
  glyphs,
  label,
  presentation,
  required,
  width,
}: PhoneFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const words = useWords();
  const scope = useFormScope();
  const marks = glyphs ?? scope.glyphs.select;

  return (
    <Frame label={label} required={required} width={width ?? presentation?.width ?? "medium"}>
      {({ autoComplete, name, placeholder }) => (
        <PhoneInput.Root
          {...phoneSettingsOf(presentation?.options)}
          name={name}
          onBlur={(event) => {
            if (isLeaving(event)) field.handleBlur();
          }}
          onValueChange={({ value }) => {
            field.handleChange(value);
          }}
          value={field.state.value ?? ""}
        >
          <PhoneInput.Country
            {...omitUndefined({ check: marks?.selected, indicator: marks?.indicator })}
            label={words.action("countryCode", "Country code")}
          />
          <PhoneInput.Input {...omitUndefined({ autoComplete, placeholder })} />
        </PhoneInput.Root>
      )}
    </Frame>
  );
}
