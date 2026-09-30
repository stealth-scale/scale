/**
 * Renders a heat grid's key: what the values are, the value at the start of the scale, a bar of
 * the scale's colors, and the value at its end, with a diverging scale's midpoint under the bar.
 *
 * @remarks
 *   The key is one line, so each end's value is at the end of the bar it names. The bar is hidden
 *   from assistive technology, and the key's words read as text: the name of the values, the start,
 *   the end, then the midpoint.
 */

import { type ReactElement, type ReactNode } from "react";

import { withContext } from "#heat/context.ts";
import { RAMP } from "#heat/recipe.ts";
import { type Paint, rampOf, ticksOf } from "#heat/scale.ts";

/**
 * Renders the key's `div`.
 */
const Row = withContext("div", "key");

/**
 * Renders the name of the values.
 */
const Label = withContext("span", "keyLabel");

/**
 * Renders the bar of the scale's colors.
 */
const Bar = withContext("span", "bar");

/**
 * Renders a diverging scale's midpoint under the bar's middle.
 */
const Midpoint = withContext("span", "midpoint");

/**
 * Describes the props of the key: the name of the values, the scale and the writer of its values.
 */
export interface KeyProps {
  /**
   * Name of the values, such as what a cell counts.
   */
  readonly label: ReactNode;

  /**
   * Scale and colors of the cells.
   */
  readonly paint: Paint;

  /**
   * Writes a value in the chart's locale.
   */
  readonly write: (value: unknown) => string;
}

/**
 * Renders the name of the values, the bar between its two ends' values, and a midpoint under it.
 *
 * @param props - The name, the scale and the writer.
 */
export function Key({ label, paint, write }: KeyProps): ReactElement {
  const painted: Record<string, string> = { [RAMP]: rampOf(paint).join(", ") };
  const { high, low, midpoint } = ticksOf(paint);

  return (
    <Row>
      <Label>{label}</Label>
      <span>{write(low)}</span>
      <Bar aria-hidden style={painted} />
      <span>{write(high)}</span>
      {midpoint === undefined ? null : <Midpoint>{write(midpoint)}</Midpoint>}
    </Row>
  );
}
