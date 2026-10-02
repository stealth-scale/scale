/**
 * Renders a chord diagram: flows between peers around a circle, each node an arc as long as what it
 * sends and each pair of nodes one ribbon whose ends are as wide as the two directions, such as
 * calls between services.
 *
 * @remarks
 *   A chord diagram shows the flows a sankey leaves out: flows both ways between two nodes, and
 *   flows around a loop. It takes the sankey's nodes and flows. A ribbon is wider at the node that
 *   sends more and takes that node's color, so its color is the pair's net direction. The readout
 *   in the middle of the ring writes what an arc's node sends and receives, and both directions of
 *   a ribbon. Recharts' `PieChart` hosts the diagram: it sizes the plot, and its `svg` is the
 *   chart's one tab stop, named by `label`. The arrow keys walk each arc, then the ribbons that
 *   start on it.
 */

import { type ReactElement, type ReactNode } from "react";

import { PieChart } from "recharts";

import * as Chart from "#chart/index.ts";
import { useWalk } from "#chart/walk.ts";
import { Chords } from "#chord-diagram/chords.tsx";
import { marksOf } from "#chord-diagram/marks.ts";
import { writersOf } from "#hierarchy/facts.ts";
import { type SankeyFlow, type SankeyNode } from "#sankey-chart/flows.ts";
import { WORDS } from "#sankey-chart/tooltip.ts";

/**
 * Message the chart renders without a flow to render unless it states one.
 */
const EMPTY = "No data";

/**
 * Describes the props of a chord diagram: the nodes and the flows, the words and the figure's
 * props.
 */
export interface ChordDiagramProps extends Omit<Chart.RootProps, "chart" | "children"> {
  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the marks.
   */
  readonly children?: ReactNode;

  /**
   * Place in the keyboard walk of the mark the readout shows when the chart first renders: each arc
   * in the nodes' order, then the ribbons that start on it. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while it has no flow to render.
   */
  readonly empty?: ReactNode;

  /**
   * Flows between the nodes, by key, in any order: both ways between two nodes, and from a node to
   * itself.
   */
  readonly flows: readonly SankeyFlow[];

  /**
   * Name of what flows into a node in the readout. "In" unless stated.
   */
  readonly inflowLabel?: string | undefined;

  /**
   * Accessible name of the chart's keyboard layer, such as "Calls between services".
   */
  readonly label: string;

  /**
   * Locale the amounts are written in. The locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Nodes the flows name, in the order their arcs follow each other clockwise from 12 o'clock and
   * the series colors take.
   */
  readonly nodes: readonly SankeyNode[];

  /**
   * Name of what flows out of a node in the readout. "Out" unless stated.
   */
  readonly outflowLabel?: string | undefined;

  /**
   * `Intl.NumberFormatOptions` the amounts are written with in the readout.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;
}

/**
 * Renders the chart's figure around the diagram and the caption.
 *
 * @param props - The nodes, the flows, the words and the figure's props.
 */
export function ChordDiagram({
  caption,
  children,
  defaultIndex,
  empty = EMPTY,
  flows,
  inflowLabel = WORDS.inflow,
  label,
  locale,
  nodes,
  outflowLabel = WORDS.outflow,
  ratio = "square",
  valueOptions,
  ...root
}: ChordDiagramProps): ReactElement {
  const marks = marksOf(nodes, flows);
  const chart = Chart.useChart({
    data: marks,
    locale,
    series: marks.flatMap((mark) =>
      mark.kind === "arc" ? [{ color: mark.color, key: mark.group.key, label: mark.title }] : [],
    ),
  });
  const walk = useWalk();

  return (
    <Chart.Root chart={chart} ratio={ratio} {...root}>
      <Chart.Plot {...walk}>
        <PieChart title={label}>
          <Chords
            colorOf={chart.color}
            initial={defaultIndex}
            marks={marks}
            words={{ inflow: inflowLabel, outflow: outflowLabel }}
            write={writersOf(chart, valueOptions).formatValue}
          />
          {children}
        </PieChart>
      </Chart.Plot>
      <Chart.Empty>{empty}</Chart.Empty>
      {caption === undefined ? null : <Chart.Caption>{caption}</Chart.Caption>}
    </Chart.Root>
  );
}
