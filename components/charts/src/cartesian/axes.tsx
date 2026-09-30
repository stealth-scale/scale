/**
 * Renders a cartesian preset's axes: the category axis and the value axis, which trade places for
 * bars on their side, and a second value axis at the end edge while a series reads it.
 *
 * @remarks
 *   Neither axis renders its rule or its tick marks, which compete with the grid, and each tick
 *   label is 8px from the plot. The axis beside the plot measures its widest tick label
 *   (`width="auto"`) in place of recharts' fixed 60px, which clips a currency or a long name. The
 *   category axis of bars on their side labels every bar (`interval={0}`), because recharts leaves
 *   out every second name in a 320px room, and a ranking names each row. The category axis of an
 *   upright chart keeps recharts' `preserveEnd`, the one interval that moves the last label inside
 *   the plot. The equidistant intervals require the last label to fit inside the plot, which a
 *   label centred on the plot's edge never does, and then render that label alone. A stack about
 *   a moving baseline hides its value axis, because no value reads off a band against it.
 */

import { type ReactElement } from "react";

import { XAxis, YAxis, type YAxisProps } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import { type Formats } from "#cartesian/formats.ts";
import { END } from "#cartesian/marks.tsx";
import { type Shape } from "#cartesian/types.ts";

/**
 * Props every axis takes: no rule, no tick marks, and 8px between the plot and a tick's label.
 */
export const CHROME = { axisLine: false, tickLine: false, tickMargin: 8 };

/**
 * Props every value axis takes: `CHROME` and a label at every tick.
 *
 * @remarks
 *   Recharts' grid filters the axis' ticks again on its own, and in a plot 140px tall it leaves out
 *   a line at a tick its axis labels. An axis that keeps every tick keeps a grid line at every
 *   label.
 */
export const VALUE_CHROME = { ...CHROME, interval: 0 };

/**
 * Describes the value axis at the plot's end edge.
 */
export interface EndAxis {
  /**
   * Domain of the end axis in recharts' terms, from zero unless stated.
   */
  readonly domain: YAxisProps["domain"];
}

/**
 * Describes what a preset's axes are built from.
 */
export interface AxesOptions {
  /**
   * Field of each row the category axis reads.
   */
  readonly categoryKey: string;

  /**
   * Direction the value axis runs in.
   */
  readonly direction: Shape["direction"];

  /**
   * End axis, which renders while this is stated.
   */
  readonly end?: EndAxis | undefined;

  /**
   * Formatters of the category, value and end ticks.
   */
  readonly formats: Formats;

  /**
   * Room in pixels between an upright plot's top edge and its highest value, for labels written
   * above the marks. None unless stated.
   */
  readonly headroom?: number | undefined;

  /**
   * Whether the value axis renders no ticks, for a stack about a moving baseline.
   */
  readonly hidden?: boolean | undefined;

  /**
   * Domain of the value axis, from zero unless stated.
   */
  readonly valueDomain: YAxisProps["domain"];
}

/**
 * Returns the axes of an upright chart: the category axis across the bottom, the value axis at the
 * start edge, and the end axis while one is stated.
 *
 * @param options - The category field, the formatters, the domains and the value axis' hiding.
 */
function uprightOf({
  categoryKey,
  end,
  formats,
  headroom,
  hidden,
  valueDomain,
}: AxesOptions): ReactElement[] {
  const category = omitUndefined({ dataKey: categoryKey, tickFormatter: formats.label });
  const value = omitUndefined({
    domain: valueDomain,
    padding: headroom === undefined ? undefined : { top: headroom },
    tickFormatter: formats.tick,
  });
  const ended =
    end === undefined
      ? []
      : [
          <YAxis
            {...VALUE_CHROME}
            {...omitUndefined({ domain: end.domain })}
            key="end"
            orientation="right"
            tickFormatter={formats.end}
            width="auto"
            yAxisId={END}
          />,
        ];

  return [
    <XAxis {...CHROME} {...category} key="category" />,
    <YAxis {...VALUE_CHROME} {...value} hide={hidden === true} key="value" width="auto" />,
    ...ended,
  ];
}

/**
 * Returns the category axis and the value axis, with the value axis across the bottom for bars on
 * their side, and the end axis of an upright chart while one is stated.
 *
 * @param options - The category field, the direction, the formatters and the domains.
 */
export function axesOf(options: AxesOptions): ReactElement[] {
  if (options.direction === "vertical") return uprightOf(options);

  const { categoryKey, formats, valueDomain } = options;
  const category = omitUndefined({ dataKey: categoryKey, tickFormatter: formats.label });
  const value = omitUndefined({ domain: valueDomain, tickFormatter: formats.tick });

  return [
    <XAxis {...VALUE_CHROME} {...value} key="value" type="number" />,
    <YAxis {...CHROME} {...category} interval={0} key="category" type="category" width="auto" />,
  ];
}
