/**
 * Renders a slider that sets one channel of the color.
 *
 * @remarks
 *   The slider lays out its label and its value text in a row above its track. It reads the
 *   channel in the format passed as `format`, else in the format that has the channel: HSB or, in
 *   an HSL picker, HSL for hue and saturation, HSL for lightness, RGB for red, green and blue, and
 *   the format in force for alpha. A press on the track moves the thumb there. A press on the label
 *   or the value text moves nothing.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type ColorChannel, type ColorFormat } from "@zag-js/color-utils";
import { mergeProps } from "@zag-js/react";

import { formatOf } from "#color-picker/channels.ts";
import { withContext } from "#color-picker/context.ts";
import { SliderProvider } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `div` with the color picker's channel slider class.
 */
const Sliding = withContext("div", "channelSlider");

/**
 * Describes the props of the channel slider: the channel, its format and the props of a `div`.
 */
export interface ChannelSliderProps extends ComponentProps<typeof Sliding> {
  /**
   * Channel the slider sets.
   */
  readonly channel: ColorChannel;

  /**
   * Format the slider reads the channel in. Defaults to the format that has the channel.
   */
  readonly format?: ColorFormat | undefined;
}

/**
 * Renders the slider with the machine's slider props, less the press handler the track takes, and
 * provides the channel and its format to the parts inside it.
 *
 * @param props - The channel, its format, the label, the value text, the track and the props of
 *   a `div`.
 * @returns The `div` element.
 */
export function ChannelSlider({ channel, format, ...props }: ChannelSliderProps): ReactElement {
  const api = useColorPicker();
  const slider = { channel, format: format ?? formatOf(channel, api.format) };
  const { onPointerDown: _pressed, ...machine }: ComponentProps<typeof Sliding> = {
    ...api.getChannelSliderProps(slider),
  };

  return (
    <SliderProvider value={slider}>
      <Sliding {...mergeProps(machine, props)} />
    </SliderProvider>
  );
}
