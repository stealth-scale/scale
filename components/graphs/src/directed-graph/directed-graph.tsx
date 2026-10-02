/**
 * Renders a directed graph: a lineage whose focused node traces what feeds it and what it feeds,
 * or a tree whose branches open and close, laid out by rank.
 *
 * @remarks
 *   The graph is the caller's own shape, nodes with names and edges between their ids, and the
 *   preset turns it into React Flow's. `treeEdges` turns a flat list whose items name a parent into
 *   the edges. A focus traces within `depth` hops each way: `highlight` dims the unrelated nodes,
 *   `isolate` shows the traced nodes alone, and `off` only selects. Each related card states its
 *   relation as a word, because both directions share a color. `collapsible` gives a node whose
 *   branch a press changes a control with the number of nodes it hides or shows. The canvas lays
 *   the nodes out by the sizes React Flow measures and fits the view whenever the layout moves a
 *   node, so focusing moves nothing. The readout below the canvas states the trace in the caller's
 *   words. A graph without a node renders its message in the canvas's place, without the controls
 *   and the overview.
 */

import { type ReactElement } from "react";

import { type TracedProps } from "#directed-graph/state.ts";
import { Traced } from "#directed-graph/traced.tsx";
import { type DirectedGraphProps, type DirectedWords } from "#directed-graph/types.ts";
import { wordsOf } from "#directed-graph/words.ts";
import { Caption } from "#graph/caption.tsx";
import { Empty } from "#graph/empty.ts";
import { Root, type RootProps } from "#graph/root.tsx";

/**
 * Describes the props of the canvas and readout before the words and the direction are resolved.
 */
type Own = Omit<TracedProps, "direction" | "words">;

/**
 * Describes the props of the figure and of the parts beside the canvas.
 */
type Rest = Omit<DirectedGraphProps, keyof DirectedWords | keyof Own>;

/**
 * Splits a directed graph's props into its words, the canvas's props and the figure's props.
 */
function split(props: DirectedGraphProps): [DirectedWords, Own, Rest] {
  const {
    clearLabel,
    collapsed,
    collapseLabel,
    collapsible,
    defaultCollapsed,
    defaultFocus,
    depth,
    downstreamLabel,
    edgeName,
    edges,
    emptyLabel,
    expandLabel,
    focus,
    focusLabel,
    label,
    nodeDescription,
    nodes,
    onCollapsedChange,
    onFocusChange,
    overview,
    promptLabel,
    summary,
    trace,
    upstreamLabel,
    ...rest
  } = props;
  const words = { clearLabel, collapseLabel, downstreamLabel, edgeName, emptyLabel, expandLabel };
  const more = { focusLabel, nodeDescription, promptLabel, summary, upstreamLabel };
  const state = { collapsed, collapsible, defaultCollapsed, defaultFocus, depth, focus, trace };
  const graph = { edges, label, nodes, onCollapsedChange, onFocusChange, overview };

  return [{ ...words, ...more }, { ...state, ...graph }, rest];
}

/**
 * Renders the figure: the controls, the canvas, its readout with the overview, and the caption,
 * or the empty state while the graph has no node.
 *
 * @param props - The graph, its focus and branches, its parts, its words and the figure's props.
 */
export function DirectedGraph(props: DirectedGraphProps): ReactElement {
  const [stated, own, rest] = split(props);
  const { caption, controls, direction = "down", ...root } = rest;
  const words = wordsOf(stated);
  const figure: RootProps = { direction, ...root };

  return (
    <Root {...figure}>
      {own.nodes.length === 0 ? (
        <Empty>{words.emptyLabel}</Empty>
      ) : (
        <>
          {controls}
          <Traced direction={direction} words={words} {...own} />
        </>
      )}
      {caption === undefined ? null : <Caption>{caption}</Caption>}
    </Root>
  );
}
