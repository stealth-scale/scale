/**
 * Renders a sparkbar: a run of counts, one bar per period, at the size of a word, without axes, a
 * tooltip or a legend.
 *
 * @remarks
 *   A bar is read by its length, so the bars start at zero, where the sparkline spans the run's own
 *   range. A value that is not a finite number leaves its period empty. `signed` renders a value
 *   under zero in the error palette's chart color, for a change per period. A sparkbar with a
 *   `label` is an image named by it, and one without is hidden from assistive technology. Neither
 *   takes a tab stop. Each row sets its own `fill`, because recharts spreads a row into its bar's
 *   props.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Bar, BarChart, ReferenceLine, ResponsiveContainer, YAxis } from "recharts";

import { FROM_ZERO } from "#cartesian/finite.ts";
import { type ChartColor, colorAt, colorOf } from "#chart/colors.ts";
import { Box } from "#spark/box.ts";
import { namingOf, rowsOf, type SparkValue } from "#spark/rows.ts";

/**
 * Size the run takes until recharts measures its box: the middle size.
 */
const INITIAL = { height: 24, width: 96 };

/**
 * Room around the run: none at the sides, so the bars run to the box's edges.
 */
const MARGIN = { bottom: 0, left: 0, right: 0, top: 1 };

/**
 * Gap between two bars, as a share of each period, so a stretched run keeps its proportions.
 */
const GAP = "20%";

/**
 * Dash pattern of the baseline: 2px dashes, 2px apart.
 */
const DASH = "2 2";

/**
 * Describes the props of a sparkbar: the run, its colors and the props of the box.
 */
export interface SparkbarProps extends Omit<ComponentProps<typeof Box>, "children" | "color"> {
  /**
   * Whether the bars animate in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Value a dashed line marks across the run, such as a target.
   */
  readonly baseline?: number | undefined;

  /**
   * Palette the bars take their color from. The theme's first series color unless stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Name of a run shown on its own. A run without one is hidden from assistive technology.
   */
  readonly label?: string | undefined;

  /**
   * Whether a value under zero takes the error palette's chart color.
   */
  readonly signed?: boolean | undefined;

  /**
   * The run, oldest first. A value that is not a finite number leaves its period empty.
   */
  readonly values: readonly SparkValue[];
}

/**
 * Renders the run as bars from zero in its box.
 *
 * @param props - The run, its colors and the props of the box.
 */
export function Sparkbar({
  animate = false,
  baseline,
  color,
  label,
  signed = false,
  values,
  ...props
}: SparkbarProps): ReactElement {
  const rising = colorAt(color, 0);
  const falling = signed ? colorOf("error") : rising;
  const rows = rowsOf(values).map(({ at, value }) => ({
    at,
    fill: (value ?? 0) < 0 ? falling : rising,
    value,
  }));

  return (
    <Box {...props} {...namingOf(label)}>
      <ResponsiveContainer initialDimension={INITIAL}>
        <BarChart accessibilityLayer={false} barCategoryGap={GAP} data={rows} margin={MARGIN}>
          <YAxis domain={FROM_ZERO} hide />
          {baseline === undefined ? null : (
            <ReferenceLine ifOverflow="extendDomain" strokeDasharray={DASH} y={baseline} />
          )}
          <Bar dataKey="value" fill={rising} isAnimationActive={animate ? "auto" : false} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
