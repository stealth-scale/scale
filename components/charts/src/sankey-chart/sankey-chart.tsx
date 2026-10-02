/**
 * Renders a sankey chart: flows between the stages of a process as bands whose widths follow their
 * values, such as a month's visitors by channel, then by what they did.
 *
 * @remarks
 *   Each node is a bar as tall as the larger of what enters it and what leaves it, in its color,
 *   with its name beside it, and each flow is a band in its source's color from one bar to the
 *   next. Recharts places each node in a column by the longest path to it, and a node that sends
 *   nothing in the last column. A flow is rendered between two known nodes with a finite value
 *   above zero that closes no loop. The tooltip at a flow lifts it, and at a node lifts every flow
 *   of the node, while the other marks fade. The tooltip writes a node's inflow and outflow, and a
 *   flow's value and its share of what its source sends. Recharts' sankey takes focus and ignores
 *   every key, so the chart walks its marks: each node in the caller's order, then the flows it
 *   sends.
 */

import { type ReactElement, type ReactNode } from "react";

import { Sankey, Tooltip } from "recharts";

import * as Chart from "#chart/index.ts";
import { useWalk } from "#chart/walk.ts";
import { type HierarchyWriters, writersOf } from "#hierarchy/facts.ts";
import { Flow } from "#sankey-chart/flow.tsx";
import { type SankeyFlow, type SankeyNode } from "#sankey-chart/flows.ts";
import { type Graph, graphOf } from "#sankey-chart/graph.ts";
import { Node } from "#sankey-chart/node.tsx";
import { type FlowWords, tooltipOf, WORDS } from "#sankey-chart/tooltip.ts";

/**
 * Message the chart renders without a flow to render unless it states one.
 */
const EMPTY = "No data";

/**
 * Width of a node's bar, in pixels.
 */
const BAR = 10;

/**
 * Space between two bars of a column, in pixels: more than a line of words, so a name never meets
 * the name of the bar above or below.
 */
const SPACE = 24;

/**
 * Describes the props of a sankey chart: the nodes and the flows, the words, the switches and the
 * figure's props.
 */
export interface SankeyChartProps extends Omit<Chart.RootProps, "chart" | "children"> {
  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the marks.
   */
  readonly children?: ReactNode;

  /**
   * Place in the keyboard walk of the mark the tooltip shows when the chart first renders: each
   * node in the caller's order, then the flows it sends. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while it has no flow to render.
   */
  readonly empty?: ReactNode;

  /**
   * Flows between the nodes, by key, in any order.
   */
  readonly flows: readonly SankeyFlow[];

  /**
   * Name of what flows into a node in the tooltip. "In" unless stated.
   */
  readonly inflowLabel?: string | undefined;

  /**
   * Accessible name of the chart's keyboard layer, such as "Visitors by channel and outcome".
   */
  readonly label: string;

  /**
   * Locale the values are written in. The locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Nodes the flows name, in the order the walk visits them and the series colors take.
   */
  readonly nodes: readonly SankeyNode[];

  /**
   * Name of what flows out of a node in the tooltip. "Out" unless stated.
   */
  readonly outflowLabel?: string | undefined;

  /**
   * Name of a flow's share of what its source sends in the tooltip. "Of source" unless stated.
   */
  readonly shareLabel?: string | undefined;

  /**
   * Name of a flow's value in the tooltip. "Value" unless stated.
   */
  readonly valueLabel?: string | undefined;

  /**
   * `Intl.NumberFormatOptions` the values are written with, beside the nodes and in the tooltip.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Whether each node writes its value under its name where its bar is two lines tall.
   */
  readonly values?: boolean | undefined;
}

/**
 * Describes what the recharts sankey is built from.
 */
interface PlotOptions {
  /**
   * Recharts elements rendered after the marks.
   */
  readonly children: ReactNode;

  /**
   * Returns the CSS value of a node's color by its key.
   */
  readonly colorOf: (key: string) => string;

  /**
   * Place in the walk of the mark the tooltip shows on the first render.
   */
  readonly defaultIndex: number | undefined;

  /**
   * The nodes and the flows resolved for recharts.
   */
  readonly graph: Graph;

  /**
   * Accessible name of the chart's keyboard layer.
   */
  readonly label: string;

  /**
   * Whether each node writes its value under its name.
   */
  readonly values: boolean;

  /**
   * Words the tooltip's rows are named by.
   */
  readonly words: FlowWords;

  /**
   * Functions that write the numbers.
   */
  readonly writers: HierarchyWriters;
}

/**
 * Returns recharts' sankey of the graph, with the tooltip and the caller's children.
 *
 * @param options - The graph, the colors, the writers, the words and the switches.
 */
function plotOf(options: PlotOptions): ReactElement {
  const { colorOf, defaultIndex: initial, graph, writers } = options;

  /**
   * Writes a node's value.
   */
  const detail = (value: number): string => writers.formatValue(value);

  return (
    <Sankey
      data={graph.data}
      link={<Flow colorOf={colorOf} initial={initial} views={graph.flows} />}
      node={
        <Node
          colorOf={colorOf}
          detail={options.values ? detail : undefined}
          initial={initial}
          views={graph.nodes}
        />
      }
      nodePadding={SPACE}
      nodeWidth={BAR}
      title={options.label}
    >
      <Tooltip
        content={
          <Chart.Tooltip {...tooltipOf({ facts: graph.facts, words: options.words, writers })} />
        }
      />
      {options.children}
    </Sankey>
  );
}

/**
 * Splits the props into the plot's switches and the figure's props.
 *
 * @param props - The chart's props past the nodes, the flows and the words.
 */
function split({
  children,
  defaultIndex,
  label,
  values = true,
  ...root
}: Omit<
  SankeyChartProps,
  | "caption"
  | "empty"
  | "flows"
  | "inflowLabel"
  | "locale"
  | "nodes"
  | "outflowLabel"
  | "shareLabel"
  | "valueLabel"
  | "valueOptions"
>): [
  Pick<PlotOptions, "children" | "defaultIndex" | "label" | "values">,
  Omit<Chart.RootProps, "chart" | "children">,
] {
  return [{ children, defaultIndex, label, values }, root];
}

/**
 * Renders the chart's figure around the sankey and the caption.
 *
 * @param props - The nodes, the flows, the words, the switches and the figure's props.
 */
export function SankeyChart({
  caption,
  empty = EMPTY,
  flows,
  inflowLabel = WORDS.inflow,
  locale,
  nodes,
  outflowLabel = WORDS.outflow,
  ratio = "video",
  shareLabel = WORDS.share,
  valueLabel = WORDS.value,
  valueOptions,
  ...rest
}: SankeyChartProps): ReactElement {
  const [plot, root] = split(rest);
  const graph = graphOf(nodes, flows);
  const chart = Chart.useChart({
    data: graph.flows,
    locale,
    series: graph.nodes.map((node) => ({ color: node.color, key: node.key, label: node.title })),
  });
  const words = {
    inflow: inflowLabel,
    outflow: outflowLabel,
    share: shareLabel,
    value: valueLabel,
  };
  const writers = writersOf(chart, valueOptions);
  const walk = useWalk();

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot {...walk}>
        {plotOf({ ...plot, colorOf: chart.color, graph, words, writers })}
      </Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
