/**
 * Renders a sunburst chart: a hierarchy of parts as rings around a middle, each part's arc as long
 * as its share of the whole and inside its parent's arc, such as spend by team, then by service.
 *
 * @remarks
 *   The rings run from the middle out, one per level. Each top-level node is a family of arcs in
 *   one hue, and each ring is paler than the ring inside it, so a part never takes its parent's
 *   color. The arcs start at 12 o'clock and run clockwise, largest first at every level. An arc is
 *   read less precisely than a length, so no arc is labelled: the tooltip writes a node's name, its
 *   value and its share of the whole, and the legend lists each family with its total. A node the
 *   legend hides leaves the rings, and each share is of the nodes shown. Recharts gives the rings
 *   no keyboard layer, so the chart walks its arcs: the arrows step through them depth first, a
 *   parent before its parts, and each step opens the tooltip at the arc.
 */

import { type ReactElement, type ReactNode } from "react";

import { Pie, PieChart, Tooltip } from "recharts";

import { omitUndefined } from "@stealthscale/hooks";

import * as Chart from "#chart/index.ts";
import { useWalk } from "#chart/walk.ts";
import {
  type HierarchyWords,
  type HierarchyWriters,
  tooltipOf,
  WORDS,
  writersOf,
} from "#hierarchy/facts.ts";
import { familiesOf } from "#hierarchy/series.tsx";
import { type HierarchyProps } from "#hierarchy/types.ts";
import { Arc } from "#sunburst-chart/arc.tsx";
import { type Rings, ringsOf } from "#sunburst-chart/rings.ts";

/**
 * Message the chart renders without nodes unless it states one.
 */
const EMPTY = "No data";

/**
 * Radius of the hole, in percent of the largest radius the plot has room for: 56px in a room 20rem
 * wide, which fits a figure such as "€114,500" and the words under it.
 */
const HOLE = 36;

/**
 * Radius of the outer ring's edge, in percent of the largest radius the plot has room for.
 */
const OUTER = 96;

/**
 * Describes the props of a sunburst chart: a hierarchy chart's props and the content of the hole.
 */
export interface SunburstChartProps extends HierarchyProps {
  /**
   * Figure in the hole, such as the total the top-level nodes add up to.
   */
  readonly center?: ReactNode;

  /**
   * Words under the figure, such as what the total counts.
   */
  readonly centerLabel?: ReactNode;
}

/**
 * Describes what the recharts rings are built from.
 */
interface PlotOptions {
  /**
   * Whether the arcs sweep in.
   */
  readonly animate: boolean;

  /**
   * Recharts elements rendered after the rings.
   */
  readonly children: ReactNode;

  /**
   * Place in the walk of the node the tooltip shows on the first render.
   */
  readonly defaultIndex: number | undefined;

  /**
   * Accessible name of the chart's keyboard layer.
   */
  readonly label: string;

  /**
   * The nodes the legend shows, resolved into rings.
   */
  readonly rings: Rings;

  /**
   * Words the tooltip's rows are named by.
   */
  readonly words: HierarchyWords;

  /**
   * Functions that write the numbers.
   */
  readonly writers: HierarchyWriters;
}

/**
 * Returns a percentage in recharts' terms.
 */
function percentOf(value: number): string {
  return `${String(value)}%`;
}

/**
 * Returns recharts' pie chart of the rings, a pie per ring from the hole out, with the tooltip and
 * the caller's children.
 *
 * @remarks
 *   The rings split the room between the hole and the outer edge evenly. Each pie's own tab stop is
 *   off, so the chart's `svg` is its one tab stop.
 * @param options - The rings, the writers, the words and the switches.
 */
function plotOf(options: PlotOptions): ReactElement {
  const { rings } = options.rings;
  const band = (OUTER - HOLE) / rings.length;
  const shape = <Arc {...omitUndefined({ initial: options.defaultIndex })} />;

  return (
    <PieChart accessibilityLayer title={options.label}>
      {rings.map((ring, depth) => (
        <Pie
          data={ring}
          dataKey="value"
          endAngle={-270}
          innerRadius={percentOf(HOLE + band * depth)}
          isAnimationActive={options.animate ? "auto" : false}
          // eslint-disable-next-line react/no-array-index-key -- a ring is its depth, which never moves
          key={depth}
          nameKey="name"
          outerRadius={percentOf(HOLE + band * (depth + 1))}
          rootTabIndex={-1}
          shape={shape}
          startAngle={90}
        />
      ))}
      <Tooltip content={<Chart.Tooltip {...tooltipOf({ ...options.rings, ...options })} />} />
      {options.children}
    </PieChart>
  );
}

/**
 * Splits the props into the plot's switches and the figure's props.
 *
 * @param props - The chart's props past the nodes, the words, the hole and the legend.
 */
function split({
  animate = false,
  children,
  defaultIndex,
  label,
  ...root
}: Omit<
  SunburstChartProps,
  | "caption"
  | "center"
  | "centerLabel"
  | "defaultHiddenKeys"
  | "empty"
  | "hiddenKeys"
  | "legend"
  | "legendLabel"
  | "locale"
  | "nodes"
  | "onHiddenKeysChange"
  | "shareLabel"
  | "valueLabel"
  | "valueOptions"
  | "values"
>): [
  Pick<PlotOptions, "animate" | "children" | "defaultIndex" | "label">,
  Omit<Chart.RootProps, "chart" | "children">,
] {
  return [{ animate, children, defaultIndex, label }, root];
}

/**
 * Renders the chart's figure around the rings, the figure in the hole, the legend and the caption.
 *
 * @param props - The nodes, the words, the switches, the content of the hole and the figure's
 *   props.
 */
export function SunburstChart({
  caption,
  center,
  centerLabel,
  defaultHiddenKeys,
  empty = EMPTY,
  hiddenKeys,
  legend = true,
  legendLabel,
  locale,
  nodes,
  onHiddenKeysChange,
  ratio = "square",
  shareLabel = WORDS.share,
  valueLabel = WORDS.value,
  valueOptions,
  values = true,
  ...rest
}: SunburstChartProps): ReactElement {
  const [plot, root] = split(rest);
  const { series, top } = familiesOf(nodes, values, valueOptions);
  const options = { defaultHiddenKeys, hiddenKeys, locale, onHiddenKeysChange, series };
  const chart = Chart.useChart({ data: top, ...options });
  const rings = ringsOf(
    top.filter((node) => !chart.hidden(node.key)),
    (key) => ({ color: chart.color(key), opacity: chart.opacity(key) }),
  );
  const words = { share: shareLabel, value: valueLabel };
  const writers = writersOf(chart, valueOptions);
  const walk = useWalk();

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot {...walk} {...omitUndefined({ center, centerLabel })}>
        {plotOf({ ...plot, rings, words, writers })}
      </Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legend && top.length > 0 ? <Chart.Legend label={legendLabel} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
