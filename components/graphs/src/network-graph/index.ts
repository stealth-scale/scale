/**
 * Exposes the network graph, its types and the function it lights a focus's reach with to the
 * package barrel, which publishes them by name.
 */

export { NetworkGraph } from "#network-graph/network-graph.tsx";
export { neighborsOf } from "#network-graph/network.ts";
export {
  type Connections,
  type NetworkGraphProps,
  type NetworkLink,
  type NetworkNode,
  type NetworkWords,
} from "#network-graph/types.ts";
