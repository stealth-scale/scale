/**
 * Catalogue page for the segment group.
 *
 * @remarks
 *   `scenesOf` generates the looks, the sizes, the palettes by looks at size `sm`, the fitted group
 *   and the iconic group, each from an example and one cell to a row where a cell is wide. The
 *   fitted group renders in a room of a phone's width, so its items share that width. The states
 *   scene is hand-written, because a chosen, an empty, an invalid, a read-only and a disabled group
 *   differ in props of the root and not in recipe axes. The orientation scene renders the period in
 *   a row and in a column, the closed scene a range with one option disabled, the icons scene
 *   options with an icon beside their words, and the field scene a fitted group named by a field's
 *   label. Every scene renders a component from `examples/` and shows that file as its source. The
 *   words are keys under `segment-group` in `locales/en/specimen/segment-group.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#segment-group/examples/index.ts";
import type * as SegmentGroup from "#segment-group/index.ts";
import { recipe } from "#segment-group/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["chosen", "empty", "invalid", "readOnly", "disabled"] as const;

/**
 * Maps each state to the root props that put the group in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], SegmentGroup.RootProps>> = {
  chosen: { defaultValue: "month" },
  disabled: { defaultValue: "month", disabled: true },
  empty: { defaultValue: null },
  invalid: { defaultValue: null, invalid: true },
  readOnly: { defaultValue: "month", readOnly: true },
};

/**
 * Orientations of the orientation scene.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

/**
 * Hand-written scene for a chosen, an empty, an invalid, a read-only and a disabled group.
 */
export const states: Scene = {
  about: "segment-group.states.about",
  draw: () => (
    <Matrix knob="state" of={STATES}>
      {(state) => <examples.period.Period {...STATED[state]} />}
    </Matrix>
  ),
  example: examples.period,
  props: { defaultValue: "month" },
  title: "segment-group.states.title",
};

/**
 * Hand-written scene for a group in a row and in a column.
 */
export const orientation: Scene = {
  about: "segment-group.orientation.about",
  draw: () => (
    <Matrix knob="orientation" of={ORIENTATIONS}>
      {(way) => <examples.period.Period orientation={way} />}
    </Matrix>
  ),
  example: examples.period,
  props: { orientation: "horizontal" },
  title: "segment-group.orientation.title",
};

/**
 * Hand-written scene for a group with one option disabled.
 */
export const closed: Scene = {
  about: "segment-group.closed.about",
  draw: examples.range.Range,
  example: examples.range,
  title: "segment-group.closed.title",
};

/**
 * Hand-written scene for options with an icon beside their words.
 */
export const icons: Scene = {
  about: "segment-group.icons.about",
  draw: examples.views.Views,
  example: examples.views,
  title: "segment-group.icons.title",
};

/**
 * Hand-written scene for a fitted group named by a field's label.
 */
export const field: Scene = {
  about: "segment-group.field.about",
  draw: () => (
    <Room size="sm">
      <examples.listing.Listing />
    </Room>
  ),
  example: examples.listing,
  title: "segment-group.field.title",
};

export default specimen({
  about: "segment-group.about",
  id: "components/forms/segment-group",
  imports: 'import { SegmentGroup } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<SegmentGroup.RootProps>(recipe, {
      axes: {
        fitted: {
          direction: "column",
          draw: (props) => (
            <Room size="sm">
              <examples.period.Period {...props} />
            </Room>
          ),
        },
        iconic: {
          direction: "column",
          draw: (props) => <examples.alignment.Alignment {...props} />,
          example: examples.alignment,
        },
        palette: { across: "variant", with: { size: "sm" } },
        size: { direction: "column" },
        variant: { direction: "column" },
      },
      draw: (props) => <examples.period.Period {...props} />,
      example: examples.period,
      namespace: "segment-group",
      order: ["variant", "size", "palette", "fitted", "iconic"],
    }),
    states,
    orientation,
    closed,
    icons,
    field,
  ],
  title: "segment-group.title",
});
