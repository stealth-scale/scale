/**
 * Renders a box of one colour.
 *
 * @remarks
 *   The colour reaches the recipe as the custom property `--color-swatch-value`, because it is a
 *   runtime value such as the colour a person picked. The swatch has no text, so a screen reader
 *   announces nothing. Write the colour's name or value beside it where a person needs it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Swatch } from "#color-swatch/swatch.ts";

/**
 * Describes the props of `ColorSwatch`: the colour, the recipe's variants and the props of a
 * `span`.
 */
export interface ColorSwatchProps extends Omit<ComponentProps<typeof Swatch>, "mix"> {
  /**
   * The colour to show, in any notation CSS reads.
   */
  readonly value: string;
}

/**
 * Renders a box of the colour passed as `value`, over a checkerboard.
 */
export function ColorSwatch({ style, value, ...rest }: ColorSwatchProps): ReactElement {
  const colored: Record<string, string> = { "--color-swatch-value": value };

  return <Swatch data-value={value} style={{ ...colored, ...style }} {...rest} />;
}
