/**
 * Catalogue page for the stream graph.
 *
 * @remarks
 *   The stream graph has no recipe of its own: the chart's recipe styles its figure, so every scene
 *   is hand-written. The scenes render traffic sources stacked inside out, listening by genre on a
 *   centred baseline, the sources in the series' order, the tooltip open at a campaign's peak, the
 *   bands animated in with a replay, the traffic at a phone's width, and a range without rows.
 *   Every scene renders a component from `examples/` and shows that file as its source. The words
 *   are keys under `stream-graph` in `locales/en/specimen/stream-graph.json`.
 */

import { Room, type Scene, specimen } from "@stealthscale/specimen";

import * as campaign from "#stream-graph/examples/campaign.example.tsx";
import * as listening from "#stream-graph/examples/listening.example.tsx";
import * as ordered from "#stream-graph/examples/ordered.example.tsx";
import * as quiet from "#stream-graph/examples/quiet.example.tsx";
import * as replay from "#stream-graph/examples/replay.example.tsx";
import * as traffic from "#stream-graph/examples/traffic.example.tsx";

/**
 * Hand-written scene for series stacked inside out.
 */
export const insideOut: Scene = {
  about: "stream-graph.traffic.about",
  draw: () => (
    <Room size="lg">
      <traffic.Traffic />
    </Room>
  ),
  example: traffic,
  title: "stream-graph.traffic.title",
};

/**
 * Hand-written scene for a stack centred on a straight line.
 */
export const centred: Scene = {
  about: "stream-graph.listening.about",
  draw: () => (
    <Room size="lg">
      <listening.Listening />
    </Room>
  ),
  example: listening,
  title: "stream-graph.listening.title",
};

/**
 * Hand-written scene for series stacked in their order.
 */
export const order: Scene = {
  about: "stream-graph.ordered.about",
  draw: () => (
    <Room size="lg">
      <ordered.Ordered />
    </Room>
  ),
  example: ordered,
  title: "stream-graph.ordered.title",
};

/**
 * Hand-written scene for the tooltip open at a row.
 */
export const tooltip: Scene = {
  about: "stream-graph.campaign.about",
  draw: () => (
    <Room size="lg">
      <campaign.Campaign />
    </Room>
  ),
  example: campaign,
  title: "stream-graph.campaign.title",
};

/**
 * Hand-written scene for the bands animated in, with a replay.
 */
export const animated: Scene = {
  about: "stream-graph.replay.about",
  draw: () => (
    <Room size="lg">
      <replay.Replay />
    </Room>
  ),
  example: replay,
  title: "stream-graph.replay.title",
};

/**
 * Hand-written scene for the traffic at a phone's width.
 */
export const narrow: Scene = {
  about: "stream-graph.narrow.about",
  draw: () => (
    <Room size="xs">
      <traffic.Traffic />
    </Room>
  ),
  example: traffic,
  title: "stream-graph.narrow.title",
};

/**
 * Hand-written scene for a range without rows.
 */
export const empty: Scene = {
  about: "stream-graph.quiet.about",
  draw: () => (
    <Room size="md">
      <quiet.Quiet />
    </Room>
  ),
  example: quiet,
  title: "stream-graph.quiet.title",
};

export default specimen({
  about: "stream-graph.about",
  id: "components/charts/stream-graph",
  imports: 'import { StreamGraph } from "@stealthscale/component-charts";',
  scenes: [insideOut, centred, order, tooltip, animated, narrow, empty],
  title: "stream-graph.title",
});
