/**
 * Runs the slider machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the thumbs, the
 *   range, the markers and the value text report one value. A press on the track moves the
 *   nearest thumb there, a drag moves it with the pointer, and the arrow keys, PageUp, PageDown,
 *   Home and End move the focused thumb.
 */

import { useId } from "react";

import { normalizeProps, useMachine } from "@zag-js/react";
import * as slider from "@zag-js/slider";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

/**
 * Describes the api `slider.connect` returns: a prop getter per part, and the value and the
 * methods that change it.
 */
export type SliderApi = ReturnType<typeof slider.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `thumbAlignment` and `thumbSize` are left out. The thumbs are centred on their value and the
 *   recipe insets the control by half a thumb, so the machine does not measure the thumbs.
 *   `aria-label` and `aria-labelledby` are left out too, because each thumb takes its words as
 *   `label`.
 */
export type SliderOptions = Omit<Partial<slider.Props>, Omitted>;

/**
 * Lists the machine's options the root leaves out.
 */
type Omitted = "aria-label" | "aria-labelledby" | "thumbAlignment" | "thumbSize";

/**
 * Describes what `onValueChange` and `onValueChangeEnd` receive: the value of every thumb.
 */
export type ValueChangeDetails = slider.ValueChangeDetails;

/**
 * Describes what `onFocusChange` receives: the focused thumb's position and the value.
 */
export type FocusChangeDetails = slider.FocusChangeDetails;

/**
 * Describes what `getAriaValueText` receives: one thumb's value and position.
 */
export type ValueTextDetails = slider.ValueTextDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useSlider` throws for a part rendered outside `Slider.Root`.
 */
export const [ApiProvider, useSlider] = createRequiredContext<SliderApi>("Slider");

/**
 * Describes what the root needs from the machine: the api and the IDs the parts name each other
 * by.
 */
export interface SliderMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: SliderApi;

  /**
   * ID the machine gives `Slider.Label`.
   */
  readonly labelId: string;

  /**
   * Returns the ID the machine gives the thumb at a position.
   */
  readonly thumbId: (index: number) => string;
}

/**
 * Starts the slider machine and returns its connected api and the IDs of the label and the
 * thumbs.
 *
 * @remarks
 *   The thumbs are centred on their value, so no thumb is hidden while the machine measures it,
 *   and a server render shows them in place.
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The connected api and the IDs.
 */
export function useSliderMachine(options: SliderOptions): SliderMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `slider:${id}:label`;
  const own = options.ids?.thumb;

  /**
   * Returns the ID of the thumb at a position: the caller's, or the machine's default.
   */
  function thumbId(index: number): string {
    return own?.(index) ?? `slider:${id}:thumb:${index}`;
  }

  const service = useMachine(slider.machine, {
    ...omitUndefined(options),
    id,
    ids: { ...options.ids, label: labelId, thumb: thumbId },
    thumbAlignment: "center",
  });

  return { api: slider.connect(service, normalizeProps), labelId, thumbId };
}

/**
 * Splits the root's props into the machine's options and the element's props, without the options
 * the root leaves out.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed machine.
 * @typeParam Props - Type of the root's props.
 * @param props - The root's props.
 * @returns The machine options and the element props.
 */
export function splitSliderProps<Props extends SliderOptions>(
  props: Props,
): [SliderOptions, Omit<Props, keyof slider.Props>] {
  const [options, rest] = splitEnumerable(slider.splitProps<Props>)(props);
  const {
    "aria-label": _label,
    "aria-labelledby": _labelledBy,
    thumbAlignment: _alignment,
    thumbSize: _size,
    ...kept
  } = options;

  return [kept, rest];
}
