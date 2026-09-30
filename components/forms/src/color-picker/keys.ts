/**
 * Returns the color a key moves a slider's channel to.
 *
 * @remarks
 *   The arrow keys step the channel by its step, and by ten steps with Shift. Page Up and Page
 *   Down step it by ten steps, and Home and End set its ends. Under a right-to-left layout
 *   ArrowRight steps down and ArrowLeft steps up, because the track runs from the end.
 */

import { type Color, type ColorChannel } from "@zag-js/color-utils";

/**
 * Describes a key a person pressed on a thumb.
 */
export interface Pressed {
  /**
   * Name of the key, as `KeyboardEvent.key` reports it.
   */
  readonly key: string;

  /**
   * Whether Shift was held.
   */
  readonly shiftKey: boolean;
}

/**
 * Returns the color a key moves a channel to.
 *
 * @param pressed - The key and whether Shift was held.
 * @param color - The color, in a format that has the channel.
 * @param channel - The channel the thumb sets.
 * @param rtl - Whether the layout runs right to left.
 * @returns The moved color, or nothing for a key the thumb ignores.
 */
export function keyed(
  pressed: Pressed,
  color: Color,
  channel: ColorChannel,
  rtl: boolean,
): Color | undefined {
  const { maxValue, minValue, step } = color.getChannelRange(channel);
  const large = step * 10;
  const small = pressed.shiftKey ? large : step;
  const forward = rtl ? -small : small;
  const deltas: Readonly<Record<string, number>> = {
    ArrowDown: -small,
    ArrowLeft: -forward,
    ArrowRight: forward,
    ArrowUp: small,
    PageDown: -large,
    PageUp: large,
  };

  if (pressed.key === "Home") return color.withChannelValue(channel, minValue);
  if (pressed.key === "End") return color.withChannelValue(channel, maxValue);

  const delta = deltas[pressed.key];

  return delta === undefined ? undefined : color.incrementChannel(channel, delta);
}
