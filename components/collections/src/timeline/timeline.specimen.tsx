/**
 * Catalogue page for the timeline.
 *
 * @remarks
 *   `scenesOf` generates the size, look, palette and ongoing scenes from a run of three numbered
 *   events, each in a room at the `xs` measure, because a timeline is as wide as its container. The
 *   rail scene renders dates before the rail in a room at the `sm` measure. Hand-written scenes
 *   render entries on alternating sides of a centred rail, an activity feed of faces and names, and
 *   a shipment still on its way. The words are keys under `timeline` in
 *   `locales/en/specimen/timeline.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as activity from "#timeline/examples/activity.example.tsx";
import * as alternating from "#timeline/examples/alternating.example.tsx";
import * as dated from "#timeline/examples/dated.example.tsx";
import * as run from "#timeline/examples/run.example.tsx";
import * as shipment from "#timeline/examples/shipment.example.tsx";
import { type RootProps } from "#timeline/index.ts";
import { recipe } from "#timeline/recipe.ts";

/**
 * Hand-written scene for entries on alternating sides of a centred rail.
 */
export const sides: Scene = {
  about: "timeline.sides.about",
  draw: () => (
    <Room size="sm">
      <alternating.Alternating />
    </Room>
  ),
  example: alternating,
  title: "timeline.sides.title",
};

/**
 * Hand-written scene for an activity feed of faces, names and changes.
 */
export const feed: Scene = {
  about: "timeline.feed.about",
  draw: () => (
    <Room size="sm">
      <activity.Activity />
    </Room>
  ),
  example: activity,
  title: "timeline.feed.title",
};

/**
 * Hand-written scene for a shipment still on its way, on the success palette.
 */
export const tracked: Scene = {
  about: "timeline.tracked.about",
  draw: () => (
    <Room size="xs">
      <shipment.Shipment />
    </Room>
  ),
  example: shipment,
  title: "timeline.tracked.title",
};

export default specimen({
  about: "timeline.about",
  id: "components/collections/timeline",
  imports: 'import { Timeline } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      axes: {
        rail: {
          draw: (props) => (
            <Room size="sm">
              <dated.Dated {...props} />
            </Room>
          ),
          example: dated,
        },
      },
      draw: (props) => (
        <Room size="xs">
          <run.Run {...props} />
        </Room>
      ),
      example: run,
      namespace: "timeline",
      order: ["size", "variant", "palette", "rail", "ongoing"],
    }),
    sides,
    feed,
    tracked,
  ],
  title: "timeline.title",
});
