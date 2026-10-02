/**
 * Renders the mark of a swatch trigger whose color is the picker's.
 *
 * @remarks
 *   The indicator is hidden while its trigger's color is not the picker's. It is a circle on the
 *   panel surface in the middle of the swatch, so the caller's glyph inside it stays readable on
 *   any color. It is hidden from assistive technology, because its trigger reports `aria-pressed`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type Color } from "@zag-js/color-utils";
import { mergeProps } from "@zag-js/react";

import { withContext } from "#color-picker/context.ts";
import { useSwatchValue } from "#color-picker/contexts.ts";
import { useColorPicker } from "#color-picker/machine.ts";

/**
 * Renders the `span` with the color picker's swatch indicator class.
 */
const Marked = withContext("span", "swatchIndicator");

/**
 * Describes the props of the indicator: its color, the glyph and the props of a `span`.
 */
export interface SwatchIndicatorProps extends ComponentProps<typeof Marked> {
  /**
   * Color the indicator marks, as a `Color` or any CSS color string. Defaults to the color of the
   * swatch trigger around it.
   */
  readonly value?: Color | string | undefined;
}

/**
 * Renders the indicator with the machine's indicator props merged under the caller's.
 *
 * @param props - The color, the glyph and the props of a `span`.
 * @returns The `span` element.
 * @throws {@link Error} When the indicator states no color and no swatch trigger is around it.
 */
export function SwatchIndicator({ value, ...props }: SwatchIndicatorProps): ReactElement {
  const api = useColorPicker();
  const swatch = { value: useSwatchValue(value) };

  return <Marked aria-hidden {...mergeProps(api.getSwatchIndicatorProps(swatch), props)} />;
}
