/**
 * Keeps a directed graph's focus, closed branches and measured sizes, and shares the function that
 * opens and closes a branch with the graph's cards.
 *
 * @remarks
 *   The focus and the closed branches are controlled where the caller passes them. A focus of
 *   `null` is a controlled graph with no focus, because `undefined` leaves the focus to the graph.
 *   React Flow renders each card inside the canvas, where the graph's state is out of reach of the
 *   card's props, so the graph provides the function around the canvas.
 */

import { useState } from "react";

import { type NodeChange } from "@xyflow/react";

import { createRequiredContext, useControllableState } from "@stealthscale/hooks";

import { type DirectedGraphProps } from "#directed-graph/types.ts";
import { type CardNode, type View, viewOf } from "#directed-graph/view.ts";
import { type Words } from "#directed-graph/words.ts";
import { measuredBy, selectedBy, type Size } from "#graph/changes.ts";

/**
 * Provides the function that opens and closes the branch of the node whose id it receives, and
 * reads it back.
 */
export const [BranchProvider, useToggle] =
  createRequiredContext<(id: string) => void>("DirectedGraph");

/**
 * Describes the props of the canvas and readout: the graph, its focus and branches, its words and
 * its direction.
 */
export interface TracedProps extends Pick<
  DirectedGraphProps,
  | "collapsed"
  | "collapsible"
  | "defaultCollapsed"
  | "defaultFocus"
  | "depth"
  | "edges"
  | "focus"
  | "label"
  | "nodes"
  | "onCollapsedChange"
  | "onFocusChange"
  | "overview"
  | "trace"
> {
  /**
   * Way the edges run.
   */
  readonly direction: NonNullable<DirectedGraphProps["direction"]>;

  /**
   * Words of the cards, the edges' names and the readout.
   */
  readonly words: Words;
}

/**
 * Describes the traced graph's state: its view and what changes it.
 */
export interface Traced {
  /**
   * Clears the focus.
   */
  readonly clear: () => void;

  /**
   * Applies the changes React Flow reports: a selection focuses its node, and a measured size
   * places the nodes.
   */
  readonly onNodesChange: (changes: Array<NodeChange<CardNode>>) => void;

  /**
   * Opens or closes the branch of the node whose id it receives.
   */
  readonly toggle: (id: string) => void;

  /**
   * View of the graph in its current state.
   */
  readonly view: View;
}

/**
 * Returns the ids of the closed branches after a press on a node's branch control.
 */
function toggled(closed: readonly string[], id: string): string[] {
  return closed.includes(id) ? closed.filter((known) => known !== id) : [...closed, id];
}

/**
 * Returns the graph's view in its current state and the functions that change the state.
 *
 * @param props - The graph, its focus and branches, its words and its direction.
 */
export function useTraced(props: TracedProps): Traced {
  const [sizes, setSizes] = useState<ReadonlyMap<string, Size>>(new Map());
  const [focus, setFocus] = useControllableState<null | string>({
    defaultValue: props.defaultFocus ?? null,
    onChange: props.onFocusChange,
    value: props.focus,
  });
  const [collapsed, setCollapsed] = useControllableState<string[]>({
    defaultValue: [...(props.defaultCollapsed ?? [])],
    onChange: props.onCollapsedChange,
    value: props.collapsed === undefined ? undefined : [...props.collapsed],
  });
  const view = viewOf({
    collapsed: new Set(collapsed),
    collapsible: props.collapsible === true,
    depth: props.depth ?? Number.POSITIVE_INFINITY,
    direction: props.direction,
    edges: props.edges,
    focus,
    nodes: props.nodes,
    sizes,
    trace: props.trace ?? "highlight",
    words: props.words,
  });

  return {
    clear: () => {
      setFocus(null);
    },
    onNodesChange: (changes) => {
      const selected = selectedBy(changes);

      if (selected !== undefined) setFocus(selected);
      setSizes((known) => measuredBy(known, changes));
    },
    toggle: (id) => {
      setCollapsed((closed) => toggled(closed, id));
    },
    view,
  };
}
