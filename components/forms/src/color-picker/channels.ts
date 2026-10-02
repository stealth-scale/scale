/**
 * Returns what the parts name and read a color channel by: its English name, the format that has
 * it, and its value as text.
 *
 * @remarks
 *   A color in one format throws for a channel of another, so a slider or a thumb that reads the
 *   hue of an RGB color reads it from the color converted to HSB, as the machine's area does. An
 *   area in HSL reads hue and saturation in HSL.
 */

import { type Color, type ColorChannel, type ColorFormat } from "@zag-js/color-utils";

/**
 * English name of each channel, and of the hex and CSS inputs, which a part takes as its default
 * name.
 */
export const CHANNEL_NAMES = {
  alpha: "Alpha",
  blue: "Blue",
  brightness: "Brightness",
  css: "CSS color",
  green: "Green",
  hex: "Hex",
  hue: "Hue",
  lightness: "Lightness",
  red: "Red",
  saturation: "Saturation",
};

/**
 * Channel an input sets: a color channel, or the whole color as hex or CSS.
 */
export type InputChannel = "css" | "hex" | ColorChannel;

/**
 * Returns a color in hex, with eight digits while it is translucent, the text a part names a color
 * by.
 *
 * @param color - A color in any of the picker's formats.
 * @returns The hex of the color, such as `#3B82F6` or `#3B82F680`.
 */
export function hexOf(color: Color): string {
  return color.toString(color.getChannelValue("alpha") < 1 ? "hexa" : "hex");
}

/**
 * Returns the format that has a channel, given the format in force.
 *
 * @param channel - The channel to read.
 * @param current - The format in force.
 * @returns HSL for lightness, RGB for red, green and blue, HSB for brightness, the HSL or HSB of
 *   the format in force for hue and saturation, and the format in force for alpha.
 */
export function formatOf(channel: ColorChannel, current: ColorFormat): ColorFormat {
  if (channel === "lightness") return "hsla";
  if (channel === "brightness") return "hsba";
  if (channel === "red" || channel === "green" || channel === "blue") return "rgba";
  if (channel === "alpha") return current;

  return current === "hsla" ? "hsla" : "hsba";
}

/**
 * Returns a channel's value as text for assistive technology, such as `217°` or `91%`, at the
 * precision of the channel's step.
 *
 * @param color - A color in any of the picker's formats.
 * @param channel - The channel to read.
 * @param locale - The locale the number is formatted in.
 * @param format - The format the channel is read in, or nothing for the format that has the
 *   channel.
 * @returns The formatted value.
 */
export function channelText(
  color: Color,
  channel: ColorChannel,
  locale: string,
  format?: ColorFormat,
): string {
  const read = color.toFormat(format ?? formatOf(channel, color.getFormat()));
  const { step } = read.getChannelRange(channel);
  const stepped = Math.round(read.getChannelValue(channel) / step) * step;

  return read.withChannelValue(channel, stepped).formatChannelValue(channel, locale);
}
