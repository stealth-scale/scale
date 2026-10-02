/**
 * Renders one flow of a sankey, which recharts clones with the flow's geometry: a band from its
 * source's bar to its target's in its source's color, as wide as its value.
 *
 * @remarks
 *   The band is recharts' own curve, a stroke at least 1px wide. It has `data-walk` with its place
 *   in the keyboard walk, and `data-trace` "lit" while the tooltip is at the flow or at one of its
 *   nodes and "dimmed" while it is at another mark, which the recipe renders. The flow at the
 *   chart's initial place opens the tooltip at itself.
 */

import { type ReactElement, useRef } from "react";

import { useActiveTooltipDataPoints } from "recharts";

import { FLOW } from "#chart/recipe.ts";
import { useOpened } from "#chart/walk.ts";
import { type FlowView, nameOf } from "#sankey-chart/graph.ts";

/**
 * Describes what a flow receives: the geometry and the index recharts passes, and the views, the
 * colors and the initial place the chart passes.
 */
export interface FlowProps {
  /**
   * Returns the CSS value of a node's color by its key.
   */
  readonly colorOf: (key: string) => string;

  /**
   * Index of the flow in recharts' links.
   */
  readonly index?: number | undefined;

  /**
   * Place in the walk of the mark the tooltip opens at when the chart first renders, if any.
   */
  readonly initial?: number | undefined;

  /**
   * Width of the band, in pixels.
   */
  readonly linkWidth?: number | undefined;

  /**
   * Horizontal position of the curve's control point at the source, in pixels.
   */
  readonly sourceControlX?: number | undefined;

  /**
   * Horizontal position of the band's start, at the source's bar, in pixels.
   */
  readonly sourceX?: number | undefined;

  /**
   * Vertical position of the band's middle at its start, in pixels.
   */
  readonly sourceY?: number | undefined;

  /**
   * Horizontal position of the curve's control point at the target, in pixels.
   */
  readonly targetControlX?: number | undefined;

  /**
   * Horizontal position of the band's end, at the target's bar, in pixels.
   */
  readonly targetX?: number | undefined;

  /**
   * Vertical position of the band's middle at its end, in pixels.
   */
  readonly targetY?: number | undefined;

  /**
   * Views of the flows in recharts' order.
   */
  readonly views: readonly FlowView[];
}

/**
 * Describes the mark the tooltip is at, as recharts reports it.
 */
interface Reported {
  /**
   * Name recharts reports for the mark: a node's key, or a flow's two keys joined by " - ".
   */
  readonly name?: string;
}

/**
 * Returns recharts' curve of a flow: from its start to its end through two control points at the
 * heights of its ends.
 */
function pathOf(props: FlowProps): string {
  const { sourceControlX = 0, sourceX = 0, sourceY = 0 } = props;
  const { targetControlX = 0, targetX = 0, targetY = 0 } = props;

  return `M${String(sourceX)},${String(sourceY)}C${String(sourceControlX)},${String(sourceY)} ${String(targetControlX)},${String(targetY)} ${String(targetX)},${String(targetY)}`;
}

/**
 * Returns a flow's trace: "lit" while the tooltip is at the flow or at one of its nodes, "dimmed"
 * while it is at another mark, and none while it is at no mark.
 */
function traceOf(reported: string | undefined, view: FlowView): "dimmed" | "lit" | undefined {
  if (reported === undefined) return undefined;

  return [nameOf(view.from, view.to), view.from, view.to].includes(reported) ? "lit" : "dimmed";
}

/**
 * Renders the flow's band, or nothing for an index the chart has no view of.
 *
 * @param props - The flow's geometry and index, and the chart's views and colors.
 */
export function Flow(props: FlowProps): null | ReactElement {
  const band = useRef<SVGPathElement>(null);
  const view = props.views[props.index ?? -1];
  const reported = useActiveTooltipDataPoints<Reported>()?.[0]?.name;

  useOpened(band, view !== undefined && view.walk === props.initial);

  if (view === undefined) return null;

  return (
    <path
      className={FLOW}
      d={pathOf(props)}
      data-trace={traceOf(reported, view)}
      data-walk={view.walk}
      fill="none"
      ref={band}
      stroke={props.colorOf(view.from)}
      strokeWidth={Math.max(props.linkWidth ?? 0, 1)}
    />
  );
}
