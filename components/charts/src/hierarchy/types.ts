/**
 * Describes the props a hierarchy chart takes: the nodes, the words, the switches and the figure's
 * props.
 */

import { type ReactNode } from "react";

import { type RootProps } from "#chart/root.tsx";
import { type ChartOptions } from "#chart/use-chart.ts";
import { type HierarchyNode } from "#hierarchy/hierarchy.ts";

/**
 * Describes the props the treemap and the sunburst take.
 */
export interface HierarchyProps
  extends
    Omit<ChartOptions<HierarchyNode>, "data" | "series">,
    Omit<RootProps, "chart" | "children"> {
  /**
   * Whether the marks grow in, which they do only outside reduced motion.
   */
  readonly animate?: boolean | undefined;

  /**
   * Finding the chart shows, in words, which names the figure.
   */
  readonly caption?: ReactNode;

  /**
   * Recharts elements rendered inside the chart after the marks.
   */
  readonly children?: ReactNode;

  /**
   * Place in the keyboard walk of the node the tooltip shows when the chart first renders: depth
   * first, largest first, a parent before its parts. None unless stated.
   */
  readonly defaultIndex?: number | undefined;

  /**
   * Message the chart renders in the plot's place while it has no nodes.
   */
  readonly empty?: ReactNode;

  /**
   * Accessible name of the chart's keyboard layer, such as "Cloud spend by team and service".
   */
  readonly label: string;

  /**
   * Whether the legend renders below the plot. It renders while the chart has nodes unless stated.
   */
  readonly legend?: boolean | undefined;

  /**
   * Accessible name of the legend's group of buttons.
   */
  readonly legendLabel?: string | undefined;

  /**
   * Top-level nodes of the hierarchy, in any order. Each level renders largest first.
   */
  readonly nodes: readonly HierarchyNode[];

  /**
   * Name of a node's share of the nodes shown in the tooltip. "Of total" unless stated.
   */
  readonly shareLabel?: string | undefined;

  /**
   * Name of a node's size in the tooltip. "Value" unless stated.
   */
  readonly valueLabel?: string | undefined;

  /**
   * `Intl.NumberFormat` options the sizes are written with, on the marks, in the legend and in the
   * tooltip.
   */
  readonly valueOptions?: Intl.NumberFormatOptions | undefined;

  /**
   * Whether the legend writes each family's total beside its name, and a treemap's tile its value
   * and share under its name.
   */
  readonly values?: boolean | undefined;
}
