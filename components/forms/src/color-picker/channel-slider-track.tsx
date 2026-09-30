/**
 * Renders a slider's track, painted with the channel's range of colors.
 *
 * @remarks
 *   The track is a `group` that contains the slider's thumb, which it places along itself. A press
 *   on it moves the thumb there and keeps the thumb under the pointer until the pointer lifts. The
 *   machine's gradient reaches the recipe as the custom property `--color-picker-gradient`, and the
 *   alpha track paints it over a checkerboard.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { useSliderChannel } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";
import { GRADIENT } from "#color-picker/metrics.ts";
import { painted } from "#color-picker/painted.ts";

/**
 * Renders the `div` with the color picker's channel slider track class.
 */
const Tracked = withContext("div", "channelSliderTrack");

/**
 * Describes the props of the track: the thumb and the props of a `div`.
 */
export type ChannelSliderTrackProps = ComponentProps<typeof Tracked>;

/**
 * Renders the track with the machine's track props and the slider's press handler, the gradient
 * moved into a custom property.
 *
 * @param props - The thumb and the props of a `div`.
 * @returns The `div` element with `role="group"`.
 */
export function ChannelSliderTrack(props: ChannelSliderTrackProps): ReactElement {
  const api = useColorPicker();
  const slider = useSliderChannel();
  const { onPointerDown }: ChannelSliderTrackProps = { ...api.getChannelSliderProps(slider) };
  const { style, ...machine }: ChannelSliderTrackProps = {
    ...api.getChannelSliderTrackProps(slider),
  };
  const moved = { ...machine, style: painted(style, "backgroundImage", GRADIENT) };

  return <Tracked {...mergeProps(moved, { onPointerDown }, props)} />;
}
