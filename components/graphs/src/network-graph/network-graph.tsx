/**
 * Renders a network graph: nodes as discs sized by their weight, links read either way round, and
 * a focus that lights what a node connects to.
 *
 * @remarks
 *   The graph is the caller's own shape, nodes with names and links between their ids, and the
 *   preset turns it into React Flow's. A force layout from `seed` places the nodes by their discs
 *   and names, so the same graph and seed give the same picture in every browser and theme, and
 *   the view fits the layout whenever the layout moves a node. A focus lights the nodes within
 *   `depth` hops and dims
 *   the rest, and the readout below the canvas states it in the caller's words. A person can move
 *   a node unless `draggable` is false. A graph without a node renders its message in the canvas's
 *   place, without the controls and the overview.
 */

import { type ReactElement } from "react";

import { Caption } from "#graph/caption.tsx";
import { Empty } from "#graph/empty.ts";
import { Root } from "#graph/root.tsx";
import { Linked } from "#network-graph/linked.tsx";
import { type LinkedProps } from "#network-graph/state.ts";
import { type NetworkGraphProps, type NetworkWords } from "#network-graph/types.ts";
import { wordsOf } from "#network-graph/words.ts";

/**
 * Describes the props of the canvas and readout before the words and the dragging are resolved.
 */
type Own = Omit<LinkedProps, "draggable" | "words">;

/**
 * Describes the props of the figure and of the parts beside the canvas.
 */
type Rest = Omit<NetworkGraphProps, "draggable" | keyof NetworkWords | keyof Own>;

/**
 * Splits a network graph's props into its words, the canvas's props, the dragging and the
 * figure's props.
 */
function split(props: NetworkGraphProps): [NetworkWords, Own, boolean, Rest] {
  const {
    clearLabel,
    defaultFocus,
    depth,
    draggable = true,
    edgeName,
    emptyLabel,
    focus,
    focusLabel,
    iterations,
    label,
    links,
    moveAnnouncement,
    neighborLabel,
    nodeDescription,
    nodes,
    onFocusChange,
    overview,
    promptLabel,
    seed,
    summary,
    ...rest
  } = props;
  const words = { clearLabel, edgeName, emptyLabel, focusLabel, moveAnnouncement };
  const more = { neighborLabel, nodeDescription, promptLabel, summary };
  const own = { defaultFocus, depth, focus, iterations, label, links, nodes, onFocusChange };

  return [{ ...words, ...more }, { ...own, overview, seed }, draggable, rest];
}

/**
 * Renders the figure: the controls, the canvas, its readout with the overview, and the caption,
 * or the empty state while the graph has no node.
 *
 * @param props - The graph, its focus, its layout, its parts, its words and the figure's props.
 */
export function NetworkGraph(props: NetworkGraphProps): ReactElement {
  const [stated, own, draggable, rest] = split(props);
  const { caption, controls, ...root } = rest;
  const words = wordsOf(stated, draggable);

  return (
    <Root {...root}>
      {own.nodes.length === 0 ? (
        <Empty>{words.emptyLabel}</Empty>
      ) : (
        <>
          {controls}
          <Linked draggable={draggable} words={words} {...own} />
        </>
      )}
      {caption === undefined ? null : <Caption>{caption}</Caption>}
    </Root>
  );
}
