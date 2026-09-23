/**
 * Renders a box divided between two to four colours.
 *
 * @remarks
 *   The colours reach the recipe as `--color-swatch-1` to `--color-swatch-4`, and the number of
 *   colours selects the `mix` axis: two halves, two quarters over a half, or four quarters. The
 *   props type accepts two to four colours, so a list of five fails to type-check.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Swatch } from "#color-swatch/swatch.ts";

/**
 * Selects the `mix` value for each number of colours.
 */
const DIVISIONS = { 2: "halves", 3: "thirds", 4: "quarters" } as const;

/**
 * Describes the two to four colours a mix takes, in reading order.
 */
export type Mixed =
  | readonly [string, string, string, string]
  | readonly [string, string, string]
  | readonly [string, string];

/**
 * Describes the props of `ColorSwatchMix`: the colours, the recipe's variants and the props of a
 * `span`.
 */
export interface ColorSwatchMixProps extends Omit<ComponentProps<typeof Swatch>, "mix"> {
  /**
   * The colours to show, in any notation CSS reads.
   */
  readonly items: Mixed;
}

/**
 * Renders a box divided between the colours passed as `items`, over a checkerboard.
 */
export function ColorSwatchMix({ items, style, ...rest }: ColorSwatchMixProps): ReactElement {
  const colored: Record<string, string> = Object.fromEntries(
    items.map((item, at) => [`--color-swatch-${String(at + 1)}`, item]),
  );

  return <Swatch mix={DIVISIONS[items.length]} style={{ ...colored, ...style }} {...rest} />;
}
