/**
 * Renders a slider's value as text.
 *
 * @remarks
 *   The text is the channel's value in the slider's format at the precision of its step, such as
 *   `217°` or `50%`, formatted in the root's locale. Children replace it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { channelText } from "#color-picker/channels.ts";
import { withContext } from "#color-picker/context.ts";
import { useSliderChannel } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";
import { useShared } from "#color-picker/state.ts";

/**
 * Renders the `span` with the color picker's channel slider value text class.
 */
const Written = withContext("span", "channelSliderValueText");

/**
 * Describes the props of the slider's value text: the props of a `span`.
 */
export type ChannelSliderValueTextProps = ComponentProps<typeof Written>;

/**
 * Renders the value text with the machine's props merged under the caller's.
 *
 * @param props - The text that replaces the value and the props of a `span`.
 * @returns The `span` element.
 */
export function ChannelSliderValueText({
  children,
  ...props
}: ChannelSliderValueTextProps): ReactElement {
  const api = useColorPicker();
  const { locale } = useShared();
  const { channel, format } = useSliderChannel();
  const text = channelText(api.value, channel, locale, format);

  return (
    <Written {...mergeProps(api.getChannelSliderValueTextProps({ channel }), props)}>
      {children ?? text}
    </Written>
  );
}
