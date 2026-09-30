/**
 * Renders a swatch of the picker's color.
 *
 * @remarks
 *   The element is the library's color swatch, which paints the color over a checkerboard, so a
 *   translucent color shows as translucent. It fills the box it is in, such as the trigger's
 *   square, unless the caller passes a size. The swatch is an image named by the color in hex, with
 *   eight digits while the color is translucent, so a trigger named by its label and its content
 *   reads the label and the color.
 */

import { type JSX, type ReactElement } from "react";

import { ColorSwatch, type ColorSwatchProps } from "@stealthscale/component-data";

import { hexOf } from "#color-picker/channels.ts";
import { withContext } from "#color-picker/context.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the library's color swatch with the color picker's value swatch class.
 *
 * @remarks
 *   The type names the swatch's published props, because the inferred one names a type the data
 *   package does not export.
 */
const Swatched: (props: ColorSwatchProps) => JSX.Element = withContext(ColorSwatch, "valueSwatch");

/**
 * Describes the props of the value swatch: the swatch's size and shape and the props of a `span`.
 */
export type ValueSwatchProps = Omit<ColorSwatchProps, "value">;

/**
 * Renders the swatch of the picker's color.
 *
 * @param props - The swatch's size and shape and the props of a `span`, which replace the
 *   defaults.
 * @returns The `span` element with `role="img"`.
 */
export function ValueSwatch(props: ValueSwatchProps): ReactElement {
  const { value } = useColorPicker();

  return (
    <Swatched
      aria-label={hexOf(value)}
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- the swatch paints a CSS color, which no image source holds
      role="img"
      size="full"
      value={value.toString("css")}
      {...props}
    />
  );
}
