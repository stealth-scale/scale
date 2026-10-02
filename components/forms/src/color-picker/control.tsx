/**
 * Renders the row of the text input and the trigger.
 *
 * @remarks
 *   A channel input inside the control is the picker's field: it takes the field's ID, and the
 *   label names it. The machine finds the control's hex input to move focus to it from the label.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { InControl } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `div` with the color picker's control class.
 */
const Held = withContext("div", "control");

/**
 * Describes the props of the control: the props of a `div`.
 */
export type ControlProps = ComponentProps<typeof Held>;

/**
 * Renders the control with the machine's control props, and tells the parts inside that they sit
 * in it.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Control(props: ControlProps): ReactElement {
  const api = useColorPicker();

  return (
    <InControl value>
      <Held {...mergeProps(api.getControlProps(), props)} />
    </InControl>
  );
}
