/**
 * Catalogue page for the timestamp.
 *
 * @remarks
 *   The recipe has no axis, so every scene is hand-written. The readings scene crosses the three
 *   readings of one instant, and every other scene shows one example. The examples measure their
 *   distances from one stated instant, so the page reads the same on any day. The live scene reads
 *   the clock and changes while a reader watches it. The words are keys under `timestamp` in
 *   `locales/en/specimen/timestamp.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/specimen";

import * as examples from "#timestamp/examples/index.ts";
import { type TimestampReading } from "#timestamp/index.ts";

/**
 * Readings of the readings scene, in the order its words explain them.
 */
const READINGS: readonly TimestampReading[] = ["absolute", "relative", "both"];

/**
 * Builds a hand-written scene for one example.
 *
 * @param name - The key of the scene's words under `timestamp`.
 * @param example - The example module.
 * @param Drawn - The example's component.
 * @returns The scene.
 */
function shown(name: string, example: Scene["example"], Drawn: () => ReactElement): Scene {
  return {
    about: `timestamp.${name}.about`,
    draw: Drawn,
    example,
    title: `timestamp.${name}.title`,
  };
}

export default specimen({
  about: "timestamp.about",
  id: "components/data/timestamp",
  imports: 'import { Timestamp } from "@stealthscale/component-data";',
  scenes: [
    {
      about: "timestamp.readings.about",
      draw: (): ReactElement => (
        <Matrix knob="reads" of={READINGS}>
          {(reading) => <examples.moment.Moment reads={reading} />}
        </Matrix>
      ),
      example: examples.moment,
      props: { reads: "absolute" },
      title: "timestamp.readings.title",
    },
    shown("activity", examples.activity, examples.activity.Activity),
    shown("receipts", examples.receipts, examples.receipts.Receipts),
    shown("vitals", examples.vitals, examples.vitals.Vitals),
    shown("live", examples.live, examples.live.Live),
    shown("payouts", examples.payouts, examples.payouts.Payouts),
    shown("imports", examples.imports, examples.imports.Imports),
    shown("permit", examples.permit, examples.permit.Permit),
    shown("deadline", examples.deadline, examples.deadline.Deadline),
  ],
  title: "timestamp.title",
});
