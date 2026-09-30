/**
 * Renders a treemap chart: a hierarchy of parts as nested tiles whose areas follow their sizes,
 * such as spend by team and then by service.
 *
 * @remarks
 *   Each top-level node is a family of tiles in one hue, its largest part the strongest, and the
 *   legend lists each family with its total. An area is read less precisely than a length, so each
 *   tile that fits writes its name, its value and its share of the whole, and the tooltip writes
 *   every tile's name. Each level runs largest first from the top left. A node the legend hides
 *   leaves the layout, and each share is of the nodes shown. Recharts gives a treemap no keyboard
 *   layer, so the chart walks its tiles: the arrows step through them depth first, a parent before
 *   its parts, and each step opens the tooltip at the tile.
 */

import { type ReactElement, type ReactNode } from "react";

import { Tooltip, Treemap } from "recharts";

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
import { Tile } from "#treemap-chart/tile.tsx";
import { tilesOf, type Tiling } from "#treemap-chart/tiles.ts";

/**
 * Message the chart renders without nodes unless it states one.
 */
const EMPTY = "No data";

/**
 * Space between two tiles, in pixels, where the panel shows.
 */
const GAP = 2;

/**
 * Describes the props of a treemap chart: a hierarchy chart's props.
 */
export type TreemapChartProps = HierarchyProps;

/**
 * Describes what the recharts treemap is built from.
 */
interface PlotOptions {
  /**
   * Whether the tiles slide in.
   */
  readonly animate: boolean;

  /**
   * Recharts elements rendered after the tiles.
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
   * The nodes the legend shows, resolved into tiles.
   */
  readonly tiling: Tiling;

  /**
   * Whether each tile writes its value and share.
   */
  readonly values: boolean;

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
 * Returns recharts' treemap of the tiles, with the tooltip and the caller's children.
 *
 * @remarks
 *   Recharts' treemap passes `role`, `tabIndex` and `aria-label` to its `svg`, which is the chart's
 *   one tab stop, but its props type none of them, so they arrive in a spread.
 * @param options - The tiles, the writers, the words and the switches.
 */
function plotOf(options: PlotOptions): ReactElement {
  const { tiling, writers } = options;
  const surface = { "aria-label": options.label, role: "application", tabIndex: 0 };

  /**
   * Writes a tile's value and share of the nodes shown.
   */
  const detail = (size: number): string =>
    `${writers.formatValue(size)} · ${writers.formatShare(size / tiling.total)}`;

  return (
    <Treemap
      {...surface}
      content={
        <Tile
          {...omitUndefined({
            detail: options.values ? detail : undefined,
            initial: options.defaultIndex,
          })}
        />
      }
      data={tiling.tiles}
      dataKey="size"
      isAnimationActive={options.animate ? "auto" : false}
      nameKey="name"
      nodeGap={GAP}
    >
      <Tooltip content={<Chart.Tooltip {...tooltipOf({ ...tiling, ...options })} />} />
      {options.children}
    </Treemap>
  );
}

/**
 * Splits the props into the plot's switches and the figure's props.
 *
 * @param props - The chart's props past the nodes, the words and the legend.
 */
function split({
  animate = false,
  children,
  defaultIndex,
  label,
  ...root
}: Omit<
  TreemapChartProps,
  | "caption"
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
 * Renders the chart's figure around the tiles, the legend and the caption.
 *
 * @param props - The nodes, the words, the switches and the figure's props.
 */
export function TreemapChart({
  caption,
  defaultHiddenKeys,
  empty = EMPTY,
  hiddenKeys,
  legend = true,
  legendLabel,
  locale,
  nodes,
  onHiddenKeysChange,
  ratio = "video",
  shareLabel = WORDS.share,
  valueLabel = WORDS.value,
  valueOptions,
  values = true,
  ...rest
}: TreemapChartProps): ReactElement {
  const [plot, root] = split(rest);
  const { series, top } = familiesOf(nodes, values, valueOptions);
  const options = { defaultHiddenKeys, hiddenKeys, locale, onHiddenKeysChange, series };
  const chart = Chart.useChart({ data: top, ...options });
  const tiling = tilesOf(
    top.filter((node) => !chart.hidden(node.key)),
    (key) => ({ color: chart.color(key), opacity: chart.opacity(key) }),
  );
  const words = { share: shareLabel, value: valueLabel };
  const writers = writersOf(chart, valueOptions);
  const walk = useWalk();

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot {...walk}>{plotOf({ ...plot, tiling, values, words, writers })}</Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {legend && top.length > 0 ? <Chart.Legend label={legendLabel} /> : null}
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
