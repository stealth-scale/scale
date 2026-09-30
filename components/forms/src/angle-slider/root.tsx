/**
 * Renders an angle slider's group and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `fieldset` with no edge of its own, which stacks the label over the dial and
 *   groups the thumb under the dial's name. The group and the thumb are named by
 *   `AngleSlider.Label` while one is rendered, and otherwise by the label of a field or the legend
 *   of a fieldset around the dial. The root renders the hidden input a form submits after its
 *   children, and a disabled dial disables the `fieldset` and with it that input. The machine
 *   writes the value and the angle onto the root as custom properties, which the range and the
 *   thumb read. The root formats the value with `formatOptions` in `locale`, in degrees unless the
 *   caller states other options. Inside a field the thumb is described by the field's texts, and
 *   the dial takes the field's disabled, invalid and read-only states and size. Inside a fieldset
 *   without a field it takes the group's disabled state and size. A prop the caller states
 *   overrides each.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withProvider } from "#angle-slider/context.ts";
import {
  type AngleSliderOptions,
  ApiProvider,
  splitAngleSliderProps,
  useAngleSliderMachine,
} from "#angle-slider/machine.ts";
import { LabellingProvider, SharedProvider } from "#angle-slider/state.ts";
import { describedBy } from "#field/ids.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset, useOptionalFieldset } from "#fieldset/state.ts";

/**
 * Renders the root `fieldset` with the recipe's variants.
 */
const Grouped = withProvider("fieldset", "root");

/**
 * Formats a value in degrees with the narrow sign, such as 45°.
 */
const DEGREES: Intl.NumberFormatOptions = { style: "unit", unit: "degree", unitDisplay: "narrow" };

/**
 * Describes how the root formats the value it shows and announces.
 */
export interface Formatting {
  /**
   * Options of `Intl.NumberFormat` for the value text and the thumb's `aria-valuetext`. Defaults to
   * degrees with the narrow sign.
   */
  readonly formatOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Locale the value is formatted in. Defaults to the browser's.
   */
  readonly locale?: string | undefined;
}

/**
 * Describes the props of the root: the machine's options, the formatting, the recipe's variants
 * and the props of a `fieldset`.
 *
 * @remarks
 *   The element's own props of the same names as the machine's options are left out, so no prop
 *   has two types. `aria-label` and `aria-labelledby` are left out as well, because the label
 *   names the group and the thumb takes its own words as `label`.
 */
export interface RootProps
  extends
    AngleSliderOptions,
    Formatting,
    Omit<
      ComponentProps<typeof Grouped>,
      "aria-label" | "aria-labelledby" | keyof AngleSliderOptions | keyof Formatting
    > {}

/**
 * Renders the group and provides the machine's api and the shared state to the parts.
 *
 * @param props - The machine's options, the formatting, the recipe's variants and the props of a
 *   `fieldset`.
 * @returns The `fieldset` element that contains the parts and the hidden input.
 */
export function Root({
  children,
  formatOptions = DEGREES,
  locale,
  ...props
}: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const legend = useOptionalFieldset()?.ids.label;
  const [labelled, setLabelled] = useState(false);
  const [options, rest] = splitAngleSliderProps(props);
  const { size, ...attributes } = rest;
  const { required: _required, ...states } = inherited(field, group);
  const stated = { ...states, ...options };
  const { api, labelId, send, thumbId } = useAngleSliderMachine(stated);
  const formatter = new Intl.NumberFormat(locale, formatOptions);

  /**
   * Returns a value in the root's format.
   */
  const format = (value: number): string => formatter.format(value);
  const shared = {
    described: field ? describedBy(field.ids) : undefined,
    dir: stated.dir ?? "ltr",
    disabled: stated.disabled === true,
    format,
    interactive: stated.disabled !== true && stated.readOnly !== true,
    label: labelled ? labelId : (field?.ids.label ?? legend),
    send,
    step: stated.step ?? 1,
    thumbId,
  };

  return (
    <ApiProvider value={api}>
      <LabellingProvider value={setLabelled}>
        <SharedProvider value={shared}>
          <Grouped
            {...mergeProps(
              api.getRootProps(),
              omitUndefined({ "aria-labelledby": shared.label }),
              attributes,
            )}
            disabled={shared.disabled}
            {...omitUndefined({ size: sized(size, field, group) })}
          >
            {children}
            <input {...api.getHiddenInputProps()} />
          </Grouped>
        </SharedProvider>
      </LabellingProvider>
    </ApiProvider>
  );
}
