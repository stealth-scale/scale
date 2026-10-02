/**
 * Renders a slider's thumb.
 *
 * @remarks
 *   The thumb is a `slider` named by `label`, the channel's English name by default, with the
 *   channel's value as its value text, such as `217°` or `50%`, formatted in the root's locale. The
 *   arrow keys step the channel, by ten steps with Shift, Page Up and Page Down step it by ten, and
 *   Home and End set its ends. A key keeps the color in the slider's format, so the hue of a grey
 *   moves as it does under a drag. The thumb goes inside the track.
 */

import { type ComponentProps, type KeyboardEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { CHANNEL_NAMES, channelText } from "#color-picker/channels.ts";
import { withContext } from "#color-picker/context.ts";
import { useSliderChannel } from "#color-picker/contexts.ts";
import { keyed } from "#color-picker/keys.ts";
import { useColorPicker } from "#color-picker/machine.ts";
import { FILL } from "#color-picker/metrics.ts";
import { painted } from "#color-picker/painted.ts";
import { useShared } from "#color-picker/state.ts";

/**
 * Renders the `div` with the color picker's channel slider thumb class.
 */
const Thumbed = withContext("div", "channelSliderThumb");

/**
 * Describes the props of the thumb: its name and the props of a `div`.
 */
export interface ChannelSliderThumbProps extends ComponentProps<typeof Thumbed> {
  /**
   * Name of the thumb. Defaults to the channel's English name, such as "Hue".
   */
  readonly label?: string | undefined;
}

/**
 * Renders the thumb with the machine's thumb props, its name, its value text and its keys.
 *
 * @remarks
 *   The key handler is merged after the machine's, so it runs first, and it cancels each key it
 *   handles, which the machine's handler then ignores.
 * @param props - The name and the props of a `div`.
 * @returns The `div` element with `role="slider"`.
 */
export function ChannelSliderThumb({ label, ...props }: ChannelSliderThumbProps): ReactElement {
  const api = useColorPicker();
  const { change, locale, rtl } = useShared();
  const { channel, format } = useSliderChannel();
  const {
    "aria-label": _label,
    "aria-valuetext": _text,
    style,
    ...machine
  }: ComponentProps<typeof Thumbed> = { ...api.getChannelSliderThumbProps({ channel, format }) };
  const own = {
    "aria-label": label ?? CHANNEL_NAMES[channel],
    "aria-valuetext": channelText(api.value, channel, locale, format),
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>): void => {
      const next = keyed(event, api.value.toFormat(format), channel, rtl);

      if (next === undefined) return;

      event.preventDefault();
      change(next);
    },
    style: painted(style, "background", FILL),
  };

  return <Thumbed {...mergeProps(machine, own, props)} />;
}
