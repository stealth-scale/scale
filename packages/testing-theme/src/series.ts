/**
 * Measures whether a chart's consecutive series colors can be told apart, in both modes.
 *
 * @remarks
 *   A chart names its series by color before a reader finds the legend, so each series color
 *   keeps a distance in OKLab from the one before it. The last and the first are not paired: a
 *   chart of more than eight series starts the colors over, and a reader tells those apart by the
 *   legend.
 */

import { MODES, SERIES, type Theme } from "@stealthscale/theme/authoring";

import { type Thresholds } from "#contrast.ts";
import { colorAt, type Resolving } from "#theme.ts";
import { distance } from "#vision.ts";

/**
 * Reports each consecutive pair of series colors closer than the series threshold in either mode,
 * and each pair that could not be measured.
 *
 * @returns One line per failing pair and mode, naming the distance and the threshold. Empty when
 *   every pair clears it.
 */
export function distinct(
  theme: Theme,
  options: Resolving,
  thresholds: Thresholds,
): readonly string[] {
  return MODES.flatMap((mode) =>
    SERIES.slice(1).flatMap((step, index) => {
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the index runs one step behind in the same list
      const previous = SERIES[index] as (typeof SERIES)[number];
      const one = colorAt(theme, `series.${previous}`, mode, options);
      const other = colorAt(theme, `series.${step}`, mode, options);
      const where = `series.${previous} and series.${step}`;

      if (one === undefined || other === undefined) {
        return [`${theme.name} ${where} cannot be measured in ${mode}`];
      }

      const apart = distance(one, other);

      if (apart >= thresholds.series) return [];

      return [
        `${theme.name} ${where} differ by ${apart.toFixed(3)} in ${mode}, below ${String(thresholds.series)}`,
      ];
    }),
  );
}
