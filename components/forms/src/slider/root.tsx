/**
 * Renders a slider's group and runs the machine its parts share.
 *
 * @remarks
 *   The element is a `fieldset` with no edge of its own, which lays the label and the value text on
 *   one row above the control and groups the thumbs under the slider's name. The group and every
 *   thumb are named by `Slider.Label` while one is rendered, and otherwise by the label of a field
 *   or the legend of a fieldset around the slider. A disabled slider disables the `fieldset`, and
 *   with it the hidden inputs. The machine writes the positions it computes onto the root as custom
 *   properties, which the thumbs, the range and the markers read. The root formats every value with
 *   `formatOptions` in `locale`. Inside a field the thumbs are described by the field's texts, and
 *   the slider takes the field's disabled, invalid and read-only states and size. Inside a fieldset
 *   without a field it takes the group's disabled state and size. A prop the caller states
 *   overrides each.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { describedBy } from "#field/ids.ts";
import { inherited, sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset, useOptionalFieldset } from "#fieldset/state.ts";
import { withProvider } from "#slider/context.ts";
import {
  ApiProvider,
  type SliderOptions,
  splitSliderProps,
  useSliderMachine,
} from "#slider/machine.ts";
import { LabellingProvider, SharedProvider } from "#slider/state.ts";

/**
 * Renders the root `fieldset` with the recipe's variants.
 */
const Grouped = withProvider("fieldset", "root");

/**
 * Describes how the root formats the values it shows and announces.
 */
export interface Formatting {
  /**
   * Options of `Intl.NumberFormat` for the value text, each thumb's `aria-valuetext` and the
   * dragging indicator. Without them the value text shows the number and the thumbs set no
   * `aria-valuetext`.
   */
  readonly formatOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Locale the values are formatted in. Defaults to the browser's.
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
 *   names the group and each thumb takes its own words as `label`.
 */
export interface RootProps
  extends
    Formatting,
    Omit<
      ComponentProps<typeof Grouped>,
      "aria-label" | "aria-labelledby" | keyof Formatting | keyof SliderOptions
    >,
    SliderOptions {}

/**
 * Renders the group and provides the machine's api and the shared state to the parts.
 *
 * @param props - The machine's options, the formatting, the recipe's variants and the props of a
 *   `fieldset`.
 * @returns The `fieldset` element that contains the parts.
 */
export function Root({ formatOptions, locale, ...props }: RootProps): ReactElement {
  const field = useOptionalField();
  const group = useFieldset();
  const legend = useOptionalFieldset()?.ids.label;
  const [labelled, setLabelled] = useState(false);
  const [options, rest] = splitSliderProps(props);
  const { size, ...attributes } = rest;
  const { required: _required, ...states } = inherited(field, group);
  const stated = { ...states, ...options };
  const { api, labelId, thumbId } = useSliderMachine(stated);
  const formatter = new Intl.NumberFormat(locale, formatOptions);

  /**
   * Returns a value in the root's format.
   */
  const format = (value: number): string => formatter.format(value);
  const shared = {
    described: field ? describedBy(field.ids) : undefined,
    format,
    formatted: formatOptions !== undefined,
    label: labelled ? labelId : (field?.ids.label ?? legend),
    readOnly: stated.readOnly === true,
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
            disabled={stated.disabled === true}
            {...omitUndefined({ size: sized(size, field, group) })}
          />
        </SharedProvider>
      </LabellingProvider>
    </ApiProvider>
  );
}
