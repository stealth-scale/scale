/**
 * Renders the thumb of the area.
 *
 * @remarks
 *   The thumb is a `slider` whose value is the horizontal channel. It is named by `label`,
 *   "Saturation and brightness" by default, and its value text names both channels, such as
 *   "Saturation 76%, brightness 96%", formatted in the root's locale. `valueText` replaces the
 *   value text. The arrow keys step the channels, and Page Up and Page Down step the horizontal
 *   one by ten.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type Color, type ColorChannel } from "@zag-js/color-utils";
import { mergeProps } from "@zag-js/react";

import { CHANNEL_NAMES, channelText } from "#color-picker/channels.ts";
import { withContext } from "#color-picker/context.ts";
import { useAreaChannels } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";
import { FILL } from "#color-picker/metrics.ts";
import { painted } from "#color-picker/painted.ts";
import { useShared } from "#color-picker/state.ts";

/**
 * Renders the `div` with the color picker's area thumb class.
 */
const Thumbed = withContext("div", "areaThumb");

/**
 * Describes the props of the area thumb: its name, its value text and the props of a `div`.
 */
export interface AreaThumbProps extends ComponentProps<typeof Thumbed> {
  /**
   * Name of the thumb. Defaults to the English names of the two channels, such as "Saturation
   * and brightness".
   */
  readonly label?: string | undefined;

  /**
   * Text a screen reader announces as the thumb's value. Defaults to the English names and the
   * values of both channels.
   */
  readonly valueText?: string | undefined;
}

/**
 * Returns a channel's English name and its value, such as "Saturation 76%".
 *
 * @param color - The area's color, in HSB or HSL.
 * @param channel - The channel to read.
 * @param locale - The locale the number is formatted in.
 * @returns The name and the formatted value.
 */
function spoken(color: Color, channel: ColorChannel, locale: string): string {
  return `${CHANNEL_NAMES[channel]} ${channelText(color, channel, locale, color.getFormat())}`;
}

/**
 * Renders the thumb with the machine's thumb props, named by `label` and read by `valueText`.
 *
 * @param props - The name, the value text and the props of a `div`.
 * @returns The `div` element with `role="slider"`.
 */
export function AreaThumb({ label, valueText, ...props }: AreaThumbProps): ReactElement {
  const api = useColorPicker();
  const { locale } = useShared();
  const channels = useAreaChannels();
  const area = api.value.toFormat(api.format === "hsla" ? "hsla" : "hsba");
  const [, x, y] = area.getChannels();
  const xChannel = channels.xChannel ?? x;
  const yChannel = channels.yChannel ?? y;
  const {
    "aria-label": _label,
    "aria-roledescription": _role,
    "aria-valuetext": _text,
    style,
    ...machine
  }: ComponentProps<typeof Thumbed> = { ...api.getAreaThumbProps(channels) };
  const own = {
    "aria-label":
      label ?? `${CHANNEL_NAMES[xChannel]} and ${CHANNEL_NAMES[yChannel].toLowerCase()}`,
    "aria-valuetext":
      valueText ??
      `${spoken(area, xChannel, locale)}, ${spoken(area, yChannel, locale).toLowerCase()}`,
    style: painted(style, "background", FILL),
  };

  return <Thumbed {...mergeProps(machine, own, props)} />;
}
