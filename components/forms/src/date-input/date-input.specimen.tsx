/**
 * Catalogue page for the date input.
 *
 * @remarks
 *   `scenesOf` generates the size, look and status scenes from an appointment field, each in a room
 *   at the `xs` measure, because a date input fills its container. Hand-written scenes render a
 *   date with a time and a time zone, a range of two dates, a date in a validated field, one date
 *   in four locales, and the disabled, read-only and invalid states. The words are keys under
 *   `date-input` in `locales/en/specimen/date-input.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as appointment from "#date-input/examples/appointment.example.tsx";
import * as birth from "#date-input/examples/birth-date.example.tsx";
import * as locales from "#date-input/examples/locales.example.tsx";
import * as meeting from "#date-input/examples/meeting.example.tsx";
import * as states from "#date-input/examples/states.example.tsx";
import * as stay from "#date-input/examples/stay.example.tsx";
import { type RootProps } from "#date-input/index.ts";
import { recipe } from "#date-input/recipe.ts";

/**
 * Hand-written scene for a date with a time and a time zone.
 */
export const timed: Scene = {
  about: "date-input.timed.about",
  draw: () => (
    <Room size="xs">
      <meeting.Meeting />
    </Room>
  ),
  example: meeting,
  title: "date-input.timed.title",
};

/**
 * Hand-written scene for a range of two dates.
 */
export const ranged: Scene = {
  about: "date-input.ranged.about",
  draw: () => (
    <Room size="sm">
      <stay.Stay />
    </Room>
  ),
  example: stay,
  title: "date-input.ranged.title",
};

/**
 * Hand-written scene for a date in a validated field of a form.
 */
export const validated: Scene = {
  about: "date-input.validated.about",
  draw: () => (
    <Room size="xs">
      <birth.BirthDate />
    </Room>
  ),
  example: birth,
  title: "date-input.validated.title",
};

/**
 * Hand-written scene for one date in four locales.
 */
export const localized: Scene = {
  about: "date-input.localized.about",
  draw: () => (
    <Room size="xs">
      <locales.Locales />
    </Room>
  ),
  example: locales,
  title: "date-input.localized.title",
};

/**
 * Hand-written scene for the disabled, read-only and invalid states.
 */
export const stated: Scene = {
  about: "date-input.stated.about",
  draw: () => (
    <Room size="xs">
      <states.States />
    </Room>
  ),
  example: states,
  title: "date-input.stated.title",
};

export default specimen({
  about: "date-input.about",
  id: "components/forms/date-input",
  imports: 'import { DateInput } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <appointment.Appointment {...props} />
        </Room>
      ),
      example: appointment,
      namespace: "date-input",
      order: ["size", "variant", "status"],
    }),
    timed,
    ranged,
    validated,
    localized,
    stated,
  ],
  title: "date-input.title",
});
