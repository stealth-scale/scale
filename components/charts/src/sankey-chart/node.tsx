/**
 * Renders one node of a sankey, which recharts clones with the node's geometry: its bar in its
 * color, and beside the bar its name, with its value under the name where the bar is two lines
 * tall.
 *
 * @remarks
 *   A name is written after its bar, into the plot, except a sink's, which is written before its
 *   bar at the plot's end edge. The words take the kit's share class: the ink inside a halo in the
 *   panel's color, which reads over the flows under it and lets the pointer through. Two names that
 *   meet read as other words, so after layout a node marks its words with `data-overflow`, which
 *   the recipe hides, where a line leaves the plot's sides or meets a line a node earlier in the
 *   walk shows. The tooltip and the walk still name the node. The node's group has `data-walk` with
 *   its place in the keyboard walk, and `data-trace="dimmed"` while the tooltip is at another mark,
 *   which the recipe fades. The node at the chart's initial place opens the tooltip at itself.
 */

import { type ReactElement, useRef } from "react";

import { Rectangle, Text, useActiveTooltipDataPoints } from "recharts";

import { useCleared } from "#chart/cleared.ts";
import { NODE, SHARE } from "#chart/recipe.ts";
import { useOpened } from "#chart/walk.ts";
import { type NodeView } from "#sankey-chart/graph.ts";

/**
 * Space between a bar and its words, in pixels.
 */
const INSET = 6;

/**
 * Height of a line of the words, in pixels.
 */
const LINE = 16;

/**
 * Radius of a bar's corners, in pixels.
 */
const RADIUS = 2;

/**
 * Describes what a node receives: the geometry and the index recharts passes, and the views, the
 * colors, the writer and the initial place the chart passes.
 */
export interface NodeProps {
  /**
   * Returns the CSS value of a node's color by its key.
   */
  readonly colorOf: (key: string) => string;

  /**
   * Writes the line under the name from the node's value. No line renders without it.
   */
  readonly detail?: ((value: number) => string) | undefined;

  /**
   * Height of the bar, in pixels.
   */
  readonly height?: number | undefined;

  /**
   * Index of the node in recharts' nodes.
   */
  readonly index?: number | undefined;

  /**
   * Place in the walk of the mark the tooltip opens at when the chart first renders, if any.
   */
  readonly initial?: number | undefined;

  /**
   * Views of the nodes in recharts' order.
   */
  readonly views: readonly NodeView[];

  /**
   * Width of the bar, in pixels.
   */
  readonly width?: number | undefined;

  /**
   * Position of the bar's left edge, in pixels.
   */
  readonly x?: number | undefined;

  /**
   * Position of the bar's top edge, in pixels.
   */
  readonly y?: number | undefined;
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
 * Describes where a node's words start: the side of the bar and the text's anchor.
 */
interface Beside {
  /**
   * Anchor of the text at `x`: its end before a sink's bar, its start after any other bar.
   */
  readonly textAnchor: "end" | "start";

  /**
   * Position the text is anchored at, in pixels.
   */
  readonly x: number;
}

/**
 * Describes a node's bar as it renders: recharts' geometry, 0 where recharts passes none.
 */
interface Box {
  /**
   * Height of the bar, in pixels.
   */
  readonly height: number;

  /**
   * Width of the bar, in pixels.
   */
  readonly width: number;

  /**
   * Position of the bar's left edge, in pixels.
   */
  readonly x: number;

  /**
   * Position of the bar's top edge, in pixels.
   */
  readonly y: number;
}

/**
 * Returns the bar as it renders, with 0 where recharts passes no geometry.
 */
function boxOf(props: NodeProps): Box {
  return { height: props.height ?? 0, width: props.width ?? 0, x: props.x ?? 0, y: props.y ?? 0 };
}

/**
 * Returns where a node's words start: before a sink's bar, after any other bar.
 */
function besideOf(sink: boolean, box: Box): Beside {
  return sink
    ? { textAnchor: "end", x: box.x - INSET }
    : { textAnchor: "start", x: box.x + box.width + INSET };
}

/**
 * Returns the line under a node's name: its value where the bar is two lines tall and the chart
 * writes values, else none.
 */
function detailOf(props: NodeProps, view: NodeView | undefined, box: Box): string | undefined {
  return view !== undefined && box.height >= LINE * 2 ? props.detail?.(view.value) : undefined;
}

/**
 * Returns a node's trace: "dimmed" while the tooltip is at another mark, else none.
 */
function traceOf(reported: string | undefined, key: string): "dimmed" | undefined {
  return reported === undefined || reported === key ? undefined : "dimmed";
}

/**
 * Renders the node's bar and its words, or nothing for an index the chart has no view of.
 *
 * @param props - The node's geometry and index, and the chart's views, colors and writer.
 */
export function Node(props: NodeProps): null | ReactElement {
  const group = useRef<SVGGElement>(null);
  const view = props.views[props.index ?? -1];
  const reported = useActiveTooltipDataPoints<Reported>()?.[0]?.name;
  const box = boxOf(props);
  const detail = detailOf(props, view, box);

  useOpened(group, view !== undefined && view.walk === props.initial);
  useCleared(group, [box.x, box.y, box.width, box.height, view?.title, detail].join("\n"));

  if (view === undefined) return null;

  const middle = box.y + box.height / 2;
  const beside = besideOf(view.sink, box);

  return (
    <g className={NODE} data-trace={traceOf(reported, view.key)} data-walk={view.walk} ref={group}>
      <Rectangle fill={props.colorOf(view.key)} radius={RADIUS} {...box} />
      <Text
        className={SHARE}
        verticalAnchor="middle"
        y={detail === undefined ? middle : middle - LINE / 2}
        {...beside}
      >
        {view.title}
      </Text>
      {detail === undefined ? null : (
        <Text className={SHARE} verticalAnchor="middle" y={middle + LINE / 2} {...beside}>
          {detail}
        </Text>
      )}
    </g>
  );
}
