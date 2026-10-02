/**
 * Keeps a network graph's focus, measured sizes and the positions people moved nodes to, and
 * works out its view.
 *
 * @remarks
 *   The focus is controlled where the caller passes it. A focus of `null` is a controlled graph
 *   with no focus, because `undefined` leaves the focus to the graph. The measured sizes go back to
 *   React Flow with each node, which keeps its handles' measurements, and play no part in the
 *   layout. A moved node keeps its position while the layout is the one it was moved on, and goes
 *   back to the layout's position when the layout changes, such as for new data or a new seed. A
 *   change that changes no state renders nothing again, so a report React Flow repeats for nodes
 *   it measures again cannot start a loop of renders.
 */

import { useState } from "react";

import { type NodeChange, type XYPosition } from "@xyflow/react";

import { useControllableState } from "@stealthscale/hooks";

import { measuredBy, movedBy, selectedBy, type Size } from "#graph/changes.ts";
import { signatureOf } from "#graph/placed.ts";
import { drawnOf } from "#network-graph/network.ts";
import { placesOf } from "#network-graph/places.ts";
import { type NetworkGraphProps } from "#network-graph/types.ts";
import { type DiscNode, type View, viewOf } from "#network-graph/view.ts";
import { type Words } from "#network-graph/words.ts";

/**
 * Describes the props of the canvas and readout: the graph, its focus, its layout and its words.
 */
export interface LinkedProps extends Pick<
  NetworkGraphProps,
  | "defaultFocus"
  | "depth"
  | "focus"
  | "iterations"
  | "label"
  | "links"
  | "nodes"
  | "onFocusChange"
  | "overview"
  | "seed"
> {
  /**
   * Whether a person can move a node.
   */
  readonly draggable: boolean;

  /**
   * Words of the discs, the links' names and the readout.
   */
  readonly words: Words;
}

/**
 * Describes the positions people moved nodes to and the layout they were moved on.
 */
interface Moves {
  /**
   * Signature of the layout the nodes were moved on.
   */
  readonly layout: string;

  /**
   * Position of each moved node by its id.
   */
  readonly positions: ReadonlyMap<string, XYPosition>;
}

/**
 * Describes the network's state: its view, where its nodes render, and what changes it.
 */
export interface Linked {
  /**
   * Clears the focus.
   */
  readonly clear: () => void;

  /**
   * Ids of the nodes a person moved away from the layout.
   */
  readonly moved: ReadonlySet<string>;

  /**
   * Nodes the canvas renders: each moved node where a person put it, the rest where the layout
   * put them.
   */
  readonly nodes: DiscNode[];

  /**
   * Applies the changes React Flow reports: a selection focuses its node, a measured size goes
   * back to React Flow with its node, and a position moves a node.
   */
  readonly onNodesChange: (changes: Array<NodeChange<DiscNode>>) => void;

  /**
   * View of the graph in its current state, with the nodes where the layout put them.
   */
  readonly view: View;
}

/**
 * No position, for a layout nobody moved a node on.
 */
const UNMOVED: ReadonlyMap<string, XYPosition> = new Map();

/**
 * Returns the nodes with each moved node at the position a person moved it to.
 */
function movedTo(
  nodes: readonly DiscNode[],
  positions: ReadonlyMap<string, XYPosition>,
): DiscNode[] {
  return nodes.map((node) => {
    const position = positions.get(node.id);

    return position === undefined ? node : { ...node, position };
  });
}

/**
 * Returns the network's view in its current state and the functions that change the state.
 *
 * @param props - The graph, its focus, its layout and its words.
 */
export function useLinked(props: LinkedProps): Linked {
  const [sizes, setSizes] = useState<ReadonlyMap<string, Size>>(new Map());
  const [moves, setMoves] = useState<Moves>({ layout: "", positions: UNMOVED });
  const [focus, setFocus] = useControllableState<null | string>({
    defaultValue: props.defaultFocus ?? null,
    onChange: props.onFocusChange,
    value: props.focus,
  });
  const drawn = drawnOf(props.nodes, props.links);
  const placed = placesOf({
    iterations: props.iterations ?? 300,
    links: drawn.map(({ link }) => link),
    nodes: props.nodes,
    seed: props.seed ?? 1,
  });
  const view = viewOf({ depth: props.depth ?? 1, drawn, focus, placed, sizes, words: props.words });
  const layout = signatureOf(view.nodes);
  const positions = moves.layout === layout ? moves.positions : UNMOVED;

  return {
    clear: () => {
      setFocus(null);
    },
    moved: new Set(positions.keys()),
    nodes: movedTo(view.nodes, positions),
    onNodesChange: (changes) => {
      const selected = selectedBy(changes);

      if (selected !== undefined) setFocus(selected);
      setSizes((known) => measuredBy(known, changes));
      setMoves((known) => {
        const kept = known.layout === layout ? known.positions : UNMOVED;
        const next = movedBy(kept, changes);

        return next === kept ? known : { layout, positions: next };
      });
    },
    view,
  };
}
