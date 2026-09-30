/**
 * Catalogue page for the truncate.
 *
 * @remarks
 *   The recipe has no axis, so every scene is hand-written. The lines scene crosses one description
 *   at 1, 2 and 3 lines in an `xs` room, so the line count is the only difference. The row and the
 *   notes render in an `sm` room, so their text clips at every window width. The tooltips open live
 *   under the pointer and on keyboard focus. The words are keys under `truncate` in
 *   `locales/en/specimen/truncate.json`.
 */

import { type ReactElement } from "react";

import { Matrix, Room, type Scene, specimen } from "@stealthscale/specimen";

import * as description from "#truncate/examples/description.example.tsx";
import * as fits from "#truncate/examples/fits.example.tsx";
import * as notes from "#truncate/examples/notes.example.tsx";
import * as shipment from "#truncate/examples/shipment.example.tsx";
import { type TruncateProps } from "#truncate/index.ts";

/**
 * Line counts of the lines scene.
 */
const LINES: ReadonlyArray<NonNullable<TruncateProps["lines"]>> = [1, 2, 3];

/**
 * Hand-written scene for clipped text beside a badge on a row.
 */
export const beside: Scene = {
  about: "truncate.shipment.about",
  draw: (): ReactElement => (
    <Room size="sm">
      <shipment.Shipment />
    </Room>
  ),
  example: shipment,
  title: "truncate.shipment.title",
};

/**
 * Hand-written scene for one description at three line counts.
 */
export const kept: Scene = {
  about: "truncate.lines.about",
  draw: (): ReactElement => (
    <Matrix knob="lines" of={LINES}>
      {(lines) => (
        <Room size="xs">
          <description.Description lines={lines} />
        </Room>
      )}
    </Matrix>
  ),
  example: description,
  props: { lines: 1 },
  title: "truncate.lines.title",
};

/**
 * Hand-written scene for clipped notes that take keyboard focus.
 */
export const reached: Scene = {
  about: "truncate.notes.about",
  draw: (): ReactElement => (
    <Room size="sm">
      <notes.Notes />
    </Room>
  ),
  example: notes,
  title: "truncate.notes.title",
};

/**
 * Hand-written scene for text that fits.
 */
export const fitted: Scene = {
  about: "truncate.fits.about",
  draw: fits.Fits,
  example: fits,
  title: "truncate.fits.title",
};

export default specimen({
  about: "truncate.about",
  id: "components/disclosure/truncate",
  imports: 'import { Truncate } from "@stealthscale/component-disclosure";',
  scenes: [beside, kept, reached, fitted],
  title: "truncate.title",
});
