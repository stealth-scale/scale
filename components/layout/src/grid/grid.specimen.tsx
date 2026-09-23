/**
 * Catalogue page for the grid.
 *
 * @remarks
 *   Three hand-written scenes render the `columns` axis: 12 calendar days at every count, three
 *   plans at `fit-xs` in three rooms, and one plan at `fit-xs` beside `fill-xs`. Two hand-written
 *   scenes render the `span` axis. An event card spans 2 or more of 12 columns, and a one-column
 *   event is a truncating `Text`, because a card's inset is wider than a column at a 420px
 *   viewport. `scenesOf` generates the other scenes. Every scene renders in an 896px room, because
 *   a Matrix cell otherwise shrinks the grid to its content and the columns lose their free space.
 *   Every scene renders a component from `examples/` and shows that file as its source. The
 *   specimen imports the grid's barrel directly, so the props reader finds the parts. The words are
 *   keys under `grid` in `locales/en/specimen/grid.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen, valuesOf } from "@stealthscale/specimen";

import * as examples from "#grid/examples/index.ts";
import type * as Grid from "#grid/index.ts";
import { recipe } from "#grid/recipe.ts";

/**
 * One value of the `columns` axis.
 */
type Columns = NonNullable<Grid.RootProps["columns"]>;

/**
 * Lists the column counts, the values of the `columns` axis without a width.
 */
const COUNTS = valuesOf(recipe, "columns").filter((columns) => !columns.includes("-"));

/**
 * Lists the rooms the fitted scene renders in: 320, 576 and 672px.
 *
 * @remarks
 *   A 672px room holds two 320px columns. Three columns need 976px, wider than a scene at a
 *   1280px viewport.
 */
const ROOMS = ["xs", "xl", "2xl"] as const;

/**
 * Lists the two templates the fill scene compares.
 */
const TEMPLATES: readonly Columns[] = ["fit-xs", "fill-xs"];

/**
 * Lists the spans an event card renders at: every value of the `span` axis except 1.
 */
const SPANS = valuesOf(recipe, "span").filter((span) => span !== "1");

/**
 * Renders the days at every column count, one grid per row in an 896px room.
 */
function Counts(): ReactElement {
  return (
    <Matrix direction="column" knob="columns" of={COUNTS}>
      {(columns) => (
        <Room size="4xl">
          <examples.days.Days columns={columns} />
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Renders the plans at `fit-xs` in three rooms.
 */
function Fitted(): ReactElement {
  return (
    <Matrix direction="column" knob="room" of={ROOMS}>
      {(room) => (
        <Room size={room}>
          <examples.plans.Plans columns="fit-xs" />
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Renders one plan at `fit-xs` and at `fill-xs` in a 672px room.
 */
function Filled(): ReactElement {
  return (
    <Matrix direction="column" knob="columns" of={TEMPLATES}>
      {(columns) => (
        <Room size="2xl">
          <examples.plan.Plan columns={columns} />
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Renders the event card at every span from 2 to `full`, one calendar per row in an 896px room.
 */
function Spans(): ReactElement {
  return (
    <Matrix direction="column" knob="span" of={SPANS}>
      {(span) => (
        <Room size="4xl">
          <examples.launch.Launch span={span} />
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Renders the one-column event in an 896px room.
 */
function Day(): ReactElement {
  return (
    <Room size="4xl">
      <examples.day.Day />
    </Room>
  );
}

/**
 * Hand-written scene for every column count.
 */
export const counts: Scene = {
  about: "grid.counts.about",
  axes: ["columns"],
  draw: Counts,
  example: examples.days,
  props: { columns: "1" },
  title: "grid.counts.title",
};

/**
 * Hand-written scene for a fitted template in three rooms.
 */
export const fitted: Scene = {
  about: "grid.fitted.about",
  axes: ["columns"],
  draw: Fitted,
  example: examples.plans,
  props: { columns: "fit-xs" },
  title: "grid.fitted.title",
};

/**
 * Hand-written scene for a fitted and a filled template with one item.
 */
export const filled: Scene = {
  about: "grid.filled.about",
  axes: ["columns"],
  draw: Filled,
  example: examples.plan,
  props: { columns: "fit-xs" },
  title: "grid.filled.title",
};

/**
 * Hand-written scene for an event card at every span from 2 to `full`.
 */
export const spans: Scene = {
  about: "grid.span.about",
  axes: ["span"],
  draw: Spans,
  example: examples.launch,
  props: { span: "2" },
  title: "grid.span.title",
};

/**
 * Hand-written scene for an event one column wide.
 */
export const day: Scene = {
  about: "grid.day.about",
  axes: ["span"],
  draw: Day,
  example: examples.day,
  title: "grid.day.title",
};

export default specimen({
  about: "grid.about",
  id: "components/layout/grid",
  imports: 'import { Grid } from "@stealthscale/component-layout";',
  scenes: [
    counts,
    fitted,
    filled,
    ...scenesOf<Parameters<typeof examples.plans.Plans>[0]>(recipe, {
      axes: {
        align: {
          direction: "column",
          draw: (props) => (
            <Room size="4xl">
              <examples.notes.Notes {...props} />
            </Room>
          ),
          example: examples.notes,
        },
        flow: {
          direction: "column",
          draw: (props) => (
            <Room size="4xl">
              <examples.dashboard.Dashboard {...props} />
            </Room>
          ),
          example: examples.dashboard,
        },
        gap: { direction: "column", with: { columns: "2" } },
        justify: {
          direction: "column",
          draw: (props) => (
            <Room size="4xl">
              <examples.statuses.Statuses {...props} />
            </Room>
          ),
          example: examples.statuses,
        },
      },
      draw: (props) => (
        <Room size="4xl">
          <examples.plans.Plans {...props} />
        </Room>
      ),
      example: examples.plans,
      namespace: "grid",
      order: ["gap", "flow", "align", "justify"],
      skip: {
        columns: "The counts, fitted and filled scenes render the columns axis.",
        span: "The span and day scenes render the span axis.",
      },
    }),
    spans,
    day,
  ],
  title: "grid.title",
});
