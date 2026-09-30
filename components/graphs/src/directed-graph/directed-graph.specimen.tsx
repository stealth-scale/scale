/**
 * Catalogue page for the directed graph.
 *
 * @remarks
 *   Every scene is hand-written, because the directed graph has no recipe of its own: a warehouse
 *   lineage focused on one model with the controls and the overview map, the same lineage isolated
 *   to one hop, an org chart built from a flat list with branches that open and close, a focus kept
 *   in the caller's state, and a graph without a node. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `directed-graph` in
 *   `locales/en/specimen/directed-graph.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as controlled from "#directed-graph/examples/controlled.example.tsx";
import * as empty from "#directed-graph/examples/empty.example.tsx";
import * as isolate from "#directed-graph/examples/isolate.example.tsx";
import * as lineage from "#directed-graph/examples/lineage.example.tsx";
import * as org from "#directed-graph/examples/org-chart.example.tsx";

/**
 * Hand-written scene for a lineage focused on one model.
 */
export const traced: Scene = {
  about: "directed-graph.lineage.about",
  draw: () => (
    <Room size="4xl">
      <lineage.Lineage />
    </Room>
  ),
  example: lineage,
  title: "directed-graph.lineage.title",
};

/**
 * Hand-written scene for a lineage isolated to one hop.
 */
export const isolated: Scene = {
  about: "directed-graph.isolate.about",
  draw: () => (
    <Room size="2xl">
      <isolate.Isolate />
    </Room>
  ),
  example: isolate,
  title: "directed-graph.isolate.title",
};

/**
 * Hand-written scene for an org chart whose branches open and close.
 */
export const chart: Scene = {
  about: "directed-graph.org.about",
  draw: () => (
    <Room size="4xl">
      <org.OrgChart />
    </Room>
  ),
  example: org,
  title: "directed-graph.org.title",
};

/**
 * Hand-written scene for a focus kept in the caller's state.
 */
export const kept: Scene = {
  about: "directed-graph.controlled.about",
  draw: () => (
    <Room size="2xl">
      <controlled.Controlled />
    </Room>
  ),
  example: controlled,
  title: "directed-graph.controlled.title",
};

/**
 * Hand-written scene for a graph without a node.
 */
export const none: Scene = {
  about: "directed-graph.empty.about",
  draw: () => (
    <Room size="2xl">
      <empty.Empty />
    </Room>
  ),
  example: empty,
  title: "directed-graph.empty.title",
};

export default specimen({
  about: "directed-graph.about",
  id: "components/graphs/directed-graph",
  imports: 'import { DirectedGraph, Graph, treeEdges } from "@stealthscale/component-graphs";',
  scenes: [traced, isolated, chart, kept, none],
  title: "directed-graph.title",
});
