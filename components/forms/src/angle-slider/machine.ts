/**
 * Runs the angle slider machine and provides its api to the parts.
 *
 * @remarks
 *   The root starts one machine and every part reads the api from context, so the thumb, the
 *   range, the markers and the value text report one value. A press on the dial moves the thumb to
 *   the pressed angle and a drag turns it with the pointer. The machine takes the thumb's key
 *   events through `send`, because the thumb maps the keys itself.
 */

import { useId } from "react";

import * as angleSlider from "@zag-js/angle-slider";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

import { type KeyEvent } from "#angle-slider/keys.ts";

/**
 * Describes the api `angleSlider.connect` returns: a prop getter per part, and the value and the
 * method that changes it.
 */
export type AngleSliderApi = ReturnType<typeof angleSlider.connect>;

/**
 * Describes the machine options the root takes, every one optional.
 *
 * @remarks
 *   `aria-label` and `aria-labelledby` are left out, because the label names the thumb and the
 *   thumb takes its own words as `label`.
 */
export type AngleSliderOptions = Omit<Partial<angleSlider.Props>, Omitted>;

/**
 * Lists the machine's options the root leaves out.
 */
type Omitted = "aria-label" | "aria-labelledby";

/**
 * Describes what `onValueChange` and `onValueChangeEnd` receive: the angle as a number and as a
 * CSS angle.
 */
export type ValueChangeDetails = angleSlider.ValueChangeDetails;

/**
 * Provides the connected api to the parts, and reads it back.
 *
 * @remarks
 *   `useAngleSlider` throws for a part rendered outside `AngleSlider.Root`.
 */
export const [ApiProvider, useAngleSlider] = createRequiredContext<AngleSliderApi>("AngleSlider");

/**
 * Describes what the root needs from the machine: the api, the IDs the parts name each other by,
 * and the function the thumb sends its key events through.
 */
export interface AngleSliderMachine {
  /**
   * Connected api of the machine.
   */
  readonly api: AngleSliderApi;

  /**
   * ID the machine gives `AngleSlider.Label`.
   */
  readonly labelId: string;

  /**
   * Sends the machine the event for a key pressed on the thumb.
   */
  readonly send: (event: KeyEvent) => void;

  /**
   * ID the machine gives the thumb.
   */
  readonly thumbId: string;
}

/**
 * Starts the angle slider machine and returns its connected api, the IDs of the label and the
 * thumb, and its `send`.
 *
 * @param options - The machine options split from the root's props. React generates `id` when the
 *   caller states none.
 * @returns The connected api, the IDs and `send`.
 */
export function useAngleSliderMachine(options: AngleSliderOptions): AngleSliderMachine {
  const generated = useId();
  const id = options.id ?? generated;
  const labelId = options.ids?.label ?? `angle-slider:${id}:label`;
  const thumbId = options.ids?.thumb ?? `angle-slider:${id}:thumb`;
  const service = useMachine(angleSlider.machine, {
    ...omitUndefined(options),
    id,
    ids: { ...options.ids, label: labelId, thumb: thumbId },
  });

  /**
   * Sends the machine the event for a key pressed on the thumb.
   */
  function send(event: KeyEvent): void {
    service.send(event);
  }

  return { api: angleSlider.connect(service, normalizeProps), labelId, send, thumbId };
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
export function splitAngleSliderProps<Props extends AngleSliderOptions>(
  props: Props,
): [AngleSliderOptions, Omit<Props, keyof angleSlider.Props>] {
  const [options, rest] = splitEnumerable(angleSlider.splitProps<Props>)(props);
  const { "aria-label": _label, "aria-labelledby": _labelledBy, ...kept } = options;

  return [kept, rest];
}
