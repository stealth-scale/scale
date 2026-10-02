/**
 * Renders a button that moves the picker to its next format.
 *
 * @remarks
 *   A press moves the format from RGB to HSB, from HSB to HSL and from HSL back to RGB, and a
 *   `View` of each format shows that format's channel inputs. The button shows the format in force,
 *   `RGB`, `HSL` or `HSB`, unless the caller passes words, and is named by what it shows.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `button` with the color picker's format trigger class.
 */
const Pressed = withContext("button", "formatTrigger");

/**
 * Describes the props of the format trigger: the words and the props of a `button`.
 */
export type FormatTriggerProps = ComponentProps<typeof Pressed>;

/**
 * Renders the trigger with the machine's trigger props, less the machine's English name.
 *
 * @param props - The words that replace the format and the props of a `button`.
 * @returns The `button` element.
 */
export function FormatTrigger({ children, ...props }: FormatTriggerProps): ReactElement {
  const api = useColorPicker();
  const { "aria-label": _label, ...machine }: FormatTriggerProps = {
    ...api.getFormatTriggerProps(),
  };

  return (
    <Pressed {...mergeProps(machine, props)}>
      {children ?? api.format.slice(0, 3).toUpperCase()}
    </Pressed>
  );
}
