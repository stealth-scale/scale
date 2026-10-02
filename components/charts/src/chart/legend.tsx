/**
 * Renders the chart's legend: a button per series, which shows or hides the series.
 *
 * @remarks
 *   The legend renders outside the plot, so switching a series does not resize the chart. Every
 *   button is in the tab order and reports `aria-pressed`. A plain press switches one series and
 *   never hides the last one shown. A press with Ctrl or Cmd shows the pressed series alone, and a
 *   second one shows every series again. The pointer or focus on a button points the chart at its
 *   series, which fades every other series' marks. A hidden series' name is struck through and its
 *   swatch faded. Each swatch is the data package's `ColorSwatch`, hidden from assistive
 *   technology because the name beside it is what a screen reader reads. The group is a `fieldset`
 *   named by `label`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { ColorSwatch } from "@stealthscale/component-data";

import { withContext } from "#chart/context.ts";
import { useChartContext } from "#chart/use-chart.ts";

/**
 * Renders the `fieldset` with the chart's legend class.
 */
const Group = withContext("fieldset", "legend");

/**
 * Renders a `button` with the chart's item class.
 */
const Item = withContext("button", "item");

/**
 * Describes the props of the legend: its name and the props of a `fieldset`.
 */
export interface LegendProps extends ComponentProps<typeof Group> {
  /**
   * Name of the group of buttons, read before the first one.
   */
  readonly label?: string | undefined;
}

/**
 * Renders a button per series with its swatch and name, in the order of the series.
 *
 * @param props - The group's name and the props of a `fieldset`.
 */
export function Legend({ label = "Series", ...props }: LegendProps): ReactElement {
  const chart = useChartContext();

  return (
    <Group aria-label={label} {...props}>
      {chart.series.map((series) => (
        <Item
          aria-pressed={!series.hidden}
          key={series.key}
          onBlur={() => {
            chart.highlight();
          }}
          onClick={(event) => {
            chart.press(series.key, event.ctrlKey || event.metaKey);
          }}
          onFocus={() => {
            chart.highlight(series.key);
          }}
          onPointerEnter={() => {
            chart.highlight(series.key);
          }}
          onPointerLeave={() => {
            chart.highlight();
          }}
          type="button"
        >
          <ColorSwatch aria-hidden size="xs" value={series.color} />
          {series.label}
        </Item>
      ))}
    </Group>
  );
}
