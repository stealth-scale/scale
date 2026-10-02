/**
 * Renders a swatch of a preset color.
 *
 * @remarks
 *   The element is the library's color swatch, which paints the color over a checkerboard. It
 *   takes its color from `value`, else from the swatch trigger around it, and fills the box it is
 *   in unless the caller passes a size. It is hidden from assistive technology, because the trigger
 *   around it is named by the color.
 */

import { type JSX, type ReactElement } from "react";

import { type Color } from "@zag-js/color-utils";
import { mergeProps } from "@zag-js/react";

import { ColorSwatch, type ColorSwatchProps } from "@stealthscale/component-data";

import { withContext } from "#color-picker/context.ts";
import { useSwatchValue } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the library's color swatch with the color picker's swatch class.
 *
 * @remarks
 *   The type names the swatch's published props, because the inferred one names a type the data
 *   package does not export.
 */
const Swatched: (props: ColorSwatchProps) => JSX.Element = withContext(ColorSwatch, "swatch");

/**
 * Describes the props of the swatch: its color, the swatch's size and shape and the props of a
 * `span`.
 */
export interface SwatchProps extends Omit<ColorSwatchProps, "value"> {
  /**
   * Color the swatch shows, as a `Color` or any CSS color string. Defaults to the color of the
   * swatch trigger around it.
   */
  readonly value?: Color | string | undefined;
}

/**
 * Renders the swatch with the machine's swatch attributes, less the fill the machine writes
 * inline.
 *
 * @param props - The color, the swatch's size and shape and the props of a `span`.
 * @returns The `span` element.
 * @throws {@link Error} When the swatch states no color and no swatch trigger is around it.
 */
export function Swatch({ value, ...props }: SwatchProps): ReactElement {
  const api = useColorPicker();
  const swatch = { value: useSwatchValue(value) };
  const { style: _style, ...machine }: Omit<ColorSwatchProps, "value"> = {
    ...api.getSwatchProps(swatch),
  };
  const css = api.getSwatchTriggerState(swatch).value.toString("css");

  return <Swatched aria-hidden size="full" {...mergeProps(machine, props)} value={css} />;
}
