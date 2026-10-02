/**
 * Renders a slider bound to a number field of a form.
 *
 * @remarks
 *   The slider is the library's `Slider`, a track with one thumb between the schema's `minimum`
 *   and `maximum`, else 0 and 100, named by the field's label. A presentation picks it for a
 *   number with `control: "slider"`. It steps and formats the value as the field's props state,
 *   else as the options of the field's presentation state, and shows the formatted value above the
 *   track. The thumb shows a value outside the bounds at the nearer bound, while the form keeps the
 *   value it has. The engine starts a number without a `default` at 0, so a slider whose minimum is
 *   above 0 states a `default` within its bounds, and a field written by hand without a value
 *   rests the thumb at the minimum. The field counts as left once focus leaves the thumb, and its
 *   blur validators run then.
 */

import { type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";
import { useProperty } from "@stealthscale/provider-form";

import { useBoundField } from "#form/bound.ts";
import { type FramedFieldProps } from "#form/frame.tsx";
import { GroupFrame } from "#form/group-frame.tsx";
import { boundOf, numberSettingsOf } from "#form/settings.ts";
import * as Slider from "#slider/index.ts";

/**
 * Describes what a slider field is given.
 */
export interface SliderFieldProps extends Omit<FramedFieldProps, "width"> {
  /**
   * How the slider formats the value, in place of the presentation's options.
   */
  readonly formatOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * How far an arrow key moves the value, in place of the presentation's options.
   */
  readonly step?: number | undefined;
}

/**
 * Renders a slider bound to the number field in scope.
 *
 * @param props - The words of the label, whether a value is required, the format, the step and
 *   the presentation.
 * @returns The field, with the slider and its texts inside it.
 */
export function SliderField({
  formatOptions,
  label,
  presentation,
  required,
  step,
}: SliderFieldProps): ReactElement {
  const field = useBoundField<number | undefined>();
  const { schema } = useProperty();
  const settings = {
    ...numberSettingsOf(presentation?.options),
    ...omitUndefined({ formatOptions, step }),
  };
  const min = boundOf(schema, "minimum") ?? 0;

  return (
    <GroupFrame label={label} required={required}>
      {({ name }) => (
        <Slider.Root
          {...settings}
          max={boundOf(schema, "maximum") ?? 100}
          min={min}
          name={name}
          onBlur={() => {
            field.handleBlur();
          }}
          onValueChange={({ value: [next] }) => {
            field.handleChange(next);
          }}
          value={[field.state.value ?? min]}
        >
          <Slider.ValueText />
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb />
          </Slider.Control>
        </Slider.Root>
      )}
    </GroupFrame>
  );
}
