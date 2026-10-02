/**
 * Catalogue page for the heatmap.
 *
 * @remarks
 *   `scenesOf` generates the shape and size scenes from the heat recipe, the shapes rendered as a
 *   calendar quarter. The other scenes are hand-written: a week of card authorisations with the
 *   busiest hour in the caption, the readout at that hour, missing readings beside the fewest
 *   counted, values printed in the cells, two weeks read on one domain, a diverging scale, a picked
 *   cell, a dense grid that scrolls, a year of deploys as a calendar, a calendar whose weeks start
 *   on Monday, a picked day, signup cohorts with their average, clinic cohorts with their counts, a
 *   stated palette, the authorisations at a phone's width, and a heatmap without cells. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `heatmap` in `locales/en/specimen/heatmap.json`. The page imports the heatmap's barrel
 *   directly, because the props reader follows a specimen's own imports and not an examples barrel.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import { recipe } from "#heat/recipe.ts";
import * as examples from "#heatmap/examples/index.ts";
import type * as Heatmap from "#heatmap/index.ts";

/**
 * Props of a generated cell: the heatmap's props without its readings and its name.
 */
type Props = Omit<Heatmap.HeatmapProps, "cells" | "label">;

/**
 * Hand-written scene for a week of card authorisations.
 */
export const authorised: Scene = {
  about: "heatmap.authorisations.about",
  draw: () => (
    <Room size="2xl">
      <examples.authorisations.Authorisations />
    </Room>
  ),
  example: examples.authorisations,
  title: "heatmap.authorisations.title",
};

/**
 * Hand-written scene for the readout at the busiest hour.
 */
export const readout: Scene = {
  about: "heatmap.readout.about",
  draw: () => (
    <Room size="2xl">
      <examples.readout.Readout />
    </Room>
  ),
  example: examples.readout,
  title: "heatmap.readout.title",
};

/**
 * Hand-written scene for missing readings beside the fewest counted.
 */
export const missing: Scene = {
  about: "heatmap.wards.about",
  draw: () => (
    <Room size="md">
      <examples.wards.Wards />
    </Room>
  ),
  example: examples.wards,
  title: "heatmap.wards.title",
};

/**
 * Hand-written scene for values printed in the cells.
 */
export const printed: Scene = {
  about: "heatmap.builds.about",
  draw: () => (
    <Room size="md">
      <examples.builds.Builds />
    </Room>
  ),
  example: examples.builds,
  title: "heatmap.builds.title",
};

/**
 * Hand-written scene for two weeks read on one domain.
 */
export const compared: Scene = {
  about: "heatmap.depots.about",
  draw: () => (
    <Room size="md">
      <examples.depots.Depots />
    </Room>
  ),
  example: examples.depots,
  title: "heatmap.depots.title",
};

/**
 * Hand-written scene for a diverging scale.
 */
export const diverged: Scene = {
  about: "heatmap.variance.about",
  draw: () => (
    <Room size="md">
      <examples.variance.Variance />
    </Room>
  ),
  example: examples.variance,
  title: "heatmap.variance.title",
};

/**
 * Hand-written scene for a picked cell.
 */
export const picked: Scene = {
  about: "heatmap.incidents.about",
  draw: () => (
    <Room size="md">
      <examples.incidents.Incidents />
    </Room>
  ),
  example: examples.incidents,
  title: "heatmap.incidents.title",
};

/**
 * Hand-written scene for a dense grid that scrolls sideways.
 */
export const dense: Scene = {
  about: "heatmap.attendance.about",
  draw: () => (
    <Room size="md">
      <examples.attendance.Attendance />
    </Room>
  ),
  example: examples.attendance,
  title: "heatmap.attendance.title",
};

/**
 * Hand-written scene for a year of deploys laid out as a calendar.
 */
export const calendar: Scene = {
  about: "heatmap.deploys.about",
  draw: () => (
    <Room size="2xl">
      <examples.deploys.Deploys />
    </Room>
  ),
  example: examples.deploys,
  title: "heatmap.deploys.title",
};

/**
 * Hand-written scene for a calendar whose weeks start on Monday.
 */
export const weekStart: Scene = {
  about: "heatmap.pages.about",
  draw: () => (
    <Room size="md">
      <examples.pages.Pages />
    </Room>
  ),
  example: examples.pages,
  title: "heatmap.pages.title",
};

/**
 * Hand-written scene for a picked day.
 */
export const pickedDay: Scene = {
  about: "heatmap.bookings.about",
  draw: () => (
    <Room size="lg">
      <examples.bookings.Bookings />
    </Room>
  ),
  example: examples.bookings,
  title: "heatmap.bookings.title",
};

/**
 * Hand-written scene for signup cohorts with their average.
 */
export const cohorts: Scene = {
  about: "heatmap.signups.about",
  draw: () => (
    <Room size="3xl">
      <examples.signups.Signups />
    </Room>
  ),
  example: examples.signups,
  title: "heatmap.signups.title",
};

/**
 * Hand-written scene for clinic cohorts with their counts.
 */
export const counted: Scene = {
  about: "heatmap.clinic.about",
  draw: () => (
    <Room size="2xl">
      <examples.clinic.Clinic />
    </Room>
  ),
  example: examples.clinic,
  title: "heatmap.clinic.title",
};

/**
 * Hand-written scene for a stated palette.
 */
export const tinted: Scene = {
  about: "heatmap.palette.about",
  draw: () => (
    <Room size="2xl">
      <examples.palette.Palette />
    </Room>
  ),
  example: examples.palette,
  title: "heatmap.palette.title",
};

/**
 * Hand-written scene for the authorisations at a phone's width.
 */
export const narrow: Scene = {
  about: "heatmap.narrow.about",
  draw: () => (
    <Room size="xs">
      <examples.authorisations.Authorisations />
    </Room>
  ),
  example: examples.authorisations,
  title: "heatmap.narrow.title",
};

/**
 * Hand-written scene for a heatmap without cells.
 */
export const empty: Scene = {
  about: "heatmap.quiet.about",
  draw: () => (
    <Room size="md">
      <examples.quiet.Quiet />
    </Room>
  ),
  example: examples.quiet,
  title: "heatmap.quiet.title",
};

export default specimen({
  about: "heatmap.about",
  id: "components/charts/heatmap",
  imports: 'import { Heatmap } from "@stealthscale/component-charts";',
  scenes: [
    authorised,
    readout,
    missing,
    printed,
    compared,
    diverged,
    picked,
    dense,
    calendar,
    weekStart,
    pickedDay,
    cohorts,
    counted,
    ...scenesOf<Props>(recipe, {
      axes: {
        shape: {
          direction: "column",
          draw: (props) => <examples.quarter.Quarter {...props} />,
          example: examples.quarter,
        },
        size: { direction: "column" },
      },
      draw: (props) => <examples.sizes.Sizes {...props} />,
      example: examples.sizes,
      namespace: "heatmap",
      order: ["shape", "size"],
    }),
    tinted,
    narrow,
    empty,
  ],
  title: "heatmap.title",
});
