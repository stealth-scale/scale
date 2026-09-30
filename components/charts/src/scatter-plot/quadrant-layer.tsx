/**
 * Renders a quadrant chart's two dividing lines and the name of each quadrant in its corner of the
 * plot.
 *
 * @remarks
 *   The lines are dashed reference lines at the division's values, under the points. Each name is
 *   8px inside its corner, anchored at its corner's side, so a long name runs toward the middle of
 *   the plot. The names are hidden from assistive technology, because the tooltip writes each
 *   point's quadrant after its name.
 */

import { type ReactElement } from "react";

import { ReferenceLine, Text, usePlotArea } from "recharts";

import { DIVISION, QUADRANT } from "#chart/placed.ts";
import { type Division, type QuadrantId, QUADRANTS } from "#scatter-plot/quadrants.ts";

/**
 * Dash pattern of the dividing lines, in pixels.
 */
const DASH = "4 4";

/**
 * Space between a name and its corner of the plot, in pixels.
 */
const INSET = 8;

/**
 * Describes the props of the layer: where the quadrants divide and what each is called.
 */
export interface QuadrantLayerProps {
  /**
   * Values the two dividing lines cross the axes at.
   */
  readonly division: Division;

  /**
   * Name of each quadrant, keyed by the reading direction.
   */
  readonly names: Readonly<Record<QuadrantId, string>>;
}

/**
 * Renders the dividing lines, and each quadrant's name once the plot has laid out.
 *
 * @param props - The division and the names.
 */
export function QuadrantLayer({ division, names }: QuadrantLayerProps): ReactElement {
  const plot = usePlotArea();

  return (
    <>
      <ReferenceLine
        className={DIVISION}
        ifOverflow="hidden"
        strokeDasharray={DASH}
        x={division.x}
      />
      <ReferenceLine
        className={DIVISION}
        ifOverflow="hidden"
        strokeDasharray={DASH}
        y={division.y}
      />
      {plot === undefined
        ? null
        : QUADRANTS.map((quadrant) => {
            const end = quadrant.endsWith("End");
            const top = quadrant.startsWith("top");

            return (
              <Text
                aria-hidden
                className={QUADRANT}
                key={quadrant}
                textAnchor={end ? "end" : "start"}
                verticalAnchor={top ? "start" : "end"}
                x={end ? plot.x + plot.width - INSET : plot.x + INSET}
                y={top ? plot.y + INSET : plot.y + plot.height - INSET}
              >
                {names[quadrant]}
              </Text>
            );
          })}
    </>
  );
}
