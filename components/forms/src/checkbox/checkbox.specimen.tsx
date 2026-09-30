/**
 * Catalogue page for the checkbox.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes, palettes and statuses by looks, corners, alignment,
 *   spread and motion scenes, each from an example, with the box checked so the fill shows. The
 *   alignment scene renders in a room of a sidebar's width, so the label wraps. The states scene is
 *   hand-written, because off, on, partly on and disabled are props of the root and not recipe
 *   axes. The group scenes show a parent box over a group's channels, a limit, a horizontal group
 *   and a group checked on submit, and the group recipe's size scene draws the parent's group at
 *   each size. The field scene shows a checkbox described by a field's texts. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under
 *   `checkbox` in `locales/en/specimen/checkbox.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen, valuesOf } from "@stealthscale/specimen";

import { recipe as group } from "#checkbox/checkbox-group.recipe.ts";
import * as examples from "#checkbox/examples/index.ts";
import type * as Checkbox from "#checkbox/index.ts";
import { recipe } from "#checkbox/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["off", "on", "mixed", "disabled"] as const;

/**
 * Maps each state to the root props that put the box in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], Checkbox.RootProps>> = {
  disabled: { defaultChecked: true, disabled: true },
  mixed: { defaultChecked: "indeterminate" },
  off: { defaultChecked: false },
  on: { defaultChecked: true },
};

/**
 * Looks the states scene crosses the states with.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Hand-written scene for off, on, partly on and disabled in every look.
 */
export const states: Scene = {
  about: "checkbox.states.about",
  draw: () => (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="state" of={STATES}>
      {(state, variant) => <examples.terms.Terms {...STATED[state]} variant={variant} />}
    </Matrix>
  ),
  example: examples.terms,
  props: { defaultChecked: false, variant: "outline" },
  title: "checkbox.states.title",
};

/**
 * Hand-written scene for a group's parent box over three channels.
 */
export const everything: Scene = {
  about: "checkbox.everything.about",
  draw: () => <examples.notifications.Notifications />,
  example: examples.notifications,
  title: "checkbox.everything.title",
};

/**
 * Hand-written scene for a group that holds at most three values.
 */
export const limited: Scene = {
  about: "checkbox.limited.about",
  draw: () => (
    <Room size="sm">
      <examples.pinned.Pinned />
    </Room>
  ),
  example: examples.pinned,
  title: "checkbox.limited.title",
};

/**
 * Hand-written scene for a horizontal group of weekdays.
 */
export const inline: Scene = {
  about: "checkbox.inline.about",
  draw: examples.days.Days,
  example: examples.days,
  title: "checkbox.inline.title",
};

/**
 * Hand-written scene for a group a form checks on submit.
 */
export const required: Scene = {
  about: "checkbox.required.about",
  draw: () => (
    <Room size="sm">
      <examples.formats.Formats />
    </Room>
  ),
  example: examples.formats,
  title: "checkbox.required.title",
};

/**
 * Hand-written scene for a checkbox inside a field.
 */
export const consent: Scene = {
  about: "checkbox.consent.about",
  draw: () => (
    <Room size="sm">
      <examples.consent.Consent />
    </Room>
  ),
  example: examples.consent,
  title: "checkbox.consent.title",
};

export default specimen({
  about: "checkbox.about",
  id: "components/forms/checkbox",
  imports: 'import { Checkbox } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Checkbox.RootProps>(recipe, {
      axes: {
        align: {
          draw: (props) => (
            <Room size="xs">
              <examples.summary.Summary {...props} />
            </Room>
          ),
          example: examples.summary,
        },
        palette: { across: "variant" },
        spread: {
          direction: "column",
          draw: (props) => <examples.setting.Setting {...props} />,
          example: examples.setting,
        },
        status: { across: "variant" },
        variant: { across: "size" },
      },
      draw: (props) => <examples.terms.Terms {...props} />,
      example: examples.terms,
      namespace: "checkbox",
      order: ["variant", "palette", "status", "radius", "align", "spread", "motion"],
    }),
    states,
    everything,
    ...scenesOf<Checkbox.GroupProps>(group, {
      draw: (props) => <examples.notifications.Notifications {...props} />,
      example: examples.notifications,
      namespace: "checkbox.group",
    }),
    limited,
    inline,
    required,
    consent,
  ],
  title: "checkbox.title",
});
