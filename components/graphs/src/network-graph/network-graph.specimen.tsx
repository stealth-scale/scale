/**
 * Catalogue page for the network graph.
 *
 * @remarks
 *   Every scene is hand-written, because the network graph has no recipe of its own: a service
 *   topology focused on one service with the controls and the overview map, a mentoring network
 *   lit two hops deep, modules sized by their links, a focus kept in the caller's state, a supply
 *   network pinned for a report, forty rail stations, and a network without a node. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `network-graph` in `locales/en/specimen/network-graph.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as controlled from "#network-graph/examples/controlled.example.tsx";
import * as empty from "#network-graph/examples/empty.example.tsx";
import * as mentoring from "#network-graph/examples/mentoring.example.tsx";
import * as modules from "#network-graph/examples/modules.example.tsx";
import * as pinned from "#network-graph/examples/pinned.example.tsx";
import * as rail from "#network-graph/examples/rail.example.tsx";
import * as topology from "#network-graph/examples/topology.example.tsx";

/**
 * Hand-written scene for a service topology focused on one service.
 */
export const services: Scene = {
  about: "network-graph.topology.about",
  draw: () => (
    <Room size="4xl">
      <topology.Topology />
    </Room>
  ),
  example: topology,
  title: "network-graph.topology.title",
};

/**
 * Hand-written scene for a network lit two hops deep.
 */
export const deep: Scene = {
  about: "network-graph.mentoring.about",
  draw: () => (
    <Room size="2xl">
      <mentoring.Mentoring />
    </Room>
  ),
  example: mentoring,
  title: "network-graph.mentoring.title",
};

/**
 * Hand-written scene for discs sized by the number of their links.
 */
export const linked: Scene = {
  about: "network-graph.modules.about",
  draw: () => (
    <Room size="2xl">
      <modules.Modules />
    </Room>
  ),
  example: modules,
  title: "network-graph.modules.title",
};

/**
 * Hand-written scene for a focus kept in the caller's state.
 */
export const kept: Scene = {
  about: "network-graph.controlled.about",
  draw: () => (
    <Room size="2xl">
      <controlled.Controlled />
    </Room>
  ),
  example: controlled,
  title: "network-graph.controlled.title",
};

/**
 * Hand-written scene for nodes pinned where the layout put them.
 */
export const fixed: Scene = {
  about: "network-graph.pinned.about",
  draw: () => (
    <Room size="2xl">
      <pinned.Pinned />
    </Room>
  ),
  example: pinned,
  title: "network-graph.pinned.title",
};

/**
 * Hand-written scene for forty stations with the overview map.
 */
export const large: Scene = {
  about: "network-graph.rail.about",
  draw: () => (
    <Room size="4xl">
      <rail.Rail />
    </Room>
  ),
  example: rail,
  title: "network-graph.rail.title",
};

/**
 * Hand-written scene for a network without a node.
 */
export const none: Scene = {
  about: "network-graph.empty.about",
  draw: () => (
    <Room size="2xl">
      <empty.Empty />
    </Room>
  ),
  example: empty,
  title: "network-graph.empty.title",
};

export default specimen({
  about: "network-graph.about",
  id: "components/graphs/network-graph",
  imports: 'import { Graph, NetworkGraph } from "@stealthscale/component-graphs";',
  scenes: [services, deep, linked, kept, fixed, large, none],
  title: "network-graph.title",
});
