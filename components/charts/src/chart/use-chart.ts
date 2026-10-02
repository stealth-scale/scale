/**
 * Resolves the state every part of a chart reads, and provides it through a context.
 *
 * @remarks
 *   The state is the rows, each series with its color, the keys the legend hides, the series the
 *   legend points at, and formatters in the chart's locale.
 */

import { type ReactNode, use, useState } from "react";

import { createRequiredContext, useControllableState } from "@stealthscale/hooks";
import { LocaleContext } from "@stealthscale/provider-locale";

import { type ChartColor, colorAt, inkedOf } from "#chart/colors.ts";
import { dateFormatter, numberFormatter } from "#chart/format.ts";
import { isolated, toggled } from "#chart/hidden.ts";
import { FADED } from "#chart/recipe.ts";

/**
 * Describes a series the caller states.
 */
export interface SeriesOptions {
  /**
   * Palette the series takes its color from. The theme's series color at its position unless
   * stated.
   */
  readonly color?: ChartColor | undefined;

  /**
   * Share of the ink, `fg`, in percent, the series' color mixes in: 0 keeps the color, 100 is the
   * ink. The mix keeps 3:1 or more against the page. None unless stated.
   */
  readonly ink?: number | undefined;

  /**
   * Field of each row the series reads, which a recharts mark takes as its `dataKey`.
   */
  readonly key: string;

  /**
   * Name the tooltip and the legend show. The key unless stated.
   */
  readonly label?: ReactNode | undefined;
}

/**
 * Describes a series as the chart resolved it.
 */
export interface Series {
  /**
   * CSS value of the series' color, which a mark takes as its `stroke` or `fill`.
   */
  readonly color: string;

  /**
   * Whether the legend hides the series. A mark takes it as `hide`.
   */
  readonly hidden: boolean;

  /**
   * Field of each row the series reads.
   */
  readonly key: string;

  /**
   * Name the tooltip and the legend show.
   */
  readonly label: ReactNode;

  /**
   * CSS value of the series' opacity, which a mark takes as `opacity`: the recipe's faded opacity
   * while the legend points at another series, else 1.
   */
  readonly opacity: string;
}

/**
 * Describes what `useChart` takes.
 *
 * @typeParam Row - One row of the data.
 */
export interface ChartOptions<Row> {
  /**
   * Rows the chart plots, in order. The array passes to recharts as it is.
   */
  readonly data: Row[];

  /**
   * Keys of the series hidden when the chart first renders, for the uncontrolled case.
   */
  readonly defaultHiddenKeys?: readonly string[] | undefined;

  /**
   * Keys of the series the legend hides, where the caller controls them.
   */
  readonly hiddenKeys?: readonly string[] | undefined;

  /**
   * Locale the values are written in. The locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Called with every key hidden after a press in the legend.
   */
  readonly onHiddenKeysChange?: ((hidden: readonly string[]) => void) | undefined;

  /**
   * Series the chart plots, in the order the legend lists them.
   */
  readonly series: readonly SeriesOptions[];
}

/**
 * Describes what `useChart` returns, which `Chart.Root` hands to the parts.
 *
 * @typeParam Row - One row of the data.
 */
export interface ChartApi<Row = unknown> {
  /**
   * Returns the CSS value of a series' color, or `currentColor` for a key no series has.
   */
  readonly color: (key: string) => string;

  /**
   * Rows the chart plots, the array the caller passed, which a recharts chart takes as `data`.
   */
  readonly data: Row[];

  /**
   * Returns a function that writes an instant in the chart's locale.
   */
  readonly formatDate: (options?: Intl.DateTimeFormatOptions) => (value: unknown) => string;

  /**
   * Returns a function that writes a number in the chart's locale.
   */
  readonly formatNumber: (options?: Intl.NumberFormatOptions) => (value: unknown) => string;

  /**
   * Returns whether the legend hides a series.
   */
  readonly hidden: (key: string) => boolean;

  /**
   * Points the legend at a series, or at none without a key. The pointer and focus on a legend
   * item call it.
   */
  readonly highlight: (key?: string) => void;

  /**
   * Key of the series the legend points at. Every other series' `opacity` is the faded one.
   */
  readonly highlighted: string | undefined;

  /**
   * Locale the chart writes in: `locale`, else the nearest `LocaleProvider`'s, else the runtime's.
   */
  readonly locale: string;

  /**
   * Returns the CSS value of a series' opacity, which a mark takes as `opacity`, or 1 for a key no
   * series has.
   */
  readonly opacity: (key: string) => string;

  /**
   * Hides or shows series after a press in the legend: the pressed series switched for a plain
   * press, the pressed series alone for a press with Ctrl or Cmd.
   */
  readonly press: (key: string, alone: boolean) => void;

  /**
   * Series as the chart resolved them, in order.
   */
  readonly series: readonly Series[];
}

/**
 * Provides the chart to its parts, and reads it in a part.
 */
export const [ChartProvider, useChartContext] = createRequiredContext<ChartApi>("Chart");

/**
 * Returns a chart's rows, resolved series and formatters, with the hidden series in state.
 *
 * @remarks
 *   A caller controls the hidden keys through `hiddenKeys` and `onHiddenKeysChange`. Without them
 *   the hook keeps the keys in state, starting from `defaultHiddenKeys`. The locale is `locale`,
 *   else the nearest `LocaleProvider`'s, else the runtime's.
 * @typeParam Row - One row of the data.
 */
export function useChart<Row>(options: ChartOptions<Row>): ChartApi<Row> {
  const scoped = use(LocaleContext);
  const locale =
    options.locale ?? scoped?.locale ?? new Intl.NumberFormat().resolvedOptions().locale;
  const [hidden, setHidden] = useControllableState<readonly string[]>({
    defaultValue: options.defaultHiddenKeys ?? [],
    onChange: options.onHiddenKeysChange,
    value: options.hiddenKeys,
  });
  const [highlighted, setHighlighted] = useState<string>();
  const keys = options.series.map((each) => each.key);
  const series = options.series.map((each, index) => ({
    color: inkedOf(colorAt(each.color, index), each.ink),
    hidden: hidden.includes(each.key),
    key: each.key,
    label: each.label ?? each.key,
    opacity: highlighted === undefined || highlighted === each.key ? "1" : `var(${FADED})`,
  }));

  return {
    color: (key) => series.find((each) => each.key === key)?.color ?? "currentColor",
    data: options.data,
    formatDate: (format) => dateFormatter(locale, format),
    formatNumber: (format) => numberFormatter(locale, format),
    hidden: (key) => hidden.includes(key),
    highlight: (key) => {
      setHighlighted(key);
    },
    highlighted,
    locale,
    opacity: (key) => series.find((each) => each.key === key)?.opacity ?? "1",
    press: (key, alone) => {
      setHidden((alone ? isolated : toggled)(hidden, key, keys));
    },
    series,
  };
}
