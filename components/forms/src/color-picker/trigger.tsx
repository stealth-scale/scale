/**
 * Renders the button that opens the panel.
 *
 * @remarks
 *   The button contains the caller's value swatch, whose name is the color. It is named by
 *   `ColorPicker.Label` and its own content, so a screen reader announces the label and the color,
 *   else by the label of a field around the picker and its content, else by the caller's
 *   `aria-label`, which it reports to the root for the panel. The machine's English name and its
 *   reference to a label that may not render are left out.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#color-picker/context.ts";
import { useColorPicker } from "#color-picker/machine.ts";
import { useNamed, useShared } from "#color-picker/state.ts";

/**
 * Renders the `button` with the color picker's trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: the value swatch and the props of a `button`.
 */
export type TriggerProps = ComponentProps<typeof Pressed>;

/**
 * Renders the trigger with the machine's trigger props, named after the label and its content.
 *
 * @param props - The value swatch and the props of a `button`.
 * @returns The `button` element.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useColorPicker();
  const { describedBy, ids, label } = useShared();

  useNamed(props["aria-label"]);

  const {
    "aria-label": _label,
    "aria-labelledby": _labelledBy,
    ...machine
  }: TriggerProps = { ...api.getTriggerProps() };
  const named = omitUndefined({
    "aria-describedby": describedBy,
    "aria-labelledby": label === undefined ? undefined : `${label} ${ids.trigger}`,
  });

  return <Pressed {...mergeProps(machine, named, props)} />;
}
