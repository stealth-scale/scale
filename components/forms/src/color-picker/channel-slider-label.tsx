/**
 * Renders the visible name of a slider.
 *
 * @remarks
 *   The label is text above the track's start. A press on it moves focus to the slider's thumb.
 *   The thumb's name comes from its own `label`, the channel's English name by default, so a
 *   caller who writes other words here passes them to the thumb too.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { useSliderChannel } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `span` with the color picker's channel slider label class.
 */
const Named = withContext("span", "channelSliderLabel");

/**
 * Describes the props of the slider's label: the props of a `span`.
 */
export type ChannelSliderLabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's label props merged under the caller's.
 *
 * @param props - The words and the props of a `span`.
 * @returns The `span` element.
 */
export function ChannelSliderLabel(props: ChannelSliderLabelProps): ReactElement {
  const api = useColorPicker();
  const { channel } = useSliderChannel();

  return <Named {...mergeProps(api.getChannelSliderLabelProps({ channel }), props)} />;
}
