/**
 * Renders a violin plot's key: the density, and the quartile bar and the median while they render,
 * each rendered as the chart renders it, with its name.
 *
 * @remarks
 *   A violin is read by convention, and its width has no scale, so the key names each part the
 *   chart renders. The glyphs take the recipe's classes the shapes take, so they share the shapes'
 *   inks under every theme and under forced colors.
 */

import { type ReactElement } from "react";

import * as Chart from "#chart/index.ts";
import { MEDIAN, QUARTILES } from "#chart/recipe.ts";
import { type ViolinWords } from "#violin-plot/words.ts";

/**
 * Outline of a violin in the glyph's 16 by 16 box: narrow at the top, widest below the middle.
 */
const OUTLINE =
  "M8 1.5C10 4 12.5 6 12.5 9.5C12.5 12.5 10.5 14.5 8 14.5C5.5 14.5 3.5 12.5 3.5 9.5C3.5 6 6 4 8 1.5Z";

/**
 * Describes the props of the key: the names, the violins' color, and whether the marker renders.
 */
export interface ViolinKeyProps {
  /**
   * CSS value of the violins' color.
   */
  readonly color: string;

  /**
   * Whether the chart renders the quartile bar and the median, which the key then names.
   */
  readonly quartiles: boolean;

  /**
   * Label of each part, the words the tooltip's rows take too.
   */
  readonly words: ViolinWords;
}

/**
 * Renders the key's entries.
 *
 * @param props - The names, the color and the marker's switch.
 */
export function ViolinKey({ color, quartiles, words }: ViolinKeyProps): ReactElement {
  return (
    <Chart.Key>
      <Chart.KeyItem
        glyph={
          <svg viewBox="0 0 16 16">
            <path d={OUTLINE} fill={color} fillOpacity={0.28} stroke={color} />
          </svg>
        }
      >
        {words.density}
      </Chart.KeyItem>
      {quartiles ? (
        <>
          <Chart.KeyItem
            glyph={
              <svg viewBox="0 0 16 16">
                <rect className={QUARTILES} height={12} width={3} x={6.5} y={2} />
              </svg>
            }
          >
            {words.quartiles}
          </Chart.KeyItem>
          <Chart.KeyItem
            glyph={
              <svg viewBox="0 0 16 16">
                <circle className={MEDIAN} cx={8} cy={8} r={3.5} strokeWidth={1.5} />
              </svg>
            }
          >
            {words.median}
          </Chart.KeyItem>
        </>
      ) : null}
    </Chart.Key>
  );
}
