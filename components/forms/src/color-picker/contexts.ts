/**
 * Provides the context a part gives the parts inside it.
 *
 * @remarks
 *   An area passes its channels to its background and thumb, and a slider passes its channel and
 *   format to its track, thumb, label and value text. A swatch trigger passes its color to the
 *   swatch and the indicator. The control tells a text input inside it that the input is the
 *   picker's field.
 */

import { createContext, useContext } from "react";

import { type Color, type ColorChannel, type ColorFormat } from "@zag-js/color-utils";

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the channels an area sets on its two axes.
 */
export interface AreaChannels {
  /**
   * Channel the horizontal axis sets, or the format's second channel.
   */
  readonly xChannel?: ColorChannel | undefined;

  /**
   * Channel the vertical axis sets, or the format's third channel.
   */
  readonly yChannel?: ColorChannel | undefined;
}

/**
 * Provides an area's channels to its background and thumb, and reads them back.
 *
 * @remarks
 *   `useAreaChannels` throws for a background or a thumb rendered outside `ColorPicker.Area`.
 */
export const [AreaProvider, useAreaChannels] =
  createRequiredContext<AreaChannels>("ColorPicker.Area");

/**
 * Describes the channel a slider sets and the format it reads the channel in.
 */
export interface SliderChannel {
  /**
   * Channel the slider sets.
   */
  readonly channel: ColorChannel;

  /**
   * Format the slider reads the channel in, which has the channel.
   */
  readonly format: ColorFormat;
}

/**
 * Provides a slider's channel to its track, thumb, label and value text, and reads it back.
 *
 * @remarks
 *   `useSliderChannel` throws for a part rendered outside `ColorPicker.ChannelSlider`.
 */
export const [SliderProvider, useSliderChannel] = createRequiredContext<SliderChannel>(
  "ColorPicker.ChannelSlider",
);

/**
 * Provides the value of a swatch trigger to the swatch and the indicator inside it.
 */
export const SwatchValue = createContext<Color | string | undefined>(undefined);

/**
 * Returns the color a swatch or an indicator shows: its own `value`, else its trigger's.
 *
 * @param value - The color the part states, or nothing.
 * @returns The color.
 * @throws {@link Error} When the part states no color and no swatch trigger is around it.
 */
export function useSwatchValue(value?: Color | string): Color | string {
  const around = useContext(SwatchValue);
  const color = value ?? around;

  if (color === undefined) {
    throw new Error("A ColorPicker swatch needs a value or a ColorPicker.SwatchTrigger around it.");
  }

  return color;
}

/**
 * Provides true inside `ColorPicker.Control`, where a hex or CSS input is the picker's field and
 * the label names it.
 */
export const InControl = createContext(false);
