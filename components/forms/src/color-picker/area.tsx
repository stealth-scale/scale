/**
 * Renders the area a person drags across to set two channels of the color at once.
 *
 * @remarks
 *   The area is a `group` that paints two channels as a gradient: saturation along the horizontal
 *   axis and brightness along the vertical one by default, or saturation and lightness while the
 *   format is HSL. A press anywhere in it moves the thumb there and keeps the thumb under the
 *   pointer until the pointer lifts. The machine acts on the area only while the panel is open,
 *   which an inline panel always is.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { type AreaChannels, AreaProvider } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `div` with the color picker's area class.
 */
const Painted = withContext("div", "area");

/**
 * Describes the props of the area: the channels of its axes and the props of a `div`.
 */
export interface AreaProps extends AreaChannels, ComponentProps<typeof Painted> {}

/**
 * Renders the area with the machine's area props merged under the caller's, and provides its
 * channels to the background and the thumb inside it.
 *
 * @param props - The channels of the axes, the background, the thumb and the props of a `div`.
 * @returns The `div` element with `role="group"`.
 */
export function Area({ xChannel, yChannel, ...props }: AreaProps): ReactElement {
  const api = useColorPicker();
  const channels = { xChannel, yChannel };

  return (
    <AreaProvider value={channels}>
      <Painted {...mergeProps(api.getAreaProps(channels), props)} />
    </AreaProvider>
  );
}
