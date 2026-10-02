/**
 * Renders a group of swatch triggers.
 *
 * @remarks
 *   The element is a `group` that wraps its triggers onto new rows. It is named by the caller's
 *   `aria-label`, else by the label that names the picker, so swatches that are the whole picker
 *   read as the picker's field.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { useColorPicker } from "#color-picker/machine.ts";
import { useShared } from "#color-picker/state.ts";

/**
 * Renders the `div` with the color picker's swatch group class.
 */
const Grouped = withContext("div", "swatchGroup");

/**
 * Describes the props of the swatch group: the triggers and the props of a `div`.
 */
export type SwatchGroupProps = ComponentProps<typeof Grouped>;

/**
 * Renders the group with the machine's group props merged under the caller's.
 *
 * @param props - The triggers and the props of a `div`.
 * @returns The `div` element with `role="group"`.
 */
export function SwatchGroup(props: SwatchGroupProps): ReactElement {
  const api = useColorPicker();
  const { label } = useShared();
  const named = props["aria-label"] === undefined && label !== undefined;

  return (
    <Grouped
      {...mergeProps(api.getSwatchGroupProps(), named ? { "aria-labelledby": label } : {}, props)}
    />
  );
}
