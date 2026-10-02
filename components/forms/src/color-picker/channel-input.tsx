/**
 * Renders a text input for one channel of the color, or for the whole color as hex or CSS.
 *
 * @remarks
 *   A hex or CSS input is a text input, and a channel input is a number input within the channel's
 *   range, without the browser's spin buttons. The machine's inline `appearance` is left out, so
 *   the recipe sets one that hides them in Firefox too. The input commits what a person typed on
 *   Enter and when it loses focus, and keeps the color when the text is not one. It shows the color
 *   again as the color changes elsewhere. A channel input sets a channel of the format in force, so
 *   a picker renders the inputs of each format inside a `View` of that format. A hex or CSS input
 *   inside `ColorPicker.Control` is the picker's field: it takes the field's ID, is named by the
 *   picker's label, else by `label`, is described by a field's texts, and reports the invalid and
 *   required states. Any other input is named by `label`, the channel's English name by default.
 */

import { type ComponentProps, type ReactElement, useContext } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { CHANNEL_NAMES, type InputChannel } from "#color-picker/channels.ts";
import { withContext } from "#color-picker/context.ts";
import { InControl } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";
import { type Shared, useShared } from "#color-picker/state.ts";

/**
 * Renders the `input` with the color picker's channel input class.
 */
const Typed = withContext("input", "channelInput");

/**
 * Describes the props of the channel input: its channel, its name and the props of an `input`.
 */
export interface ChannelInputProps extends ComponentProps<typeof Typed> {
  /**
   * Channel the input sets, or `hex` or `css` for the whole color.
   */
  readonly channel: InputChannel;

  /**
   * Name of the input where no label names it. Defaults to the channel's English name, such as
   * "Hex" or "Red".
   */
  readonly label?: string | undefined;
}

/**
 * Returns the attributes that make an input the picker's field: its ID, its name, its description
 * and its states.
 *
 * @param shared - The state the root shares.
 * @param name - The input's name where no label names it.
 * @returns The attributes, each left out where nothing sets it.
 */
function fielded(shared: Shared, name: string): ComponentProps<typeof Typed> {
  return omitUndefined({
    ...(shared.label === undefined ? { "aria-label": name } : { "aria-labelledby": shared.label }),
    "aria-describedby": shared.describedBy,
    "aria-invalid": shared.invalid || undefined,
    "aria-required": shared.required || undefined,
    id: shared.ids.field,
  });
}

/**
 * Renders the channel input with the machine's input props, named and described as its place
 * requires.
 *
 * @param props - The channel, the name and the props of an `input`.
 * @returns The `input` element.
 */
export function ChannelInput({ channel, label, ...props }: ChannelInputProps): ReactElement {
  const api = useColorPicker();
  const shared = useShared();
  const controlled = useContext(InControl);
  const whole = channel === "hex" || channel === "css";
  const name = label ?? CHANNEL_NAMES[channel];
  const own = whole && controlled ? fielded(shared, name) : { "aria-label": name };
  const {
    "aria-label": _label,
    style: _style,
    ...machine
  }: ComponentProps<typeof Typed> = { ...api.getChannelInputProps({ channel }) };

  return <Typed {...mergeProps(machine, own, props)} />;
}
