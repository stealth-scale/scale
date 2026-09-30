/**
 * Catalogue page for the date picker.
 *
 * @remarks
 *   `scenesOf` generates the size, look and status scenes from an appointment field, each in a room
 *   at the `xs` measure, because a date picker fills its container, and the palette scene from an
 *   inline calendar with a range, because a floating panel shows its palette only while open.
 *   Hand-written scenes render a range with presets, several days in an inline calendar, a month,
 *   two months side by side, a date in a validated field, a German calendar with week numbers,
 *   month and year selects, and the disabled, read-only and invalid states. Every floating panel
 *   renders closed and portalled, and a reader opens one to see its views. The page imports the
 *   parts' barrel directly, because the props reader follows a specimen's own imports and not an
 *   examples barrel's. The words are keys under `date-picker` in
 *   `locales/en/specimen/date-picker.json`.
 */

import { type ReactElement } from "react";

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#date-picker/examples/index.ts";
import type * as DatePicker from "#date-picker/index.ts";
import { recipe } from "#date-picker/recipe.ts";

/**
 * Returns a hand-written scene: an example in a room, its source, and its words.
 *
 * @param name - The scene's key under `date-picker` in the words.
 * @param example - The example's module.
 * @param drawing - The example as an element.
 * @param size - Measure of the room. Defaults to `xs`.
 * @returns The scene.
 */
function scene(
  name: string,
  example: object,
  drawing: ReactElement,
  size: "lg" | "sm" | "xl" | "xs" = "xs",
): Scene {
  return {
    about: `date-picker.${name}.about`,
    draw: () => <Room size={size}>{drawing}</Room>,
    example,
    title: `date-picker.${name}.title`,
  };
}

export default specimen({
  about: "date-picker.about",
  id: "components/forms/date-picker",
  imports: 'import { DatePicker } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<DatePicker.RootProps>(recipe, {
      axes: {
        palette: {
          draw: (props) => <examples.holiday.Holiday {...props} />,
          example: examples.holiday,
        },
      },
      draw: (props) => (
        <Room size="xs">
          <examples.appointment.Appointment {...props} />
        </Room>
      ),
      example: examples.appointment,
      namespace: "date-picker",
      order: ["size", "variant", "palette", "status"],
    }),
    scene("ranged", examples.report, <examples.report.Report />, "sm"),
    scene("multiple", examples.daysOff, <examples.daysOff.DaysOff />),
    scene("monthly", examples.billing, <examples.billing.Billing />),
    scene("months", examples.availability, <examples.availability.Availability />, "xl"),
    scene("validated", examples.start, <examples.start.Start />),
    scene("localized", examples.german, <examples.german.German />),
    scene("selects", examples.birthday, <examples.birthday.Birthday />),
    scene("stated", examples.states, <examples.states.States />),
  ],
  title: "date-picker.title",
});
