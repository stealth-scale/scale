/**
 * Renders a box plot's key: the box, the median, the whiskers and the outliers, each rendered as
 * the chart renders it, with its name.
 *
 * @remarks
 *   A box plot is read by convention, so the key names each part the chart renders. The glyphs take
 *   the recipe's classes the shapes take, so they share the shapes' inks under every theme and
 *   under forced colors.
 */

import { type ReactElement } from "react";

import { type BoxWords } from "#box-plot/words.ts";
import * as Chart from "#chart/index.ts";
import { MEDIAN, OUTLIER, WHISKER } from "#chart/recipe.ts";

/**
 * Describes the props of the key: the names, the boxes' color, and whether outliers render.
 */
export interface BoxKeyProps {
  /**
   * CSS value of the boxes' color.
   */
  readonly color: string;

  /**
   * Whether the chart renders outliers, which the key then names.
   */
  readonly outliers: boolean;

  /**
   * Label of each part, the words the tooltip's rows take too.
   */
  readonly words: BoxWords;
}

/**
 * Renders the key's entries.
 *
 * @param props - The names, the color and the outliers' switch.
 */
export function BoxKey({ color, outliers, words }: BoxKeyProps): ReactElement {
  return (
    <Chart.Key>
      <Chart.KeyItem
        glyph={
          <svg viewBox="0 0 16 16">
            <rect
              fill={color}
              fillOpacity={0.35}
              height={10}
              stroke={color}
              width={12}
              x={2}
              y={3}
            />
          </svg>
        }
      >
        {words.quartiles}
      </Chart.KeyItem>
      <Chart.KeyItem
        glyph={
          <svg viewBox="0 0 16 16">
            <line className={MEDIAN} strokeWidth={2} x1={2} x2={14} y1={8} y2={8} />
          </svg>
        }
      >
        {words.median}
      </Chart.KeyItem>
      <Chart.KeyItem
        glyph={
          <svg viewBox="0 0 16 16">
            <line className={WHISKER} x1={8} x2={8} y1={2} y2={14} />
            <line className={WHISKER} x1={5} x2={11} y1={2} y2={2} />
            <line className={WHISKER} x1={5} x2={11} y1={14} y2={14} />
          </svg>
        }
      >
        {words.whiskers}
      </Chart.KeyItem>
      {outliers ? (
        <Chart.KeyItem
          glyph={
            <svg viewBox="0 0 16 16">
              <circle className={OUTLIER} cx={8} cy={8} r={3} stroke={color} strokeWidth={1.5} />
            </svg>
          }
        >
          {words.outliers}
        </Chart.KeyItem>
      ) : null}
    </Chart.Key>
  );
}
