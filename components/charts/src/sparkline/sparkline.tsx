/**
 * Renders a sparkline: the shape of a run of values at the size of a word, without axes, a tooltip
 * or a legend.
 *
 * @remarks
 *   The line spans the run's own range, so it shows whether the run rises, falls or is flat, and
 *   the figure it belongs to goes beside it. A baseline widens the range to include itself. A value
 *   that is not a finite number leaves a gap. A sparkline with a `label` is an image named by it,
 *   and one without is hidden from assistive technology, for a run beside its figure. Neither takes
 *   a tab stop, because the run has no tooltip to move through. `area` fills under the line with
 *   the chart's gradient, which suits a run that starts at zero.
 */

import { type ComponentProps, type ReactElement, useId } from "react";

import { Area, AreaChart, ReferenceLine, ResponsiveContainer, YAxis } from "recharts";

import { fadeOf, STROKE } from "#cartesian/marks.tsx";
import { type Curve } from "#cartesian/types.ts";
import { type ChartColor, colorAt } from "#chart/colors.ts";
import { Box } from "#spark/box.ts";
import { namingOf, rowsOf, type SparkValue } from "#spark/rows.ts";

/**
 * Size the run takes until recharts measures its box: the middle size.
 */
const INITIAL = { height: 24, width: 96 };

/**
 * Room around the run, half the line's width, so the line's peak and trough are inside the box.
 */
const MARGIN = { bottom: 1, left: 1, right: 1, top: 1 };

/**
 * Dash pattern of the baseline: 2px dashes, 2px apart.
 */
const DASH = "2 2";

/**
 * Describes the props of a sparkline: the run, its color and shape, and the props of the box.
 */
export interface SparklineProps extends Omit<ComponentProps<typeof Box>, "children" | "color"> {
  /**
   * Whether the line animates in, which it does only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Whether the chart's gradient fills under the line.
   */
  readonly area?: boolean | undefined;

  /**
   * Value a dashed line marks across the run, such as a target.
   */
  readonly baseline?: number | undefined;

  /**
   * Palette the line takes its color from. The theme's first series color unless stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Path of the line between two values.
   */
  readonly curve?: Curve | undefined;

  /**
   * Name of a run shown on its own. A run without one is hidden from assistive technology.
   */
  readonly label?: string | undefined;

  /**
   * The run, oldest first. A value that is not a finite number leaves a gap.
   */
  readonly values: readonly SparkValue[];
}

/**
 * Renders the run as a line in its box.
 *
 * @param props - The run, its color and shape, and the props of the box.
 */
export function Sparkline({
  animate = false,
  area = false,
  baseline,
  color,
  curve = "monotone",
  label,
  values,
  ...props
}: SparklineProps): ReactElement {
  const gradient = useId();
  const stroke = colorAt(color, 0);

  return (
    <Box {...props} {...namingOf(label)}>
      <ResponsiveContainer initialDimension={INITIAL}>
        <AreaChart accessibilityLayer={false} data={rowsOf(values)} margin={MARGIN}>
          {area ? <defs>{fadeOf(gradient, stroke)}</defs> : null}
          <YAxis domain={["dataMin", "dataMax"]} hide />
          {baseline === undefined ? null : (
            <ReferenceLine ifOverflow="extendDomain" strokeDasharray={DASH} y={baseline} />
          )}
          <Area
            activeDot={false}
            dataKey="value"
            dot={false}
            fill={area ? `url(#${gradient})` : "none"}
            fillOpacity={1}
            isAnimationActive={animate ? "auto" : false}
            stroke={stroke}
            strokeWidth={STROKE}
            type={curve}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
