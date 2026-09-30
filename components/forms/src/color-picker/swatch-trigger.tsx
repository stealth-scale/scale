/**
 * Renders a button that sets the color to a preset one.
 *
 * @remarks
 *   The button is a toggle that reports `aria-pressed` while its color is the picker's. It is
 *   named by `label`, the color in hex by default, and contains the swatch and the indicator. A
 *   press sets the color, and closes the panel when the root's `closeOnSelect` is true. The
 *   trigger is disabled in a disabled or read-only picker.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type Color } from "@zag-js/color-utils";
import { mergeProps } from "@zag-js/react";

import { hexOf } from "#color-picker/channels.ts";
import { withContext } from "#color-picker/context.ts";
import { SwatchValue } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `button` with the color picker's swatch trigger class.
 */
const Pressed = withContext("button", "swatchTrigger");

/**
 * Describes the props of the swatch trigger: its color, its name and the props of a `button`.
 */
export interface SwatchTriggerProps extends Omit<ComponentProps<typeof Pressed>, "value"> {
  /**
   * Name of the button. Defaults to the color in hex, such as `#3B82F6`.
   */
  readonly label?: string | undefined;

  /**
   * Color a press sets, as a `Color` or any CSS color string.
   */
  readonly value: Color | string;
}

/**
 * Renders the trigger with the machine's trigger props, its name and its pressed state, and
 * provides its color to the swatch and the indicator inside it.
 *
 * @param props - The color, the name, the swatch, the indicator and the props of a `button`.
 * @returns The `button` element.
 */
export function SwatchTrigger({
  disabled,
  label,
  value,
  ...props
}: SwatchTriggerProps): ReactElement {
  const api = useColorPicker();
  const swatch = { disabled, value };
  const { checked, value: color } = api.getSwatchTriggerState(swatch);
  const { "aria-label": _label, ...machine }: ComponentProps<typeof Pressed> = {
    ...api.getSwatchTriggerProps(swatch),
  };
  const own = { "aria-label": label ?? hexOf(color), "aria-pressed": checked };

  return (
    <SwatchValue value={value}>
      <Pressed {...mergeProps(machine, own, props)} />
    </SwatchValue>
  );
}
