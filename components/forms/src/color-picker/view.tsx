/**
 * Renders its children only while the picker's format is the one passed as `format`.
 *
 * @remarks
 *   A picker renders one view per format with the channel inputs of that format, and a format
 *   trigger or a caller's control of `format` switches between them.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type ColorFormat } from "@zag-js/color-utils";

import { withContext } from "#color-picker/context.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `div` with the color picker's view class.
 */
const Shown = withContext("div", "view");

/**
 * Describes the props of the view: its format and the props of a `div`.
 */
export interface ViewProps extends ComponentProps<typeof Shown> {
  /**
   * Format the view shows its children in.
   */
  readonly format: ColorFormat;
}

/**
 * Renders the view while its format is in force.
 *
 * @param props - The format, the inputs of that format and the props of a `div`.
 * @returns The `div` element, or nothing while another format is in force.
 */
export function View({ format, ...props }: ViewProps): null | ReactElement {
  const api = useColorPicker();

  if (api.format !== format) return null;

  return <Shown data-format={format} {...props} />;
}
