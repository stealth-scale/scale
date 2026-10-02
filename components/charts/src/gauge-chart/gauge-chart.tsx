/**
 * Renders a gauge: one value on a dial from the range's minimum to its maximum, with the zones that
 * name what the value means.
 *
 * @remarks
 *   The dial runs clockwise from `startAngle` to `endAngle`, three quarters of a turn with its gap
 *   at the bottom unless stated. The reading fills the dial from the minimum in its zone's color,
 *   and the figure and the zone's name are written in the middle, because an arc is not read for a
 *   quantity. The zones form a thin ring outside the reading, tinted, and the part of the range no
 *   zone covers renders as the track. A value past the range fills the dial to its end, and the
 *   figure and the meter's text write the value itself. A value that is not a finite number renders
 *   the empty state. The plot is a meter: a screen reader reads its name, its value and its zone,
 *   and the chart has no keyboard layer and no tooltip, because one value needs neither.
 */

import { type ReactElement, type ReactNode } from "react";

import { Pie, PieChart } from "recharts";

import * as Chart from "#chart/index.ts";
import { TRACK } from "#chart/recipe.ts";
import { type RootProps } from "#chart/root.tsx";
import {
  type GaugeBand,
  gaugeBandAt,
  gaugeBands,
  type GaugeZone,
  tintOf,
  zonedText,
} from "#gauge-chart/bands.ts";
import { GaugeLimits } from "#gauge-chart/limits.tsx";

/**
 * Message the chart renders without a finite value unless it states one.
 */
const EMPTY = "No data";

/**
 * Angle the dial starts at unless stated: halfway between 6 and 9 o'clock.
 */
const START = 225;

/**
 * Angle the dial ends at unless stated: halfway between 3 and 6 o'clock, three quarters of a turn
 * clockwise from the start.
 */
const END = -45;

/**
 * Radii of the dial's rings, in percent of the largest circle the plot fits: the reading's ring
 * and, outside it, the zones' ring.
 */
const RINGS = { inner: 58, outer: 97, reading: 84, zones: 90 };

/**
 * Palette the reading takes where its zone states none: the theme's first series color.
 */
const FIRST: Chart.ChartColor = "series.1";

/**
 * Zones of a gauge without any.
 */
const NONE: readonly GaugeZone[] = [];

/**
 * Describes the props of a gauge: the value and its range, the zones, the words, the switches and
 * the figure's props.
 */
export interface GaugeChartProps extends Omit<RootProps, "chart" | "children" | "color"> {
  /**
   * Whether the dial fills in, which it does only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Words under the figure in the middle. The name of the zone the value is in unless stated.
   */
  readonly centerLabel?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the dial.
   */
  readonly children?: ReactNode;

  /**
   * Palette the reading takes where its zone states none. The theme's first series color unless
   * stated.
   */
  readonly color?: Chart.ChartColor | undefined;

  /**
   * Message the chart renders in the plot's place while the value is not a finite number.
   */
  readonly empty?: ReactNode;

  /**
   * Angle the dial ends at, in recharts' degrees, where clockwise is negative. -45 unless stated.
   */
  readonly endAngle?: number | undefined;

  /**
   * Accessible name of the meter, such as "Checkout latency".
   */
  readonly label: string;

  /**
   * Whether the range's minimum and maximum are written under the dial's ends.
   */
  readonly limits?: boolean | undefined;

  /**
   * Locale the values are written in. The locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Value the dial ends at.
   */
  readonly max: number;

  /**
   * Value the dial starts at. 0 unless stated.
   */
  readonly min?: number | undefined;

  /**
   * Angle the dial starts at, in recharts' degrees, where 90 is 12 o'clock. 225 unless stated.
   */
  readonly startAngle?: number | undefined;

  /**
   * Value the gauge shows.
   */
  readonly value: number;

  /**
   * `Intl.NumberFormat` options the figure, the range's ends and the meter's text are written with.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Zones of the range in any order, such as healthy, watch and critical. None unless stated.
   */
  readonly zones?: readonly GaugeZone[] | undefined;
}

/**
 * Describes one sector of a ring recharts renders: its span of the range, and its fill or the
 * track's class.
 */
interface Arc {
  /**
   * Class of a track, whose fill the recipe sets.
   */
  readonly className?: string | undefined;

  /**
   * CSS value of the sector's fill.
   */
  readonly fill?: string | undefined;

  /**
   * Span of the range the sector covers.
   */
  readonly span: number;
}

/**
 * Describes the dial: the range, the reading, the bands, the angles and the switches.
 */
interface Dial {
  /**
   * Whether the dial fills in.
   */
  readonly animate: boolean;

  /**
   * Band the reading is in, if any.
   */
  readonly band: GaugeBand | undefined;

  /**
   * Bands of the zones' ring.
   */
  readonly bands: readonly GaugeBand[];

  /**
   * Value the dial ends at.
   */
  readonly ceiling: number;

  /**
   * Recharts elements rendered after the dial.
   */
  readonly children: ReactNode;

  /**
   * Palette the reading takes where its zone states none.
   */
  readonly color: Chart.ChartColor;

  /**
   * Angle the dial ends at.
   */
  readonly endAngle: number;

  /**
   * Value the dial starts at.
   */
  readonly floor: number;

  /**
   * Writes a value of the range.
   */
  readonly format: (value: unknown) => string;

  /**
   * Whether the range's ends are written under the dial.
   */
  readonly limits: boolean;

  /**
   * Value the dial fills to.
   */
  readonly reading: number;

  /**
   * Angle the dial starts at.
   */
  readonly startAngle: number;
}

/**
 * Returns a percentage in recharts' terms.
 */
function percentOf(value: number): string {
  return `${String(value)}%`;
}

/**
 * Returns the sectors of the zones' ring: each zone tinted with its palette, and the part of the
 * range no zone covers as the track.
 */
function zoneArcsOf(bands: readonly GaugeBand[]): Arc[] {
  return bands.map((band) =>
    band.uncovered
      ? { className: TRACK, span: band.to - band.from }
      : { fill: tintOf(band), span: band.to - band.from },
  );
}

/**
 * Returns the sectors of the reading's ring: the reading in its color, then the rest of the range
 * as the track, each left out while it spans nothing.
 *
 * @remarks
 *   The ring passes no sector that spans nothing, because recharts renders an empty sector group
 *   for a sector of no angle.
 */
function readingArcsOf(dial: Dial): Arc[] {
  const fill = Chart.colorOf(dial.band?.color ?? dial.color);

  return [
    { fill, span: dial.reading - dial.floor },
    { className: TRACK, span: dial.ceiling - dial.reading },
  ].filter((arc) => arc.span > 0);
}

/**
 * Returns recharts' pie chart of the dial: the zones' ring, the reading's ring, the range's ends
 * and the caller's children.
 *
 * @param dial - The range, the reading, the bands, the angles and the switches.
 */
function dialOf(dial: Dial): ReactElement {
  const angles = { endAngle: dial.endAngle, startAngle: dial.startAngle };
  const animated = dial.animate ? "auto" : false;

  return (
    <PieChart accessibilityLayer={false}>
      {dial.bands.length > 0 ? (
        <Pie
          data={zoneArcsOf(dial.bands)}
          dataKey="span"
          innerRadius={percentOf(RINGS.zones)}
          isAnimationActive={animated}
          outerRadius={percentOf(RINGS.outer)}
          paddingAngle={1}
          rootTabIndex={-1}
          {...angles}
        />
      ) : null}
      <Pie
        data={readingArcsOf(dial)}
        dataKey="span"
        innerRadius={percentOf(RINGS.inner)}
        isAnimationActive={animated}
        outerRadius={percentOf(RINGS.reading)}
        rootTabIndex={-1}
        {...angles}
      />
      {dial.limits ? (
        <GaugeLimits
          inner={RINGS.inner / 100}
          max={dial.format(dial.ceiling)}
          min={dial.format(dial.floor)}
          outer={RINGS.outer / 100}
          reading={RINGS.reading / 100}
          {...angles}
        />
      ) : null}
      {dial.children}
    </PieChart>
  );
}

/**
 * Returns the range and the reading: the minimum, 0 for one that is not a finite number; the
 * maximum, one above the minimum unless it is above it; and the value within them.
 *
 * @param min - The caller's minimum.
 * @param max - The caller's maximum.
 * @param value - The caller's value.
 */
function rangeOf(
  min: number,
  max: number,
  value: number,
): Pick<Dial, "ceiling" | "floor" | "reading"> {
  const floor = Number.isFinite(min) ? min : 0;
  const ceiling = max > floor ? max : floor + 1;

  return { ceiling, floor, reading: Math.min(ceiling, Math.max(floor, value)) };
}

/**
 * Splits the props into the dial's switches and the figure's props.
 *
 * @param props - The chart's props past the value, the range, the zones and the words.
 */
function split({
  animate = false,
  children,
  color = FIRST,
  endAngle = END,
  limits = true,
  startAngle = START,
  ...root
}: Omit<
  GaugeChartProps,
  | "caption"
  | "centerLabel"
  | "empty"
  | "label"
  | "locale"
  | "max"
  | "min"
  | "value"
  | "valueOptions"
  | "zones"
>): [
  Pick<Dial, "animate" | "children" | "color" | "endAngle" | "limits" | "startAngle">,
  Omit<RootProps, "chart" | "children">,
] {
  return [{ animate, children, color, endAngle, limits, startAngle }, root];
}

/**
 * Renders the chart's figure around the meter, the figure and zone in its middle, and the caption.
 *
 * @param props - The value and its range, the zones, the words, the switches and the figure's
 *   props.
 */
export function GaugeChart({
  caption,
  centerLabel,
  empty = EMPTY,
  label,
  locale,
  max,
  min = 0,
  ratio = "square",
  value,
  valueOptions,
  zones = NONE,
  ...rest
}: GaugeChartProps): ReactElement {
  const [switches, root] = split(rest);
  const range = rangeOf(min, max, value);
  const chart = Chart.useChart({ data: Number.isFinite(value) ? [value] : [], locale, series: [] });
  const bands = zones.length > 0 ? gaugeBands(zones, range.floor, range.ceiling) : [];
  const band = gaugeBandAt(bands, range.reading);
  const format = chart.formatNumber(valueOptions);

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot
        aria-label={label}
        aria-valuemax={range.ceiling}
        aria-valuemin={range.floor}
        aria-valuenow={range.reading}
        aria-valuetext={zonedText(format(value), band)}
        center={format(value)}
        centerLabel={centerLabel ?? band?.label}
        // eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- a meter element renders none of its children, and the dial is the plot's content
        role="meter"
      >
        {dialOf({ ...switches, ...range, band, bands, format })}
      </Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
