/**
 * Catalogue page for the meter.
 *
 * @remarks
 *   `scenesOf` generates one scene per axis of the progress recipe, which the meter renders, from
 *   the storage meter, each in a room at the `xs` measure, because a meter is as wide as its
 *   container. The palette scene crosses the looks, and the shape scene uses the thickest track.
 *   The page skips the axes of work under way, which a meter does not offer. Hand-written scenes
 *   render a plan's usage, each palette picked from its own threshold, a password's strength,
 *   whose words are the value text, measures against their targets, a disk's parts and a plan mix
 *   as shares. The words are keys under `meter` in `locales/en/specimen/meter.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as capacity from "#meter/examples/capacity.example.tsx";
import * as shares from "#meter/examples/shares.example.tsx";
import * as storage from "#meter/examples/storage.example.tsx";
import * as strength from "#meter/examples/strength.example.tsx";
import * as target from "#meter/examples/target.example.tsx";
import * as usage from "#meter/examples/usage.example.tsx";
import { type RootProps } from "#meter/index.ts";
import { recipe } from "#progress/recipe.ts";

/**
 * Axes of the progress recipe the meter does not offer, each with the reason.
 */
export const SKIPPED = {
  animated: "a meter shows a measurement, not work under way, so its root takes no animated",
  effect: "a meter is not a control, so its root takes no effect",
  striped: "a meter shows a measurement, not work under way, so its root takes no striped",
};

/**
 * Hand-written scene for a plan's usage, each meter in the palette its threshold picks.
 */
export const limits: Scene = {
  about: "meter.limits.about",
  draw: () => (
    <Room size="xs">
      <usage.Usage />
    </Room>
  ),
  example: usage,
  title: "meter.limits.title",
};

/**
 * Hand-written scene for a password's strength, stated in words.
 */
export const words: Scene = {
  about: "meter.words.about",
  draw: () => (
    <Room size="xs">
      <strength.Strength />
    </Room>
  ),
  example: strength,
  title: "meter.words.title",
};

/**
 * Hand-written scene for measures against their targets, each target a marker.
 */
export const targets: Scene = {
  about: "meter.target.about",
  draw: () => (
    <Room size="xs">
      <target.Target />
    </Room>
  ),
  example: target,
  title: "meter.target.title",
};

/**
 * Hand-written scene for a disk's used space in parts, each part a segment.
 */
export const parts: Scene = {
  about: "meter.capacity.about",
  draw: () => (
    <Room size="xs">
      <capacity.Capacity />
    </Room>
  ),
  example: capacity,
  title: "meter.capacity.title",
};

/**
 * Hand-written scene for a whole split into shares that fill the track.
 */
export const split: Scene = {
  about: "meter.shares.about",
  draw: () => (
    <Room size="xs">
      <shares.Shares />
    </Room>
  ),
  example: shares,
  title: "meter.shares.title",
};

export default specimen({
  about: "meter.about",
  id: "components/feedback/meter",
  imports: 'import { Meter } from "@stealthscale/component-feedback";',
  scenes: [
    ...scenesOf<Omit<RootProps, "value">>(recipe, {
      axes: {
        palette: { across: "variant" },
        shape: { with: { size: "xl" } },
      },
      draw: (props) => (
        <Room size="xs">
          <storage.Storage {...props} />
        </Room>
      ),
      example: storage,
      namespace: "meter",
      order: ["size", "shape", "palette", "layout"],
      skip: SKIPPED,
    }),
    limits,
    words,
    targets,
    parts,
    split,
  ],
  title: "meter.title",
});
