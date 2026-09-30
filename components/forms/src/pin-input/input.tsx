/**
 * Renders one box of the pin input.
 *
 * @remarks
 *   The element is an `input` for one character, of type `tel` for a numeric code and `password`
 *   for a masked one. One box is in the tab order at a time: the focused box, or the first empty
 *   one. Typing moves to the next box, Backspace clears the box and moves back, the arrow keys,
 *   Home and End move between boxes, and a pasted code fills every box. The box is named by its
 *   place in the code, and the group around it by the label. The machine counts the boxes after it
 *   mounts, so a server render counts them only when the root states `count`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#pin-input/context.ts";
import { usePinInput } from "#pin-input/machine.ts";

/**
 * Renders the `input` with the pin input's input class.
 */
const Box = withContext("input", "input");

/**
 * Describes the props of a box: its place in the code, its accessible name and the props of an
 * `input`.
 */
export interface InputProps extends Omit<ComponentProps<typeof Box>, "aria-label"> {
  /**
   * Place of the box in the code, from 0.
   */
  readonly index: number;

  /**
   * Accessible name of the box. Defaults to `Character 1 of 6`, counted from 1.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the box with the machine's props for its place in the code.
 *
 * @param props - The place, the name and the attributes of the `input`, merged over the machine's.
 * @returns The `input` element.
 */
export function Input({ index, label, ...rest }: InputProps): ReactElement {
  const api = usePinInput();

  return (
    <Box
      {...mergeProps(
        api.getInputProps({ index }),
        { "aria-label": label ?? `Character ${index + 1} of ${api.items.length}` },
        rest,
      )}
    />
  );
}
